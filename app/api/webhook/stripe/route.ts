import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import type Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";
import { sendOrderConfirmation } from "@/lib/resend";

/**
 * Stripe webhook handler for checkout.session.completed events.
 * Verifies the webhook signature, creates an order in Supabase,
 * and associates order items with the order.
 */
export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  // In demo mode (no real Stripe key), skip signature verification
  const isDemo =
    !process.env.STRIPE_SECRET_KEY ||
    process.env.STRIPE_SECRET_KEY.startsWith("sk_test_placeholder");

  let event: Stripe.Event;

  if (isDemo) {
    try {
      event = JSON.parse(body) as Stripe.Event;
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      );
    }
  } else {
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      console.error(`Webhook signature verification failed: ${message}`);
      return NextResponse.json(
        { error: `Webhook Error: ${message}` },
        { status: 400 }
      );
    }
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      await handleCheckoutComplete(session);
    } catch (err) {
      console.error("Error processing checkout session:", err);
      return NextResponse.json(
        { error: "Failed to process checkout" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}

/**
 * Processes a completed checkout session:
 * - Retrieves metadata from the session
 * - Creates the order in Supabase with status: confirmed
 * - Creates order_items from metadata
 * - Sends confirmation email via Resend
 */
async function handleCheckoutComplete(
  session: Stripe.Checkout.Session
): Promise<void> {
  const userId = session.metadata?.user_id ?? "unknown";
  const deliveryMethod = session.metadata?.delivery_method ?? "truck";
  const address = session.metadata?.address ?? "";
  const totalAmount = session.amount_total ?? 0;
  const customerEmail = session.customer_details?.email ?? session.customer_email ?? "";
  const itemsJson = session.metadata?.items ?? "[]";

  console.log("Processing completed checkout:", {
    sessionId: session.id,
    userId,
    deliveryMethod,
    address,
    totalAmount,
  });

  const supabase = await createClient();

  // 1. Create the order record
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: userId,
      status: "confirmed",
      delivery_method: deliveryMethod,
      delivery_address: address,
      total_amount: totalAmount,
      qr_code_token: crypto.randomUUID(),
    })
    .select()
    .single();

  if (orderError) {
    console.error("Failed to create order:", orderError.message);
    throw new Error(`Order insert failed: ${orderError.message}`);
  }

  // 2. Create order items from metadata
  try {
    const items: Array<{ product_id: string; quantity: number; price_cents: number }> =
      JSON.parse(itemsJson);

    if (items.length > 0) {
      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price_cents: item.price_cents,
      }));

      const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
      if (itemsError) {
        console.error("Failed to insert order_items:", itemsError.message);
      }
    }
  } catch {
    // items metadata may be malformed or missing; log but don't fail the order
    console.warn("Could not parse order items from session metadata");
  }

  // 3. Send confirmation email via Resend (only if API key is real)
  if (customerEmail && process.env.RESEND_API_KEY && !process.env.RESEND_API_KEY.includes("placeholder")) {
    try {
      await sendOrderConfirmation(customerEmail, order.id, totalAmount);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      console.warn(`Failed to send confirmation email: ${msg}`);
    }
  }

  console.log("Order created successfully:", order.id);
}

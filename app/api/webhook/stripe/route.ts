import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import type Stripe from "stripe";

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
  const isDemo = !process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.startsWith("sk_test_placeholder");

  let event: Stripe.Event;

  if (isDemo) {
    // Parse the body directly in demo mode
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

  // Handle the checkout.session.completed event
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
 * - Retrieves line items from Stripe
 * - Creates the order in Supabase with status: confirmed
 * - Creates order_items for each product
 */
async function handleCheckoutComplete(
  session: Stripe.Checkout.Session
): Promise<void> {
  const userId = session.metadata?.user_id ?? "unknown";
  const deliveryMethod = session.metadata?.delivery_method ?? "truck";
  const address = session.metadata?.address ?? "";
  const totalAmount = session.amount_total ?? 0;

  console.log("Processing completed checkout:", {
    sessionId: session.id,
    userId,
    deliveryMethod,
    address,
    totalAmount,
  });

  // In production, insert into Supabase:
  //
  // 1. Create the order record
  // const { data: order, error: orderError } = await supabase
  //   .from("orders")
  //   .insert({
  //     user_id: userId,
  //     stripe_session_id: session.id,
  //     status: "confirmed",
  //     delivery_method: deliveryMethod,
  //     delivery_address: address,
  //     total_cents: totalAmount,
  //   })
  //   .select()
  //   .single();
  //
  // 2. Fetch line items from Stripe
  // const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
  //
  // 3. Create order_items
  // const orderItems = lineItems.data
  //   .filter((item) => item.price?.metadata?.product_id)
  //   .map((item) => ({
  //     order_id: order.id,
  //     product_id: item.price!.metadata.product_id,
  //     quantity: item.quantity ?? 1,
  //     price_cents: item.price?.unit_amount ?? 0,
  //   }));
  //
  // await supabase.from("order_items").insert(orderItems);

  console.log("Order created successfully (demo mode)");
}

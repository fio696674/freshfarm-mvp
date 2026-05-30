"use server";

import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

export type DeliveryMethod = "truck" | "drone" | "kiosk";

export interface CartItemInput {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CheckoutSessionResult {
  url: string;
}

const DELIVERY_FEES: Record<DeliveryMethod, number> = {
  truck: 499, // $4.99
  drone: 999, // $9.99
  kiosk: 0, // Free
};

/**
 * Creates a Stripe Checkout session for the current cart.
 * Authenticates the user via Supabase, builds line items from cart,
 * and returns a redirect URL for the Stripe-hosted checkout page.
 */
export async function createCheckoutSession(
  cartItems: CartItemInput[],
  deliveryMethod: DeliveryMethod,
  address: Address
): Promise<CheckoutSessionResult> {
  if (!cartItems.length) {
    throw new Error("Cart is empty");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // For the demo, allow unauthenticated checkouts (no real Stripe key)
  const userId = user?.id ?? "demo-user";

  const deliveryFee = DELIVERY_FEES[deliveryMethod];
  const addressString = `${address.street}, ${address.city}, ${address.state} ${address.zipCode}`;

  // Build Stripe line items from cart
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
    cartItems.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          metadata: { product_id: item.id },
        },
        unit_amount: item.price,
      },
      quantity: item.quantity,
    }));

  // Add delivery as a line item if there's a fee
  if (deliveryFee > 0) {
    const deliveryLabels: Record<DeliveryMethod, string> = {
      truck: "Truck Delivery",
      drone: "Drone Delivery",
      kiosk: "Kiosk Pickup",
    };
    lineItems.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: deliveryLabels[deliveryMethod],
          metadata: { type: "delivery" },
        },
        unit_amount: deliveryFee,
      },
      quantity: 1,
    });
  }

  // In production, create a real Stripe checkout session.
  // For the demo (no real key), return a mock URL so the UI still works.
  const isDemo = !process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.startsWith("sk_test_placeholder");

  if (isDemo) {
    const mockSessionId = `cs_demo_${Date.now()}`;
    return {
      url: `/order-confirmation/${mockSessionId}?demo=true`,
    };
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: lineItems,
    metadata: {
      user_id: userId,
      delivery_method: deliveryMethod,
      address: addressString,
    },
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"}/order-confirmation/{CHECKOUT_SESSION_ID}?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"}/checkout`,
  });

  if (!session.url) {
    throw new Error("Failed to create checkout session");
  }

  return { url: session.url };
}

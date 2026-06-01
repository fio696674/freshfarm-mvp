"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/stores/cart";
import { cn } from "@/lib/utils";
import { createCheckoutSession } from "@/actions/orders";
import { AddressForm, type Address } from "@/components/checkout/AddressForm";
import {
  DeliveryMethodSelect,
  type DeliveryMethod,
} from "@/components/checkout/DeliveryMethodSelect";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";

// Delivery fees now defined inside handlePay

const STEPS = ["Address", "Delivery", "Payment"] as const;

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCart((s) => s.items);
  const clearCart = useCart((s) => s.clearCart);

  const [step, setStep] = useState(0);
  const [address, setAddress] = useState<Address>({
    street: "",
    city: "",
    state: "",
    zipCode: "",
  });
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("truck");
  const [isProcessing, setIsProcessing] = useState(false);

  // Simple delivery radius check — Orlando & Miami zip prefixes
  const isWithinDeliveryRadius =
    address.zipCode.trim() === "" ||
    /^(32[0-9]{2}|33[0-9]{2}|34[0-9]{2})/.test(address.zipCode.trim());

  // Redirect if cart is empty
  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6">
        <div className="flex flex-col items-center gap-4">
          <span className="text-6xl" aria-hidden="true">
            🥚
          </span>
          <h1 className="text-2xl font-light text-stone-900">
            Your cart is empty
          </h1>
          <p className="text-stone-500">
            Add some farm-fresh eggs before checking out.
          </p>
          <Link
            href="/products"
            className="mt-4 inline-block rounded-full bg-terra-500 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-terra-600 active:bg-terra-700"
          >
            Browse Products
          </Link>
        </div>
      </section>
    );
  }

  const canProceedFromAddress =
    address.street.trim() !== "" &&
    address.city.trim() !== "" &&
    address.state.trim() !== "" &&
    address.zipCode.trim() !== "";

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handlePay = async () => {
    setIsProcessing(true);
    try {
      // Create order in Supabase first
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      const DELIVERY_FEE_MAP: Record<DeliveryMethod, number> = { truck: 499, drone: 999, kiosk: 0 };
      const cartSubtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const deliveryFee = DELIVERY_FEE_MAP[deliveryMethod];
      const cartTotal = cartSubtotal + deliveryFee;

      if (user) {
        const { data: order } = await supabase.from("orders").insert({
          user_id: user.id,
          status: "confirmed",
          delivery_method: deliveryMethod,
          delivery_address: address,
          subtotal: cartSubtotal,
          delivery_fee: deliveryFee,
          total: cartTotal,
          stripe_payment_id: ,
          qr_code_token: crypto.randomUUID(),
        }).select().single();

        if (order) {
          await supabase.from("order_items").insert(
            items.map((item) => ({
              order_id: order.id,
              product_id: item.id,
              quantity: item.quantity,
              unit_price: item.price,
            }))
          );
        }
      }

      const result = await createCheckoutSession(
        items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        deliveryMethod,
        address
      );

      clearCart();

      if (result.url.startsWith("http")) {
        window.location.href = result.url;
      } else {
        router.push(result.url);
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setIsProcessing(false);
    }
  };

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-light text-stone-900">Checkout</h1>
        <Link
          href="/cart"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-500 transition-colors hover:text-terra-600"
        >
          <ShoppingCart className="size-4" />
          Back to Cart
        </Link>
      </div>

      {/* Progress indicator */}
      <div className="mt-8 flex items-center justify-center gap-3">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-3">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "size-3 rounded-full transition-colors",
                  i <= step ? "bg-green-500" : "bg-stone-200"
                )}
              />
              <span
                className={cn(
                  "text-xs font-medium transition-colors",
                  i <= step ? "text-green-600" : "text-stone-400"
                )}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  "mb-5 h-0.5 w-12 rounded-full transition-colors",
                  i < step ? "bg-green-500" : "bg-stone-200"
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step content + sidebar */}
      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
        {/* Main content */}
        <div className="rounded-2xl border border-stone-100 bg-white p-8">
          {/* Step 1: Address */}
          {step === 0 && (
            <div>
              <h2 className="text-xl font-semibold text-stone-900">
                Delivery Address
              </h2>
              <p className="mt-1 text-sm text-stone-500">
                Where should we deliver your eggs?
              </p>
              <div className="mt-6">
                <AddressForm value={address} onChange={setAddress} />
              </div>
              {/* Delivery radius warning */}
              {!isWithinDeliveryRadius && address.zipCode.trim() !== "" && (
                <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 text-lg" aria-hidden="true">
                      🚚
                    </span>
                    <div>
                      <p className="text-sm font-medium text-amber-800">
                        Delivery may not be available at this address
                      </p>
                      <p className="mt-1 text-xs text-amber-700">
                        We currently deliver to Orlando and Miami areas (zip codes 32xxx–34xxx).
                        We&apos;ll confirm availability after you place your order.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!canProceedFromAddress}
                  className="rounded-full bg-terra-500 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-terra-600 active:bg-terra-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Delivery Method */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-semibold text-stone-900">
                Delivery Method
              </h2>
              <p className="mt-1 text-sm text-stone-500">
                Choose how you&apos;d like to receive your order.
              </p>
              <div className="mt-6">
                <DeliveryMethodSelect
                  value={deliveryMethod}
                  onChange={setDeliveryMethod}
                />
              </div>
              <div className="mt-8 flex justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  className="rounded-full border border-stone-200 px-6 py-3 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-50"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="rounded-full bg-terra-500 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-terra-600 active:bg-terra-700"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Payment Summary */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-semibold text-stone-900">
                Confirm & Pay
              </h2>
              <p className="mt-1 text-sm text-stone-500">
                Review your order before payment.
              </p>

              {/* Address summary */}
              <div className="mt-6 rounded-xl border border-stone-100 bg-stone-50 p-4">
                <h3 className="text-sm font-semibold text-stone-700">
                  Delivery Address
                </h3>
                <p className="mt-1 text-sm text-stone-600">
                  {address.street}, {address.city}, {address.state}{" "}
                  {address.zipCode}
                </p>
                <button
                  type="button"
                  onClick={() => setStep(0)}
                  className="mt-2 text-xs font-medium text-terra-500 hover:text-terra-600"
                >
                  Edit
                </button>
              </div>

              <div className="mt-8 flex justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  className="rounded-full border border-stone-200 px-6 py-3 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-50"
                >
                  Back
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order summary sidebar */}
        <div>
          <OrderSummary
            items={items}
            deliveryMethod={deliveryMethod}
            onPay={step === 2 ? handlePay : handleNext}
            isProcessing={isProcessing}
          />
        </div>
      </div>
    </section>
  );
}

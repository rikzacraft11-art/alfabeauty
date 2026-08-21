import type { Metadata } from "next";
import { CheckoutForm } from "@/features/commerce/components/checkout-form";

export const metadata: Metadata = {
  title: "Checkout — Complete Your Order",
  description: "Complete your order with secure payment via Midtrans.",
  alternates: { canonical: "/checkout" },
};

export default function CheckoutPage(): React.JSX.Element {
  return (
    <main id="main-content" className="relative z-10 min-h-screen bg-background pt-[var(--header-height)]">
      <CheckoutForm />
    </main>
  );
}

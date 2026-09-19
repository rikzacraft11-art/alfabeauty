import type { Metadata } from "next";
import { CheckoutForm } from "@/features/commerce";
import { SITE_BASE_URL } from "@/shared/lib/config";

const baseUrl = SITE_BASE_URL;

export const metadata: Metadata = {
  title: "Checkout — Complete Your Order",
  description: "Complete your order with secure payment via Midtrans.",
  alternates: { canonical: `${baseUrl}/checkout` },
  robots: { index: false, follow: false, nocache: true },
};

export default function CheckoutPage(): React.JSX.Element {
  return (
    <main id="main-content" className="relative z-10 min-h-[80dvh] bg-background pt-[var(--header-height)]">
      <CheckoutForm />
    </main>
  );
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout — Complete Your Order",
  description: "Complete your order with secure payment via Midtrans.",
  alternates: { canonical: "/checkout" },
};

export default function CheckoutPage(): React.JSX.Element {
  return (
    <main id="main-content" className="relative z-10 bg-background">
      <section className="container mx-auto px-4 py-20 min-h-[60vh]">
        <h1 className="text-h1 font-bold tracking-tight text-foreground mb-4">
          Checkout
        </h1>
        <p className="text-body text-muted-foreground">
          Checkout page — coming soon. Secure payment powered by Midtrans.
        </p>
      </section>
    </main>
  );
}

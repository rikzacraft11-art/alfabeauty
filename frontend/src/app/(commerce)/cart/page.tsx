import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cart — Your Shopping Cart",
  description: "Review items in your shopping cart before checkout.",
  alternates: { canonical: "/cart" },
};

export default function CartPage(): React.JSX.Element {
  return (
    <main id="main-content" className="relative z-10 bg-background">
      <section className="container mx-auto px-4 py-20 min-h-[60vh]">
        <h1 className="text-h1 font-bold tracking-tight text-foreground mb-4">
          Shopping Cart
        </h1>
        <p className="text-body text-muted-foreground">
          Your cart is empty. Start shopping to add items.
        </p>
      </section>
    </main>
  );
}

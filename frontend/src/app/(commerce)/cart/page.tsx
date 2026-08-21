import type { Metadata } from "next";
import { CartContent } from "@/features/commerce/components/cart-content";

export const metadata: Metadata = {
  title: "Cart — Your Shopping Cart",
  description: "Review items in your shopping cart before checkout.",
  alternates: { canonical: "/cart" },
};

export default function CartPage(): React.JSX.Element {
  return (
    <main id="main-content" className="relative z-10 min-h-screen bg-background pt-[var(--header-height)]">
      <CartContent />
    </main>
  );
}

import type { Metadata } from "next";
import { CartContent } from "@/features/commerce";
import { SITE_BASE_URL } from "@/shared/lib/config";

const baseUrl = SITE_BASE_URL;

export const metadata: Metadata = {
  title: "Cart — Your Shopping Cart",
  description: "Review items in your shopping cart before checkout.",
  alternates: { canonical: `${baseUrl}/cart` },
  robots: { index: false, follow: false, nocache: true },
};

export default function CartPage(): React.JSX.Element {
  return (
    <main id="main-content" className="relative z-10 min-h-[80dvh] bg-background pt-[var(--header-height)]">
      <CartContent />
    </main>
  );
}

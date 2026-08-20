import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop — Professional Haircare Products",
  description:
    "Browse and purchase professional haircare products from leading Italian and Spanish brands. Fast delivery across Indonesia.",
  alternates: { canonical: "/shop" },
};

export default function ShopPage(): React.JSX.Element {
  return (
    <main id="main-content" className="relative z-10 bg-background">
      <section className="container mx-auto px-4 py-20 min-h-[60vh]">
        <h1 className="text-h1 font-bold tracking-tight text-foreground mb-4">
          Shop
        </h1>
        <p className="text-body text-muted-foreground max-w-2xl">
          Professional haircare products — coming soon. Browse our complete
          catalog of premium brands from Italy and Spain.
        </p>
      </section>
    </main>
  );
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ — Frequently Asked Questions",
  description: "Find answers to common questions about Alfa Beauty products, ordering, shipping, and partnerships.",
  alternates: { canonical: "/faq" },
};

export default function FAQPage(): React.JSX.Element {
  return (
    <main id="main-content" className="relative z-10 bg-background">
      <section className="container mx-auto px-4 py-20 min-h-[60vh]">
        <h1 className="text-h1 font-bold tracking-tight text-foreground mb-4">
          Frequently Asked Questions
        </h1>
        <p className="text-body text-muted-foreground max-w-2xl">
          FAQ page — coming soon. Find answers to common questions about our products, ordering, and partnerships.
        </p>
      </section>
    </main>
  );
}

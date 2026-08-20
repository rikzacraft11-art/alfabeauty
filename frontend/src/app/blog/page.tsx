import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — Industry Insights & News",
  description: "Read the latest articles about professional haircare trends, techniques, and industry news from Alfa Beauty.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage(): React.JSX.Element {
  return (
    <main id="main-content" className="relative z-10 bg-background">
      <section className="container mx-auto px-4 py-20 min-h-[60vh]">
        <h1 className="text-h1 font-bold tracking-tight text-foreground mb-4">
          Blog
        </h1>
        <p className="text-body text-muted-foreground max-w-2xl">
          Industry insights, haircare trends, and professional tips — coming soon.
        </p>
      </section>
    </main>
  );
}

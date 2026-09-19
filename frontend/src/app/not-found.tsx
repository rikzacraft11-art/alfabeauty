import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/shared/components/ui";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you are looking for does not exist or has been moved.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound(): React.JSX.Element {
  return (
    <main
      id="main-content"
      className="relative z-10 flex min-h-[80dvh] items-center justify-center bg-background px-6 pt-[var(--header-height)]"
    >
      <div className="text-center">
        <p className="eyebrow text-brand-crimson">Page Not Found</p>
        <h1 className="heading-display mt-4">404</h1>
        <p className="body-prose mx-auto mt-6 max-w-md text-text-muted">
          The page you&apos;re looking for doesn&apos;t exist or has been
          moved. Let us help you find what you need.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button
            asChild
            size="lg"
            className="bg-foreground px-8 py-6 text-cta font-bold text-white hover:bg-foreground/90 transition-colors"
          >
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-border-warm px-8 py-6 text-cta font-bold transition-colors duration-300"
          >
            <Link href="/shop">Browse Products</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}

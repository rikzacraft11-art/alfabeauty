import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NotFound(): React.JSX.Element {
  return (
    <>
      <main id="main-content" className="relative z-10 flex min-h-[80dvh] items-center justify-center bg-background px-6 pt-[var(--header-height)]">
        <div className="text-center">
          <p className="eyebrow">Page Not Found</p>
          <h1 className="heading-display mt-4">404</h1>
          <p className="body-prose mx-auto mt-6 max-w-md text-text-muted">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved. Let us help you find what you need.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button
              asChild
              size="lg"
              className="bg-foreground px-8 py-6 text-[11px] font-bold uppercase tracking-[0.2em] text-white hover:bg-foreground/90"
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
              className="border-border-warm px-8 py-6 text-[11px] font-bold uppercase tracking-[0.2em] transition-colors duration-300"
            >
              <Link href="/shop">Browse Products</Link>
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}

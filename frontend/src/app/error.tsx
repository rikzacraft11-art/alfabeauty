"use client";

import Link from "next/link";
import { Button } from "@/shared/components/ui/button";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}): React.JSX.Element {
  return (
    <>
      <main id="main-content" className="relative z-10 flex min-h-[80dvh] items-center justify-center bg-background px-6 pt-[var(--header-height)]">
        <div className="text-center">
          <p className="eyebrow">Something went wrong</p>
          <h1 className="heading-display mt-4">Error</h1>
          <p className="body-prose mx-auto mt-6 max-w-md text-text-muted">
            An unexpected error occurred. Please try again or return to the
            homepage.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button
              onClick={reset}
              size="lg"
              className="bg-foreground px-8 py-6 text-[11px] font-bold uppercase tracking-[0.2em] text-white hover:bg-foreground/90"
            >
              Try Again
            </Button>
            <Button
              variant="outline"
              asChild
              size="lg"
              className="border-border-warm px-8 py-6 text-[11px] font-bold uppercase tracking-[0.2em] transition-colors duration-300"
            >
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}

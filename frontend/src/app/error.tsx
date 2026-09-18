"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function RootError({
  error,
  reset,
}: ErrorBoundaryProps): React.JSX.Element {
  React.useEffect(() => {
    console.error("[ErrorBoundary] Unhandled route error:", error);
  }, [error]);

  return (
    <main
      id="main-content"
      role="alert"
      aria-live="assertive"
      className="relative z-10 flex min-h-[80dvh] items-center justify-center bg-background px-6 pt-[var(--header-height)]"
    >
      <div className="text-center">
        <p className="eyebrow text-brand-crimson">Something went wrong</p>
        <h1 className="heading-display mt-4">Error Encountered</h1>
        <p className="body-prose mx-auto mt-6 max-w-md text-text-muted">
          An unexpected error occurred. Please try again or return to the
          homepage.
        </p>

        {error?.digest && (
          <p className="mt-3 text-tiny font-mono text-text-muted/60">
            Reference ID: {error.digest}
          </p>
        )}

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button
            onClick={reset}
            size="lg"
            className="bg-foreground px-8 py-6 text-cta font-bold text-white hover:bg-foreground/90 transition-colors"
          >
            Try Again
          </Button>
          <Button
            variant="outline"
            asChild
            size="lg"
            className="border-border-warm px-8 py-6 text-cta font-bold transition-colors duration-300"
          >
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}

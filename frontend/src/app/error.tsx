"use client";

import { useEffect } from "react";
import Button from "@/components/ui/Button";
import ButtonLink from "@/components/ui/ButtonLink";

// Global error boundary page (Next.js App Router).
// Paket A UX hardening: provide a friendly fallback instead of a blank screen.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Best-effort console logging for local debugging.
    // Server-side logging is handled by the Lead API / infra.
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-2xl space-y-3">
      <h1 className="type-h2">Something went wrong</h1>
      <p className="type-body">Please try again. If the issue persists, contact us.</p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button type="button" onClick={() => reset()}>
          Try again
        </Button>
        <ButtonLink href="/en" variant="secondary">
          Go home
        </ButtonLink>
      </div>
      {error?.digest ? (
        <p className="type-data text-muted-soft">Ref: {error.digest}</p>
      ) : null}
    </div>
  );
}

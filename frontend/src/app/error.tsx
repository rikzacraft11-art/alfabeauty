"use client";

import { useEffect } from "react";
import Button from "@/components/ui/Button";
import Link from "next/link";

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
      <p className="type-body text-zinc-700">Please try again. If the issue persists, contact us.</p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button type="button" onClick={() => reset()}>
          Try again
        </Button>
        <Link
          href="/en"
          className="inline-flex h-10 items-center justify-center border border-zinc-200 bg-white px-4 type-data text-zinc-900 hover:bg-zinc-50"
        >
          Go home
        </Link>
      </div>
      {error?.digest ? (
        <p className="type-data text-zinc-500">Ref: {error.digest}</p>
      ) : null}
    </div>
  );
}

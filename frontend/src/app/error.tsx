"use client";

import { useEffect } from "react";
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
      <h1 className="text-2xl font-semibold tracking-tight">Something went wrong</h1>
      <p className="text-sm text-zinc-700">
        Please try again. If this keeps happening, contact us via WhatsApp.
      </p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          className="inline-flex h-11 items-center justify-center rounded-full bg-zinc-900 px-5 text-sm font-semibold text-white hover:bg-zinc-800"
          onClick={() => reset()}
        >
          Try again
        </button>
        <Link
          className="inline-flex h-11 items-center justify-center rounded-full border border-zinc-300 bg-white px-5 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
          href="/"
        >
          Go home
        </Link>
      </div>
      {error?.digest ? (
        <p className="text-xs text-zinc-500">Ref: {error.digest}</p>
      ) : null}
    </div>
  );
}

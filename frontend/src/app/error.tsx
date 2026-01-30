"use client";

import { useEffect } from "react";
import ErrorState from "@/components/ui/ErrorState";

// Global error boundary page (Next.js App Router).
// Paket A UX hardening: provide a friendly fallback instead of a blank screen.
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Server-side logging is handled by infra/Sentry
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <ErrorState
        title="Something went wrong!"
        description="Please try again. If the issue persists, contact technical support."
        retry={reset}
        showHome={true}
      />
      {error?.digest && (
        <div className="fixed bottom-4 right-4 type-legal text-muted opacity-50 font-mono">
          Ref: {error.digest}
        </div>
      )}
    </div>
  );
}

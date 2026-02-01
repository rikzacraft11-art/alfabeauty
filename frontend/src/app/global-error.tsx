"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import "./globals.css";

// Note: We avoid next/font/google here to prevent build-time fetch timeouts.
// Instead, we rely on the manual CSS import in globals.css.

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="antialiased bg-background text-foreground min-h-screen flex items-center justify-center font-sans">
        {/* Manually replicating ErrorState.tsx style since we can't easily import complex components in global-error if they depend on Contexts not available at root */}
        <div className="text-center p-6 max-w-md">
          <div className="inline-flex rounded-full bg-error/10 p-4 mb-6">
            <svg
              className="h-10 w-10 text-error"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          <h1 className="type-h2 mb-2">System Error</h1>
          <p className="type-body text-muted mb-8">
            A critical error occurred. Please try again.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={() => reset()}
              className="ui-btn-primary ui-radius-tight px-6 py-2.5"
            >
              Try again
            </button>
            {/* Hard reload for global error recovery */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/id"
              className="px-6 py-2.5 type-ui-strong text-foreground/70 hover:text-foreground transition-colors"
            >
              Return Home
            </a>
          </div>

          {error.digest && (
            <div className="mt-8 p-3 bg-subtle rounded text-left">
              <p className="type-ui-xs font-mono text-muted">Error ID: <span className="select-all">{error.digest}</span></p>
            </div>
          )}
        </div>
      </body>
    </html>
  );
}

"use client";

import { useEffect } from "react";
import "./globals.css";

// Note: We avoid next/font/google here to prevent build-time fetch timeouts (BLD-03/04).
// Instead, we rely on the manual CSS import in globals.css.

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log validity of error to error service (e.g. Sentry)
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="antialiased bg-background text-foreground flex min-h-screen flex-col items-center justify-center p-4 text-center font-sans" style={{ fontFamily: 'var(--font-inter)' }}>
        <div className="max-w-md space-y-6">
          <div className="space-y-2">
            <h1 className="type-h2">Something went wrong</h1>
            <p className="type-body text-muted-strong">
              A critical error occurred. We apologize for the inconvenience.
            </p>
            {error.digest && (
              <div className="mt-4 p-3 bg-subtle rounded text-xs font-mono text-muted text-left">
                <p>Error ID: <span className="select-all">{error.digest}</span></p>
                <p>Please quote this ID when contacting support.</p>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={() => reset()}
              className="ui-btn-primary ui-radius-tight px-6 py-2.5"
            >
              Try again
            </button>
            <a
              href={`mailto:support@alfabeauty.co.id?subject=System%20Error%20Report&body=Error%20ID:%20${error.digest}%0D%0ATimestamp:%20${new Date().toISOString()}%0D%0A%0D%0APlease%20describe%20what%20you%20were%20doing:`}
              className="px-6 py-2.5 text-sm font-medium text-muted-strong hover:text-foreground transition-colors"
            >
              Contact Support
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}

import * as React from "react";

export function CatalogLoadingSkeleton({
    label = "Loading product catalog...",
}: {
    label?: string;
}): React.JSX.Element {
    return (
        <div
            role="status"
            aria-live="polite"
            aria-busy="true"
            className="min-h-[60dvh] bg-background flex flex-col items-center justify-center p-8"
        >
            <div className="h-10 w-10 animate-pulse rounded-full bg-brand-crimson/20 border-2 border-brand-crimson/40 mb-4" />
            <span className="sr-only">{label}</span>
        </div>
    );
}

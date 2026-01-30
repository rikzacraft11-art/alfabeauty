"use client";

import { useEffect } from "react";
import ErrorState from "@/components/ui/ErrorState";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <main className="min-h-screen pt-24 pb-16 flex items-center justify-center">
            <ErrorState
                title="Unable to load education hub"
                description="We couldn't load the requested content at this time. Please try refreshing the page."
                retry={reset}
            />
        </main>
    );
}

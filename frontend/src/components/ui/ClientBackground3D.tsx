"use client";

import dynamic from "next/dynamic";

// Dynamic import for 3D background (client-side only, no SSR)
const InteractiveBackground3DComponent = dynamic(
    () => import("@/components/ui/InteractiveBackground3D"),
    { ssr: false }
);

/**
 * ClientBackground3D: Client wrapper for 3D background
 * Wraps the dynamic import to be usable in async server components
 */
export default function ClientBackground3D() {
    return <InteractiveBackground3DComponent />;
}

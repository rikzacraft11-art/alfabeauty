"use client";

import { useEffect, useState } from "react";

/**
 * Small matchMedia helper.
 * Keeps behavior consistent across components that need breakpoint-accurate logic.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;

    const media = window.matchMedia(query);

    function onChange() {
      setMatches(Boolean(media.matches));
    }

    onChange();

    // Support older Safari.
    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    }

    media.addListener(onChange);
    return () => media.removeListener(onChange);
  }, [query]);

  return matches;
}

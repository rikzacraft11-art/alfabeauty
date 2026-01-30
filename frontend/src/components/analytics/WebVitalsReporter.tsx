"use client";

import { useEffect } from "react";
import { onCLS, onINP, onLCP } from "web-vitals";

export default function WebVitalsReporter() {
  useEffect(() => {
    const report = (_metric: {
      id: string;
      name: string;
      value: number;
      delta: number;
      rating?: string;
      navigationType?: string;
    }) => {
      // Internal RUM /api/rum deprecated (ITIL).
      // Web Vitals can be viewed in Vercel Analytics or GA4 if configured via reportWebVitals.
      if (process.env.NODE_ENV === "development") {

      }
    };

    // Minimal CWV set per Paket A UAT-16 / ADR-0002.
    onLCP(report);
    onCLS(report);
    onINP(report);
  }, []);

  return null;
}

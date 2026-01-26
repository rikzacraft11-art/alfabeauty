"use client";

import { useEffect } from "react";
import { logger } from "@/lib/logger";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          logger.info("Service Worker registered", { scope: registration.scope });
        })
        .catch((error) => {
          logger.error("Service Worker registration failed", { error });
        });
    }
  }, []);

  return null;
}

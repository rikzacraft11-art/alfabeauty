export const SANITY_API_VERSION = "2026-08-20";

export const sanityProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim() ?? "";
export const sanityDataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() || "production";
export const sanityReadToken = process.env.SANITY_API_READ_TOKEN?.trim() ?? "";

export const isSanityConfigured = Boolean(sanityProjectId && sanityDataset);

export type SanityContentMode = "fallback" | "required";

export function getSanityContentMode(): SanityContentMode {
  const value = process.env.SANITY_CONTENT_MODE?.trim().toLowerCase();
  return value === "required" ? "required" : "fallback";
}

export function getSanityStudioOrigin(): string {
  return process.env.SANITY_STUDIO_ORIGIN?.trim() || "http://localhost:3333";
}

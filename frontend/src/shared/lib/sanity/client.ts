import "server-only";

import { draftMode } from "next/headers";
import { createClient, type QueryParams } from "next-sanity";
import {
  getSanityStudioOrigin,
  isSanityConfigured,
  SANITY_API_VERSION,
  sanityDataset,
  sanityProjectId,
  sanityReadToken,
} from "./env";

export const sanityClient = createClient({
  projectId: sanityProjectId || "missing-project-id",
  dataset: sanityDataset,
  apiVersion: SANITY_API_VERSION,
  useCdn: true,
  perspective: "published",
});

type SanityFetchOptions = {
  query: string;
  params?: QueryParams;
  tags?: string[];
};

export async function sanityFetchPublished<Result>({
  query,
  params = {},
  tags = [],
}: SanityFetchOptions): Promise<Result | null> {
  if (!isSanityConfigured) return null;

  const client = sanityReadToken
    ? sanityClient.withConfig({ token: sanityReadToken, useCdn: false })
    : sanityClient;

  return client.fetch<Result>(query, params, {
    next: { revalidate: 3600, tags },
  });
}

export async function sanityFetch<Result>({
  query,
  params = {},
  tags = [],
}: SanityFetchOptions): Promise<Result | null> {
  if (!isSanityConfigured) return null;

  const { isEnabled } = await draftMode();
  if (isEnabled && !sanityReadToken) {
    throw new Error("Sanity draft mode requires SANITY_API_READ_TOKEN.");
  }

  const client = sanityClient.withConfig(
    isEnabled
      ? {
          token: sanityReadToken,
          useCdn: false,
          perspective: "drafts",
          stega: { studioUrl: getSanityStudioOrigin() },
        }
      : sanityReadToken
        ? {
            token: sanityReadToken,
            useCdn: false,
            perspective: "published",
            stega: false,
          }
        : { useCdn: true, perspective: "published", stega: false },
  );

  return client.fetch<Result>(query, params, {
    ...(isEnabled
      ? { cache: "no-store" as const }
      : { next: { revalidate: 3600, tags } }),
  });
}

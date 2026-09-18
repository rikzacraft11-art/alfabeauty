import { NextResponse } from "next/server";
import { defineEnableDraftMode } from "next-sanity/draft-mode";
import { sanityClient } from "@/shared/lib/sanity/client";
import {
  isSanityConfigured,
  sanityReadToken,
} from "@/shared/lib/sanity/env";
import { HTTP_NO_STORE_HEADERS } from "@/shared/lib/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const { GET: enableDraftMode } = defineEnableDraftMode({
  client: sanityClient.withConfig({ token: sanityReadToken || "missing-read-token" }),
});

export async function GET(request: Request): Promise<Response> {
  if (!isSanityConfigured || !sanityReadToken) {
    return NextResponse.json(
      { error: "Draft preview is unavailable" },
      { status: 503, headers: HTTP_NO_STORE_HEADERS }
    );
  }
  const response = await enableDraftMode(request);
  for (const [key, value] of Object.entries(HTTP_NO_STORE_HEADERS)) {
    response.headers.set(key, value);
  }
  return response;
}

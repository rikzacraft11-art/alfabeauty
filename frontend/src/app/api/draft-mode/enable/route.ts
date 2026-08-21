import { NextResponse } from "next/server";
import { defineEnableDraftMode } from "next-sanity/draft-mode";
import { sanityClient } from "@/shared/lib/sanity/client";
import {
  isSanityConfigured,
  sanityReadToken,
} from "@/shared/lib/sanity/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const { GET: enableDraftMode } = defineEnableDraftMode({
  client: sanityClient.withConfig({ token: sanityReadToken || "missing-read-token" }),
});

export async function GET(request: Request): Promise<Response> {
  if (!isSanityConfigured || !sanityReadToken) {
    return NextResponse.json({ error: "Draft preview is unavailable" }, { status: 503 });
  }
  return enableDraftMode(request);
}

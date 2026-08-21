import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";
import { logWarn } from "@/shared/lib/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type WebhookPayload = {
  _type?: unknown;
  slug?: unknown;
};

const TYPE_TAGS: Record<string, string[]> = {
  productContent: ["sanity:catalog", "sanity:productContent"],
  brand: ["sanity:catalog", "sanity:brand"],
  productCategory: ["sanity:catalog", "sanity:productCategory"],
  siteSettings: ["sanity:siteSettings"],
};

function readSlug(value: unknown): string | null {
  const candidate =
    typeof value === "string"
      ? value
      : value && typeof value === "object" && "current" in value
        ? (value as { current?: unknown }).current
        : null;
  return typeof candidate === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(candidate)
    ? candidate
    : null;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const secret = process.env.SANITY_REVALIDATE_SECRET?.trim();
  if (!secret || secret.length < 32) {
    logWarn("sanity-webhook", "Revalidation secret is missing or too short.");
    return NextResponse.json({ ok: false, error: "Webhook unavailable" }, { status: 503 });
  }

  try {
    const { body, isValidSignature } = await parseBody<WebhookPayload>(request, secret);
    if (isValidSignature !== true) {
      return NextResponse.json({ ok: false, error: "Invalid signature" }, { status: 401 });
    }

    const documentType = typeof body?._type === "string" ? body._type : "";
    const tags = TYPE_TAGS[documentType];
    if (!tags) {
      return NextResponse.json({ ok: false, error: "Unsupported document type" }, { status: 400 });
    }

    const slug = documentType === "productContent" ? readSlug(body?.slug) : null;
    const tagsToRevalidate = slug ? [...tags, `sanity:product:${slug}`] : tags;
    for (const tag of tagsToRevalidate) revalidateTag(tag, "max");

    return NextResponse.json({ ok: true, revalidated: tagsToRevalidate });
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid webhook payload" }, { status: 400 });
  }
}

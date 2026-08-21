import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { getCommerceMode } from "@/shared/lib/commerce/env";
import { payDemoOrder } from "@/shared/lib/commerce/service";
import { assertSameOrigin, clientIdentifierHash } from "@/shared/lib/commerce/security";
import { consumeStoredRateLimit } from "@/shared/lib/commerce/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const requestSchema = z.object({ orderToken: z.string().uuid() });

export async function POST(request: NextRequest): Promise<NextResponse> {
  if (getCommerceMode() !== "demo") return NextResponse.json({ ok: false }, { status: 404 });
  try {
    assertSameOrigin(request);
    const parsed = requestSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ ok: false, error: "Invalid order" }, { status: 400 });
    const allowed = await consumeStoredRateLimit(
      "demo-payment",
      clientIdentifierHash(request),
      10,
      60,
    );
    if (!allowed) return NextResponse.json({ ok: false, error: "Too many requests" }, { status: 429 });
    const order = await payDemoOrder(parsed.data.orderToken);
    return order
      ? NextResponse.json({ ok: true, order })
      : NextResponse.json({ ok: false, error: "Order not found" }, { status: 404 });
  } catch {
    return NextResponse.json({ ok: false, error: "Demo payment rejected" }, { status: 400 });
  }
}


import { NextRequest, NextResponse } from "next/server";
import { checkoutSchema } from "@/shared/lib/commerce/contracts";
import { createCheckout } from "@/shared/lib/commerce/service";
import {
  assertSameOrigin,
  clientIdentifierHash,
  readGuestToken,
} from "@/shared/lib/commerce/security";
import { consumeStoredRateLimit } from "@/shared/lib/commerce/store";
import { logError, logWarn } from "@/shared/lib/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    assertSameOrigin(request);
    const guestToken = readGuestToken(request);
    if (!guestToken) return NextResponse.json({ ok: false, error: "Cart session missing" }, { status: 401 });
    const parsed = checkoutSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "Invalid checkout details" }, { status: 400 });
    }
    const allowed = await consumeStoredRateLimit(
      "checkout",
      clientIdentifierHash(request),
      5,
      10 * 60,
    );
    if (!allowed) return NextResponse.json({ ok: false, error: "Too many checkout attempts" }, { status: 429 });

    const checkout = await createCheckout(guestToken, parsed.data);
    return NextResponse.json({ ok: true, checkout });
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown-error";
    if (message.includes("Cart") || message.includes("stock") || message.includes("offer")) {
      logWarn("commerce-checkout", "Checkout validation failed.", { message });
      return NextResponse.json({ ok: false, error: "Cart is no longer valid" }, { status: 409 });
    }
    logError("commerce-checkout", "Checkout failed.", { message });
    return NextResponse.json({ ok: false, error: "Checkout unavailable" }, { status: 503 });
  }
}


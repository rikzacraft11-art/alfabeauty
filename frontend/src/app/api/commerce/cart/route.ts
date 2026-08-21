import { NextRequest, NextResponse } from "next/server";
import { cartMutationSchema } from "@/shared/lib/commerce/contracts";
import { getCart, updateCart } from "@/shared/lib/commerce/service";
import {
  assertSameOrigin,
  clientIdentifierHash,
  ensureGuestToken,
  readGuestToken,
  requestUsesHttps,
  setGuestCookie,
} from "@/shared/lib/commerce/security";
import { consumeStoredRateLimit } from "@/shared/lib/commerce/store";
import { logWarn } from "@/shared/lib/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    return NextResponse.json({ ok: true, cart: await getCart(readGuestToken(request)) });
  } catch (error) {
    logWarn("commerce-cart", "Cart read failed.", {
      message: error instanceof Error ? error.message : "unknown-error",
    });
    return NextResponse.json({ ok: false, error: "Cart unavailable" }, { status: 503 });
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    assertSameOrigin(request);
    const parsed = cartMutationSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "Invalid cart request" }, { status: 400 });
    }
    const allowed = await consumeStoredRateLimit(
      "cart",
      clientIdentifierHash(request),
      30,
      60,
    );
    if (!allowed) return NextResponse.json({ ok: false, error: "Too many requests" }, { status: 429 });

    const guest = ensureGuestToken(request);
    const cart = await updateCart(guest.token, parsed.data.commerceVariantId, parsed.data.quantity);
    const response = NextResponse.json({ ok: true, cart });
    if (guest.created) setGuestCookie(response, guest.token, requestUsesHttps(request));
    return response;
  } catch (error) {
    logWarn("commerce-cart", "Cart mutation rejected.", {
      message: error instanceof Error ? error.message : "unknown-error",
    });
    return NextResponse.json({ ok: false, error: "Unable to update cart" }, { status: 409 });
  }
}

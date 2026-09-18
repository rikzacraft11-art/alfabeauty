import { NextRequest, NextResponse } from "next/server";
import { midtransNotificationSchema } from "@/shared/lib/commerce/contracts";
import { getCommerceMode, getMidtransConfig } from "@/shared/lib/commerce/env";
import {
  fetchVerifiedMidtransStatus,
  normalizeMidtransEvent,
  verifyMidtransSignature,
} from "@/shared/lib/commerce/midtrans";
import { applyStoredPaymentEvent } from "@/shared/lib/commerce/store";
import { HTTP_NO_STORE_HEADERS } from "@/shared/lib/config";
import { logError, logWarn } from "@/shared/lib/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest): Promise<NextResponse> {
  if (getCommerceMode() !== "sandbox") {
    return NextResponse.json({ ok: false }, { status: 404, headers: HTTP_NO_STORE_HEADERS });
  }
  try {
    const raw = await request.text();
    if (raw.length > 64_000) {
      return NextResponse.json({ ok: false }, { status: 413, headers: HTTP_NO_STORE_HEADERS });
    }
    const payload: unknown = JSON.parse(raw);
    const notification = midtransNotificationSchema.parse(payload);
    const { serverKey } = getMidtransConfig();
    if (!verifyMidtransSignature(payload, serverKey)) {
      logWarn("midtrans-webhook", "Invalid notification signature.");
      return NextResponse.json({ ok: false }, { status: 401, headers: HTTP_NO_STORE_HEADERS });
    }

    const verifiedPayload = await fetchVerifiedMidtransStatus(notification.order_id);
    const verified = midtransNotificationSchema.parse(verifiedPayload);
    if (verified.order_id !== notification.order_id || verified.gross_amount !== notification.gross_amount) {
      logWarn("midtrans-webhook", "Status API response did not match notification.");
      return NextResponse.json({ ok: false }, { status: 409, headers: HTTP_NO_STORE_HEADERS });
    }
    const result = await applyStoredPaymentEvent(normalizeMidtransEvent(verifiedPayload));
    if (result === "amount_mismatch") {
      return NextResponse.json({ ok: false, result }, { status: 409, headers: HTTP_NO_STORE_HEADERS });
    }
    return NextResponse.json({ ok: true, result }, { headers: HTTP_NO_STORE_HEADERS });
  } catch (error) {
    logError("midtrans-webhook", "Notification processing failed.", {
      message: error instanceof Error ? error.message : "unknown-error",
    });
    return NextResponse.json({ ok: false }, { status: 400, headers: HTTP_NO_STORE_HEADERS });
  }
}


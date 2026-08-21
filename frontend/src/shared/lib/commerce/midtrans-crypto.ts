import { createHash, timingSafeEqual } from "node:crypto";

export function createMidtransSignature(args: {
  orderId: string;
  statusCode: string;
  grossAmount: string;
  serverKey: string;
}): string {
  return createHash("sha512")
    .update(`${args.orderId}${args.statusCode}${args.grossAmount}${args.serverKey}`, "utf8")
    .digest("hex");
}

export function signaturesMatch(expected: string, received: string): boolean {
  const normalized = received.toLowerCase();
  return (
    expected.length === normalized.length &&
    timingSafeEqual(Buffer.from(expected, "utf8"), Buffer.from(normalized, "utf8"))
  );
}


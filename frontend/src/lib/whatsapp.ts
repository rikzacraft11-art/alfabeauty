function normalizeNumberE164(input?: string): string | undefined {
  if (!input) return undefined;
  const trimmed = input.trim();
  if (trimmed.length === 0) return undefined;

  // Accept +62... or 62... or 08...; convert to digits suitable for wa.me.
  const digits = trimmed.replace(/\D/g, "");
  if (digits.startsWith("0")) {
    // Assume Indonesian number.
    return `62${digits.slice(1)}`;
  }
  if (digits.startsWith("62")) return digits;
  // Fallback: if it looks like a proper international number without +.
  return digits.length >= 10 ? digits : undefined;
}

export function buildWhatsAppHref(opts: {
  number?: string;
  message?: string;
  fallbackEmail?: string;
}): string {
  const waNumber = normalizeNumberE164(opts.number);
  const msg = (opts.message ?? "").trim();

  if (!waNumber) {
    if (opts.fallbackEmail) return `mailto:${opts.fallbackEmail}`;
    return "#";
  }

  const encoded = encodeURIComponent(msg);
  return `https://wa.me/${waNumber}?text=${encoded}`;
}

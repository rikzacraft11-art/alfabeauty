import en from "@/locales/en.json";
import id from "@/locales/id.json";

export type Locale = "en" | "id";

export function normalizeLocale(input: string | null | undefined): Locale {
  const v = (input ?? "").toLowerCase();
  if (v.startsWith("id")) return "id";
  return "en";
}

// Type for locale dictionary - inferred from the JSON structure
export type LocaleDict = typeof en;

const dict: Record<Locale, LocaleDict> = {
  en,
  id,
} as const;

export function t(locale: Locale): LocaleDict {
  return dict[locale];
}

// getLocalizedPath removed (Revert to Standard Sub-path Strategy)

export function formatDate(dateStr: string, locale: Locale): string {
  if (!dateStr) return "";
  try {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat(locale === "id" ? "id-ID" : "en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  } catch (e) {
    return dateStr;
  }
}

export function formatCurrency(amount: number, locale: Locale): string {
  return new Intl.NumberFormat(locale === "id" ? "id-ID" : "en-US", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

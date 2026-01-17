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

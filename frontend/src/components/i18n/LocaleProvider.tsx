"use client";

import { createContext, useCallback, useContext, useEffect, useMemo } from "react";

import type { Locale } from "@/lib/i18n";

type Ctx = {
  locale: Locale;
  setLocale: (_l: Locale) => void;
};

const LocaleContext = createContext<Ctx | null>(null);

const STORAGE_KEY = "alfab_locale";

function persistLocale(locale: Locale) {
  try {
    localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    // ignore
  }

  // Best-practice: persist locale in a cookie as well, so server-side features
  // (middleware, redirects, future locale-aware metadata) can access it.
  try {
    const maxAge = 60 * 60 * 24 * 365; // 1 year
    // Attribute names are case-insensitive, but use the canonical casing.
    document.cookie = `${STORAGE_KEY}=${locale}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
  } catch {
    // ignore
  }

  try {
    document.documentElement.lang = locale;
  } catch {
    // ignore
  }
}

export function LocaleProvider({
  children,
  defaultLocale = "en",
}: {
  children: React.ReactNode;
  defaultLocale?: Locale;
}) {
  // In this app, locale is encoded in the URL and the server layout validates it,
  // so `defaultLocale` is the single source of truth.
  const locale: Locale = defaultLocale;

  const setLocaleAndPersist = useCallback((l: Locale) => {
    // This does not change the route by itself; navigation is handled by callers.
    persistLocale(l);
  }, []);

  useEffect(() => {
    // Ensure the currently-resolved locale is persisted (including on navigation).
    persistLocale(locale);
  }, [locale]);

  const value = useMemo(() => ({ locale, setLocale: setLocaleAndPersist }), [locale, setLocaleAndPersist]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale must be used within <LocaleProvider>");
  }
  return ctx;
}

"use client";

import { usePathname, useRouter } from "next/navigation";

import { useLocale } from "@/components/i18n/LocaleProvider";

type LocaleToggleTone = "default" | "onMedia";

export default function LocaleToggle({ tone = "default" }: { tone?: LocaleToggleTone }) {
  const { locale, setLocale } = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function navigate(nextLocale: "en" | "id") {
    if (nextLocale === locale) return;

    // Update state first (persists to storage/cookie), then navigate.
    setLocale(nextLocale);

    const qs = typeof window !== "undefined" ? window.location.search.replace(/^\?/, "") : "";
    const current = pathname || "/";
    let nextPath = current;

    if (current === "/en" || current.startsWith("/en/")) {
      nextPath = current.replace(/^\/en(?=\/|$)/, `/${nextLocale}`);
    } else if (current === "/id" || current.startsWith("/id/")) {
      nextPath = current.replace(/^\/id(?=\/|$)/, `/${nextLocale}`);
    } else {
      nextPath = `/${nextLocale}${current}`;
    }

    router.push(qs ? `${nextPath}?${qs}` : nextPath);
  }

  const baseBtn = "type-ui-sm-wide ui-focus-ring ui-radius-tight h-8 px-2 underline-offset-4";

  const activeClass = tone === "onMedia" ? "text-background underline" : "text-foreground underline";
  const inactiveClass = tone === "onMedia" ? "text-background/80 hover:text-background" : "text-foreground-muted hover:text-foreground";
  const sepClass = tone === "onMedia" ? "text-background/70" : "text-muted-soft";

  return (
    <div className="inline-flex items-center gap-2 bg-transparent">
      <button
        type="button"
        onClick={() => navigate("en")}
        className={`${baseBtn} ${locale === "en" ? activeClass : inactiveClass}`}
        aria-pressed={locale === "en"}
      >
        EN
      </button>
      <span className={`select-none ${sepClass}`} aria-hidden="true">
        /
      </span>
      <button
        type="button"
        onClick={() => navigate("id")}
        className={`${baseBtn} ${locale === "id" ? activeClass : inactiveClass}`}
        aria-pressed={locale === "id"}
      >
        ID
      </button>
    </div>
  );
}

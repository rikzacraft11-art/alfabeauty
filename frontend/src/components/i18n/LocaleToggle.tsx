"use client";

import { usePathname, useRouter } from "next/navigation";

import { useLocale } from "@/components/i18n/LocaleProvider";

export default function LocaleToggle() {
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

  return (
    <div className="inline-flex items-center border border-zinc-200 bg-white">
      <button
        type="button"
        onClick={() => navigate("en")}
        className={`h-9 px-3 type-kicker ${
          locale === "en" ? "bg-zinc-950 text-white" : "text-zinc-700 hover:bg-zinc-50"
        }`}
        aria-pressed={locale === "en"}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => navigate("id")}
        className={`h-9 px-3 type-kicker ${
          locale === "id" ? "bg-zinc-950 text-white" : "text-zinc-700 hover:bg-zinc-50"
        }`}
        aria-pressed={locale === "id"}
      >
        ID
      </button>
    </div>
  );
}

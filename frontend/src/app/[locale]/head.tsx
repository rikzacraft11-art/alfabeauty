import { notFound } from "next/navigation";

import type { Locale } from "@/lib/i18n";

export default async function Head({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (locale !== "en" && locale !== "id") notFound();

  const l = locale as Locale;

  // Server-rendered language hints for crawlers.
  // NOTE: We keep the root layout static for SSG performance; the client still
  // sets document.documentElement.lang from the URL-based locale.
  const ogLocale = l === "id" ? "id_ID" : "en_US";

  return (
    <>
      <meta httpEquiv="content-language" content={l} />
      <meta name="language" content={l} />
      <meta property="og:locale" content={ogLocale} />
    </>
  );
}

function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  try {
    return new URL(raw).toString().replace(/\/$/, "");
  } catch {
    return "http://localhost:3000";
  }
}

export default function StructuredData() {
  const siteUrl = getSiteUrl();
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";

  // Keep schema minimal and factual (no pricing).
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Alfa Beauty Cosmetica",
    url: siteUrl,
    logo: `${siteUrl}/images/logo.svg`,
    sameAs: ["https://instagram.com/alfabeauty"],
    description: "Professional beauty distribution for salons and barbershops in Indonesia.",
    areaServed: {
      "@type": "Country",
      name: "Indonesia",
    },
    ...(whatsappNumber && {
      contactPoint: {
        "@type": "ContactPoint",
        telephone: whatsappNumber,
        contactType: "sales",
        areaServed: "ID",
        availableLanguage: ["id", "en"],
      },
    }),
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Alfa Beauty Cosmetica",
    url: siteUrl,
    inLanguage: ["id", "en"],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
    </>
  );
}

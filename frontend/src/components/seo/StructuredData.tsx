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
  const contactPhone = (() => {
    const digits = whatsappNumber.replace(/\D/g, "");
    if (!digits) return undefined;
    if (digits.startsWith("0")) return `+62${digits.slice(1)}`;
    if (digits.startsWith("62")) return `+${digits}`;
    return `+${digits}`;
  })();

  // Keep schema minimal and factual (no pricing).
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Alfa Beauty Cosmetica",
    url: siteUrl,
    logo: `${siteUrl}/images/logo.svg`,
    sameAs: ["https://instagram.com/alfabeauty"],
    description: "Professional beauty distribution for salons & barbers in Indonesia.",
    areaServed: {
      "@type": "Country",
      name: "Indonesia",
    },
    ...(contactPhone && {
      contactPoint: {
        "@type": "ContactPoint",
        telephone: contactPhone,
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

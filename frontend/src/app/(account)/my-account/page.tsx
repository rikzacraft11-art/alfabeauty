import type { Metadata } from "next";
import { AccountDashboard } from "@/features/account";
import { SITE_BASE_URL, SITE_SHORT_NAME } from "@/shared/lib/config";
import { JsonLd, createBreadcrumbList } from "@/app/_components";

const baseUrl = SITE_BASE_URL;

export const metadata: Metadata = {
  title: "My Account — Dashboard",
  description: `Manage your ${SITE_SHORT_NAME} account, view orders, and update your profile.`,
  alternates: { canonical: `${baseUrl}/my-account` },
  robots: { index: false, follow: false, nocache: true },
};

export default function MyAccountPage(): React.JSX.Element {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${baseUrl}/my-account#webpage`,
        name: `My Account — ${SITE_SHORT_NAME}`,
        description: `Manage your ${SITE_SHORT_NAME} account, view orders, and update your profile.`,
        url: `${baseUrl}/my-account`,
      },
      createBreadcrumbList([
        { name: "Home", item: baseUrl },
        { name: "My Account", item: `${baseUrl}/my-account` },
      ]),
    ],
  };

  return (
    <main id="main-content" className="relative z-10 bg-background pt-[var(--header-height)] min-h-[80dvh]">
      <JsonLd data={structuredData} />
      <AccountDashboard />
    </main>
  );
}

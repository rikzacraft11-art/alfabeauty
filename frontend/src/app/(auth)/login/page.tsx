import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LoginForm } from "@/features/auth";
import { SITE_BASE_URL, SITE_SHORT_NAME } from "@/shared/lib/config";
import { JsonLd, createBreadcrumbList } from "@/app/_components";

const baseUrl = SITE_BASE_URL;

const PAGE_DESCRIPTION =
  `Masuk ke akun ${SITE_SHORT_NAME} Anda untuk melacak pesanan, melihat histori belanja, dan mengakses layanan pelanggan.`;

export const metadata: Metadata = {
  title: `Masuk — ${SITE_SHORT_NAME}`,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: `${baseUrl}/login` },
  robots: { index: false, follow: false, nocache: true },
};

export default function LoginPage(): React.JSX.Element {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${baseUrl}/login#webpage`,
        name: `Masuk — ${SITE_SHORT_NAME}`,
        description: PAGE_DESCRIPTION,
        url: `${baseUrl}/login`,
        inLanguage: "id-ID",
      },
      createBreadcrumbList([
        { name: "Home", item: baseUrl },
        { name: "Login", item: `${baseUrl}/login` },
      ]),
    ],
  };

  return (
    <main id="main-content" className="relative z-10 bg-background flex items-center justify-center min-h-[80dvh] pt-[var(--header-height)]">
      <JsonLd data={structuredData} />
      <section className="w-full max-w-md px-4 py-16">
        <h1 className="text-h2 font-bold tracking-tight text-foreground mb-2 text-center">
          Masuk ke Akun
        </h1>
        <p className="text-body text-muted-foreground text-center mb-8">
          Masuk untuk melanjutkan belanja dan melacak pesanan Anda
        </p>
        <LoginForm />
        <div className="mt-8 text-center space-y-4">
          <p className="text-caption text-text-muted">
            Belum memiliki akun?{" "}
            <Link href="/register" className="font-semibold text-foreground underline underline-offset-4 hover:opacity-80 transition-opacity">
              Daftar sekarang
            </Link>
          </p>
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-caption text-text-muted hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

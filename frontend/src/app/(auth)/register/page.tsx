import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { RegisterForm } from "@/features/auth";
import { SITE_BASE_URL, SITE_SHORT_NAME } from "@/shared/lib/config";
import { JsonLd, createBreadcrumbList } from "@/app/_components";

const baseUrl = SITE_BASE_URL;

const PAGE_DESCRIPTION =
  `Daftar akun ${SITE_SHORT_NAME} untuk berbelanja produk kosmetik profesional, melacak pesanan, dan menikmati layanan kemitraan.`;

export const metadata: Metadata = {
  title: `Daftar Akun — ${SITE_SHORT_NAME}`,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: `${baseUrl}/register` },
  robots: { index: false, follow: false, nocache: true },
};

export default function RegisterPage(): React.JSX.Element {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${baseUrl}/register#webpage`,
        name: `Daftar Akun — ${SITE_SHORT_NAME}`,
        description: PAGE_DESCRIPTION,
        url: `${baseUrl}/register`,
        inLanguage: "id-ID",
      },
      createBreadcrumbList([
        { name: "Home", item: baseUrl },
        { name: "Register", item: `${baseUrl}/register` },
      ]),
    ],
  };

  return (
    <main id="main-content" className="relative z-10 bg-background flex items-center justify-center min-h-[80dvh] pt-[var(--header-height)]">
      <JsonLd data={structuredData} />
      <section className="w-full max-w-md px-4 py-16">
        <h1 className="text-h2 font-bold tracking-tight text-foreground mb-2 text-center">
          Daftar Akun
        </h1>
        <p className="text-body text-muted-foreground text-center mb-8">
          Daftar untuk belanja produk profesional & melacak pesanan Anda
        </p>
        <RegisterForm />
        <div className="mt-8 text-center space-y-4">
          <p className="text-caption text-text-muted">
            Sudah memiliki akun?{" "}
            <Link href="/login" className="font-semibold text-foreground underline underline-offset-4 hover:opacity-80 transition-opacity">
              Masuk di sini
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

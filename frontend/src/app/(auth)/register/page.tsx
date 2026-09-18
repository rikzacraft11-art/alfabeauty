import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { RegisterForm } from "@/features/auth";
import { SITE_BASE_URL, SITE_SHORT_NAME } from "@/shared/lib/config";
import { JsonLd, createBreadcrumbList } from "@/app/_components";

const baseUrl = SITE_BASE_URL;

export const metadata: Metadata = {
  title: "Register — Create Your Account",
  description: `Create an ${SITE_SHORT_NAME} account to shop, track orders, and save your preferences.`,
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
        name: `Register — ${SITE_SHORT_NAME}`,
        description: `Create an ${SITE_SHORT_NAME} account to shop, track orders, and save your preferences.`,
        url: `${baseUrl}/register`,
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
          Create Account
        </h1>
        <p className="text-body text-muted-foreground text-center mb-8">
          Join {SITE_SHORT_NAME} for exclusive access
        </p>
        <RegisterForm />
        <div className="mt-8 text-center space-y-4">
          <p className="text-caption text-text-muted">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-foreground underline underline-offset-4 hover:opacity-80 transition-opacity">
              Sign in
            </Link>
          </p>
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-caption text-text-muted hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

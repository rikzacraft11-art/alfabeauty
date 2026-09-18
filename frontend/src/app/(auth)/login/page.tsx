import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LoginForm } from "@/features/auth";
import { SITE_BASE_URL, SITE_SHORT_NAME } from "@/shared/lib/config";
import { JsonLd, createBreadcrumbList } from "@/app/_components";

const baseUrl = SITE_BASE_URL;

export const metadata: Metadata = {
  title: "Login — Sign In to Your Account",
  description: `Sign in to your ${SITE_SHORT_NAME} account to track orders and manage your profile.`,
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
        name: `Login — ${SITE_SHORT_NAME}`,
        description: `Sign in to your ${SITE_SHORT_NAME} account to track orders and manage your profile.`,
        url: `${baseUrl}/login`,
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
          Welcome Back
        </h1>
        <p className="text-body text-muted-foreground text-center mb-8">
          Sign in to your account
        </p>
        <LoginForm />
        <div className="mt-8 text-center space-y-4">
          <p className="text-caption text-text-muted">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-semibold text-foreground underline underline-offset-4 hover:opacity-80 transition-opacity">
              Create an account
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

"use client";

import Link from "next/link";

import LocaleToggle from "@/components/i18n/LocaleToggle";
import { useLocale } from "@/components/i18n/LocaleProvider";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import { t } from "@/lib/i18n";

export default function SiteHeader() {
  const { locale } = useLocale();
  const tx = t(locale);
  const base = `/${locale}`;

  const nav = [
    { href: `${base}/products`, label: tx.nav.products },
    { href: `${base}/education`, label: tx.nav.education },
    { href: `${base}/partnership`, label: tx.nav.partnership },
    { href: `${base}/about`, label: tx.nav.about },
    { href: `${base}/contact`, label: tx.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/95 backdrop-blur">
      <Container className="flex h-14 items-center justify-between">
        <Link href={base} className="type-kicker text-zinc-950">
          Alfa Beauty
        </Link>

        <nav className="hidden items-center gap-8 type-kicker text-zinc-700 md:flex">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="hover:text-zinc-950 hover:underline">
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LocaleToggle />
          <Link href={`${base}/partnership/become-partner`} className="hidden sm:block">
            <Button size="sm">{tx.cta.becomePartner}</Button>
          </Link>
        </div>
      </Container>
    </header>
  );
}

"use client";

import Link from "next/link";

import { useLocale } from "@/components/i18n/LocaleProvider";
import { t } from "@/lib/i18n";

export default function SiteFooter() {
  const { locale } = useLocale();
  const tx = t(locale);
  const base = `/${locale}`;

  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3">
        <div className="space-y-2">
          <p className="type-data font-semibold text-zinc-950">Alfa Beauty Cosmetica</p>
          <p className="type-body text-zinc-700">{tx.footer.blurb}</p>
        </div>
        <div className="space-y-2">
          <p className="type-data font-semibold text-zinc-950">{tx.footer.explore}</p>
          <ul className="space-y-1 type-body text-zinc-700">
            <li>
              <Link href={`${base}/products`} className="hover:underline">
                {tx.nav.products}
              </Link>
            </li>
            <li>
              <Link href={`${base}/education`} className="hover:underline">
                {tx.nav.education}
              </Link>
            </li>
            <li>
              <Link href={`${base}/partnership`} className="hover:underline">
                {tx.nav.partnership}
              </Link>
            </li>
          </ul>
        </div>
        <div className="space-y-2">
          <p className="type-data font-semibold text-zinc-950">{tx.footer.legal}</p>
          <ul className="space-y-1 type-body text-zinc-700">
            <li>
              <Link href={`${base}/privacy`} className="hover:underline">
                {tx.legal.privacyTitle}
              </Link>
            </li>
            <li>
              <Link href={`${base}/terms`} className="hover:underline">
                {tx.legal.termsTitle}
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-zinc-200 py-6">
        <p className="mx-auto max-w-6xl px-4 type-data text-zinc-600 sm:px-6">
          © {new Date().getFullYear()} Alfa Beauty Cosmetica. {tx.footer.copyrightSuffix}
        </p>
      </div>
    </footer>
  );
}

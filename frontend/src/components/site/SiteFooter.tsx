"use client";

import { useState, useActionState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import AppLink from "@/components/ui/AppLink";
import WhatsAppLink from "@/components/site/WhatsAppLink";
import { t } from "@/lib/i18n";
import { subscribe } from "@/actions/subscribe";
import {
  IconArrowRight,
  IconInstagram,
  IconFacebook,
  IconTikTok,
  IconYouTube,
  IconX,
  IconGlobe,
  IconChevronDown,
} from "@/components/ui/icons";

// =============================================================================
// SiteFooter Component - Enterprise Style
// =============================================================================

export default function SiteFooter() {
  const { locale, setLocale } = useLocale();
  const tx = t(locale);
  const base = `/${locale}`;
  const contactEmail = process.env.NEXT_PUBLIC_FALLBACK_EMAIL ?? "alfabeautycosmeticaa@gmail.com";
  const [langOpen, setLangOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(subscribe, null);

  // Clean up unused local state variables related to previous manual form handling
  const [emailTouched] = useState(false); // Kept minimal just for legacy class check if needed, or remove completely
  const [emailError] = useState("");

  const footerLinkClass = "inline-block type-footer-link text-background/70 hover:text-background transition-colors py-1.5 -ml-1 pl-1 pr-2";
  const labelClass = "type-footer-label text-background/40 mb-3";

  return (
    <footer className="bg-foreground text-background" aria-label="Footer">
      {/* Main Footer Content */}
      <div className="mx-auto max-w-[120rem] px-4 pt-12 pb-8 sm:px-6 lg:px-10 lg:pt-14 lg:pb-10">
        <div className="grid gap-10 lg:gap-20 lg:grid-cols-12">

          {/* ============ LEFT COLUMN (Subscribe + Office) ============ */}
          <div className="lg:col-span-5 space-y-8">
            {/* Subscribe Section */}
            <div>
              <p className={labelClass}>
                {locale === "id" ? "Berlangganan" : "Subscribe"}
              </p>
              <p className="type-footer-link text-background/60 mb-4">
                {locale === "id"
                  ? "Dapatkan update terbaru tentang produk dan tren kecantikan profesional."
                  : "Stay up to date with the latest products and professional beauty trends."}
              </p>
              <form action={formAction}>
                <div className={`flex items-center border-b pb-2 transition-colors ${emailTouched && (emailError || state?.fieldErrors?.email) ? "border-error" : "border-background/30"}`}>
                  <input
                    name="email"
                    type="email"
                    placeholder={locale === "id" ? "Alamat Email" : "Email Address"}
                    className="flex-1 bg-transparent type-ui-sm text-background placeholder:text-background/50 focus:outline-none"
                    aria-label="Email Address"
                    disabled={isPending}
                  />
                  <button
                    type="submit"
                    className="text-background/70 hover:text-background transition-colors ml-4 disabled:opacity-50"
                    aria-label="Subscribe"
                    disabled={isPending}
                  >
                    <IconArrowRight className="h-5 w-5" />
                  </button>
                </div>
                {state?.fieldErrors?.email && (
                  <p className="mt-2 type-ui-xs text-error flex items-center gap-1">
                    <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {state.fieldErrors.email[0]}
                  </p>
                )}
                {state?.success && (
                  <p className="mt-2 type-ui-xs text-green-400 flex items-center gap-1">
                    <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {locale === "id" ? "Terima kasih telah berlangganan!" : "Thanks for subscribing!"}
                  </p>
                )}
              </form>
            </div>

            {/* Office Section */}
            <div>
              <p className={labelClass}>
                {locale === "id" ? "Kantor" : "Office"}
              </p>
              <div className="space-y-1 type-footer-link text-background/70">
                <p>Jakarta, Indonesia</p>
                <p>{locale === "id" ? "Senin - Jumat 09:00 - 18:00" : "Mon - Fri 09:00 - 18:00"}</p>
                <div className="pt-2 flex items-center gap-2 flex-wrap">
                  <AppLink href={`mailto:${contactEmail}`} className="inline-block text-background/70 hover:text-background transition-colors py-1">{contactEmail}</AppLink>
                  <span className="text-background/30">|</span>
                  <WhatsAppLink className="inline-block text-background/70 hover:text-background transition-colors py-1">+62 812 xxxx xxxx</WhatsAppLink>
                </div>
              </div>
            </div>
          </div>

          {/* ============ RIGHT COLUMN (Links Grid) ============ */}
          <div className="lg:col-span-7 lg:pl-8">
            {/* Navigation Columns - 4 columns grid */}
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-8">
              {/* Help */}
              <nav aria-label="Help">
                <p className={labelClass}>{locale === "id" ? "Bantuan" : "Help"}</p>
                <ul className="space-y-2">
                  <li><AppLink href={`${base}/contact`} className={footerLinkClass}>{tx.nav.contact}</AppLink></li>
                  <li><AppLink href={`${base}/about`} className={footerLinkClass}>{tx.nav.about}</AppLink></li>
                </ul>
              </nav>

              {/* Explore */}
              <nav aria-label="Explore">
                <p className={labelClass}>{locale === "id" ? "Jelajahi" : "Explore"}</p>
                <ul className="space-y-2">
                  <li><AppLink href={`${base}/products`} className={footerLinkClass}>{tx.nav.products}</AppLink></li>
                  <li><AppLink href={`${base}/education`} className={footerLinkClass}>{tx.nav.education}</AppLink></li>
                  <li><AppLink href={`${base}/partnership`} className={footerLinkClass}>{tx.nav.partnership}</AppLink></li>
                </ul>
              </nav>

              {/* Partnership */}
              <nav aria-label="Partnership">
                <p className={labelClass}>{locale === "id" ? "Kemitraan" : "Partnership"}</p>
                <ul className="space-y-2">
                  <li><AppLink href={`${base}/partnership/become-partner`} className={footerLinkClass}>{tx.cta.becomePartner}</AppLink></li>
                  <li><WhatsAppLink className={footerLinkClass}>{tx.cta.whatsappConsult}</WhatsAppLink></li>
                </ul>
              </nav>

              {/* Language + Social */}
              <div className="space-y-6">
                {/* Language Selector - Minimal */}
                <div className="relative">
                  <button
                    onClick={() => setLangOpen(!langOpen)}
                    className="flex items-center gap-2 type-footer-link text-background/70 hover:text-background transition-colors"
                  >
                    <IconGlobe className="h-4 w-4" />
                    <span>{locale === "id" ? "Indonesia" : "English"}</span>
                    <IconChevronDown className={`h-4 w-4 transition-transform ${langOpen ? "rotate-180" : ""}`} />
                  </button>
                  {langOpen && (
                    <div className="absolute top-full left-0 mt-2 bg-background rounded-md shadow-lg overflow-hidden z-10 min-w-[120px] ring-1 ring-indicator-fixed/10">
                      <button
                        onClick={() => { setLocale("en"); setLangOpen(false); }}
                        className={`w-full px-4 py-2 text-left type-ui-sm hover:bg-indicator-fixed/10 ${locale === "en" ? "bg-indicator-fixed/10 text-background" : "text-background/80"}`}
                      >
                        English
                      </button>
                      <button
                        onClick={() => { setLocale("id"); setLangOpen(false); }}
                        className={`w-full px-4 py-2 text-left type-ui-sm hover:bg-indicator-fixed/10 ${locale === "id" ? "bg-indicator-fixed/10 text-background" : "text-background/80"}`}
                      >
                        Indonesia
                      </button>
                    </div>
                  )}
                </div>

                {/* Social Icons */}
                <div className="flex items-center gap-3">
                  <AppLink href="https://x.com/alfabeauty" target="_blank" rel="noopener noreferrer" className="text-background/50 hover:text-background transition-colors" aria-label="X"><IconX className="h-4 w-5" /></AppLink>
                  <AppLink href="https://instagram.com/alfabeauty" target="_blank" rel="noopener noreferrer" className="text-background/50 hover:text-background transition-colors" aria-label="Instagram"><IconInstagram className="h-4 w-5" /></AppLink>
                  <AppLink href="https://facebook.com/alfabeauty" target="_blank" rel="noopener noreferrer" className="text-background/50 hover:text-background transition-colors" aria-label="Facebook"><IconFacebook className="h-4 w-5" /></AppLink>
                  <AppLink href="https://youtube.com/@alfabeauty" target="_blank" rel="noopener noreferrer" className="text-background/50 hover:text-background transition-colors" aria-label="YouTube"><IconYouTube className="h-4 w-5" /></AppLink>
                  <AppLink href="https://tiktok.com/@alfabeauty" target="_blank" rel="noopener noreferrer" className="text-background/50 hover:text-background transition-colors" aria-label="TikTok"><IconTikTok className="h-4 w-5" /></AppLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar - CK Style */}
      <div>
        <div className="mx-auto max-w-[120rem] px-4 pb-6 sm:px-6 lg:px-10 space-y-3">
          {/* Brand Name */}
          <p className="type-footer-brand text-background">Alfa Beauty</p>

          {/* Legal Links + Copyright Row */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 type-legal text-background/50">
            <AppLink href={`${base}/privacy`} className="hover:text-background transition-colors">{tx.legal.privacyTitle}</AppLink>
            <span className="text-background/30">|</span>
            <AppLink href={`${base}/terms`} className="hover:text-background transition-colors">{tx.legal.termsTitle}</AppLink>
            <span className="text-background/30">|</span>
            <span>© {new Date().getFullYear()} PT Alfa Beauty Cosmetica. {tx.footer.copyrightSuffix}</span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 type-legal text-background/50">
            <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="m9.69 18.933.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 0 0 .281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 1 0 3 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 0 0 2.273 1.765 11.842 11.842 0 0 0 .976.544l.062.029.018.008.006.003ZM10 11.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z" clipRule="evenodd" />
            </svg>
            <span>Indonesia</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { ArrowUp, Instagram, Linkedin, MessageCircle } from "lucide-react";
import {
  SITE_NAME,
  WHATSAPP_URL,
  INSTAGRAM_URL,
  NAV_LINKS,
} from "@/shared/lib/config";
import { trackEvent } from "@/shared/lib/analytics";
import { useLanguage } from "@/shared/components/providers/language-provider";

/* ─────────────────────────────────────────────────────────────────────
 * MegaFooter (1:1 Yucca Style Clean White Curtain Reveal)
 *
 * Layout System:
 * - Mobile (< lg):
 *   1. Header: "Innovated for Industry Leaders." + [ ↑ ] button
 *   2. Giant Center Logo Mark
 *   3. 2 + 1 Cards: 2 side-by-side on top, 1 full-width on bottom with rounded corners
 *   4. Legal Box Container with links, social icons, and copyright
 * - Desktop (>= lg):
 *   4-Column horizontal layout with full-height curtain reveal
 * ───────────────────────────────────────────────────────────────────── */
export function MegaFooter(): React.JSX.Element {
  const { dict, language } = useLanguage();
  const currentYear = new Date().getFullYear();
  const [showFab, setShowFab] = React.useState(false);

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    setShowFab(latest > 300);
  });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const footerSolutions = [
    {
      title: language === "id" ? "Solusi Pelurusan" : "Smoothing Solutions",
      href: "/products?category=treatments",
    },
    {
      title: language === "id" ? "Solusi Pewarnaan" : "Coloring Solutions",
      href: "/products?category=hair-colour",
    },
    {
      title: language === "id" ? "Solusi Barber" : "Barber Solutions",
      href: "/products?category=tools",
    },
  ];

  return (
    <>
      {/* ─── Universal Curtain Reveal Footer (z-0 behind z-20 main content, fully clickable) ─── */}
      <footer
        className="sticky bottom-0 z-0 pointer-events-auto flex min-h-[100dvh] w-full flex-col justify-between bg-[#FFFFFF] text-[#111111] px-6 sm:px-10 lg:px-16 xl:px-20 py-6 sm:py-10 lg:py-14 border-t border-[#EAE6DF] overflow-hidden"
      >
        <div className="mx-auto flex h-full w-full max-w-[1720px] flex-col justify-between flex-1 gap-6 sm:gap-8">
          
          {/* ═══════════════════════════════════════════════════════
              DESKTOP LAYOUT (>= 1024px)
          ═══════════════════════════════════════════════════════ */}
          <div className="hidden lg:flex flex-col justify-between h-full w-full flex-1 gap-8">
            {/* Desktop Row 1: Header */}
            <div className="flex w-full items-start justify-between gap-6 pt-4">
              <h2 className="text-[3.6rem] xl:text-[4.4rem] font-normal leading-[1.04] tracking-[-0.03em] text-[#111111] max-w-4xl text-balance">
                {language === "id" ? "Inovasi untuk Pemimpin Industri." : "Innovated for Industry Leaders."}
              </h2>

              <button
                onClick={scrollToTop}
                className="group relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-none border border-[#111111]/20 bg-white text-[#111111] transition-all duration-300 hover:border-brand-crimson hover:bg-brand-crimson hover:text-white cursor-pointer shadow-sm active:scale-95"
                aria-label="Back to top"
              >
                <div className="relative flex flex-col items-center justify-center">
                  <ArrowUp className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-12" />
                  <ArrowUp className="absolute top-12 h-5 w-5 transition-transform duration-300 group-hover:-translate-y-12" />
                </div>
              </button>
            </div>

            {/* Desktop Row 2: 4-Column Strip */}
            <div className="grid w-full grid-cols-4 gap-7 items-stretch my-auto py-6">
              {/* Column 1: Logo */}
              <Link
                href="/"
                className="group relative flex aspect-square w-full items-center justify-center p-6 transition-transform duration-300 hover:scale-105"
                aria-label="Alfa Beauty Home"
              >
                <div className="relative flex flex-col items-center justify-center w-full h-full">
                  <Image
                    src="/images/logo/alfa-beauty-mark.svg"
                    alt={SITE_NAME}
                    width={260}
                    height={260}
                    unoptimized
                    priority
                    className="h-48 xl:h-56 w-auto object-contain drop-shadow-[0_4px_16px_rgba(186,24,27,0.12)]"
                  />
                </div>
              </Link>

              {/* Columns 2, 3, 4: Solution Panels */}
              {footerSolutions.map((item, idx) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="group relative flex aspect-square w-full cursor-pointer items-center justify-center rounded-none border border-[#E8E4DC] bg-[#FBF9F6] p-8 xl:p-10 text-center transition-all duration-300 hover:bg-[#FFFFFF] hover:border-[#111111]/30 hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)] active:scale-[0.99] overflow-hidden"
                >
                  <div className="flex flex-col items-center justify-center gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand-crimson">
                      0{idx + 1}
                    </span>
                    <div className="py-1">
                      <span className="block text-xl xl:text-[1.85rem] font-light leading-snug tracking-[-0.01em] text-[#111111] transition-colors duration-300 group-hover:text-brand-crimson">
                        {item.title}
                      </span>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-brand-crimson transition-[width] duration-400 ease-out group-hover:w-full" />
                </Link>
              ))}
            </div>

            {/* Desktop Row 3: Legal Bar */}
            <div className="w-full rounded-none border-t border-[#EAE6DF] pt-6 pb-2 flex items-center justify-between gap-4 text-[13px] text-[#555555]">
              <div className="flex items-center gap-8">
                <p className="flex items-center gap-1.5 font-normal text-[#666666]">
                  <span>©</span>
                  <span>Alfa Beauty {currentYear}. {dict.footer.copyright || (language === "id" ? "Semua Hak Dilindungi" : "All Rights Reserved")}</span>
                </p>

                <div className="flex items-center gap-4">
                  <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="flex h-6 w-6 items-center justify-center text-[#555555] transition-colors duration-200 hover:text-brand-crimson" aria-label="Instagram">
                    <Instagram className="h-4 w-4" />
                  </a>
                  <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("cta_whatsapp_click", { location: "footer" })} className="flex h-6 w-6 items-center justify-center text-[#1F9849] transition-colors duration-200 hover:text-[#187d3c]" aria-label="WhatsApp">
                    <MessageCircle className="h-4 w-4" />
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="flex h-6 w-6 items-center justify-center text-[#555555] transition-colors duration-200 hover:text-brand-crimson" aria-label="LinkedIn">
                    <Linkedin className="h-4 w-4" />
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-8 uppercase tracking-[0.12em] text-[11px] font-semibold text-[#555555]">
                <Link href={NAV_LINKS.contact} className="hover:text-[#111111] transition-colors">
                  {language === "id" ? "Hubungi Kami" : "Contact Us"}
                </Link>
                <Link href="/privacy" className="hover:text-[#111111] transition-colors">
                  {language === "id" ? "Kebijakan Privasi" : "Privacy Policy"}
                </Link>
                <Link href="/terms" className="hover:text-[#111111] transition-colors">
                  {language === "id" ? "Syarat & Ketentuan" : "Terms & Conditions"}
                </Link>
              </div>
            </div>
          </div>


          {/* ═══════════════════════════════════════════════════════
              MOBILE LAYOUT (< 1024px) — 1:1 Yucca Reference Parity
          ═══════════════════════════════════════════════════════ */}
          <div className="flex lg:hidden flex-col justify-between h-full w-full flex-1 gap-5 py-2">
            
            {/* Mobile Header: Title + Arrow */}
            <div className="flex w-full items-start justify-between gap-3 pt-1">
              <h2 className="text-[1.65rem] sm:text-[2.2rem] font-normal leading-[1.1] tracking-[-0.03em] text-[#111111] max-w-[240px] sm:max-w-md">
                {language === "id" ? "Inovasi untuk Pemimpin Industri." : (
                  <>
                    Innovated for<br />Industry Leaders.
                  </>
                )}
              </h2>

              <button
                onClick={scrollToTop}
                className="group relative flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-none border border-[#111111]/30 bg-white text-[#111111] transition-all active:scale-95 shadow-sm"
                aria-label="Back to top"
              >
                <ArrowUp className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>

            {/* Mobile Big Brand Mark (Centered) */}
            <div className="flex items-center justify-center my-auto py-2 sm:py-4">
              <Link href="/" aria-label="Alfa Beauty Home" className="relative flex items-center justify-center">
                <Image
                  src="/images/logo/alfa-beauty-mark.svg"
                  alt={SITE_NAME}
                  width={280}
                  height={280}
                  unoptimized
                  priority
                  className="h-32 sm:h-44 w-auto object-contain drop-shadow-[0_4px_20px_rgba(186,24,27,0.15)]"
                />
              </Link>
            </div>

            {/* Mobile 2 + 1 Solution Cards Grid */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5 w-full">
              {/* Card 1: Smoothing Solutions */}
              <Link
                href={footerSolutions[0].href}
                className="col-span-1 flex items-center justify-center py-4 px-3 sm:py-5 sm:px-4 rounded-xl border border-[#D5D0C7] bg-[#FBF9F6] text-center transition-all active:scale-[0.98] shadow-xs"
              >
                <span className="text-[13px] sm:text-[15px] font-normal text-[#111111] leading-tight">
                  {footerSolutions[0].title}
                </span>
              </Link>

              {/* Card 2: Coloring Solutions */}
              <Link
                href={footerSolutions[1].href}
                className="col-span-1 flex items-center justify-center py-4 px-3 sm:py-5 sm:px-4 rounded-xl border border-[#D5D0C7] bg-[#FBF9F6] text-center transition-all active:scale-[0.98] shadow-xs"
              >
                <span className="text-[13px] sm:text-[15px] font-normal text-[#111111] leading-tight">
                  {footerSolutions[1].title}
                </span>
              </Link>

              {/* Card 3: Barber Solutions (Full Width Bottom) */}
              <Link
                href={footerSolutions[2].href}
                className="col-span-2 flex items-center justify-center py-4 px-4 sm:py-5 sm:px-6 rounded-xl border border-[#D5D0C7] bg-[#FBF9F6] text-center transition-all active:scale-[0.98] shadow-xs"
              >
                <span className="text-[13px] sm:text-[15px] font-normal text-[#111111] leading-tight">
                  {footerSolutions[2].title}
                </span>
              </Link>
            </div>

            {/* Mobile Unified Legal Container Box */}
            <div className="w-full rounded-xl border border-[#D5D0C7] bg-[#FBF9F6]/60 p-4 sm:p-5 flex flex-col items-center gap-3 text-center">
              {/* Legal Links (Always strictly 1 horizontal row side by side) */}
              <div className="flex flex-nowrap items-center justify-center gap-3 sm:gap-6 text-[10.5px] sm:text-[12.5px] text-[#222222] font-normal w-full">
                <Link href={NAV_LINKS.contact} className="whitespace-nowrap shrink-0 hover:text-brand-crimson transition-colors">
                  {language === "id" ? "Hubungi Kami" : "Contact Us"}
                </Link>
                <Link href="/privacy" className="whitespace-nowrap shrink-0 hover:text-brand-crimson transition-colors">
                  {language === "id" ? "Kebijakan Privasi" : "Privacy Policy"}
                </Link>
                <Link href="/terms" className="whitespace-nowrap shrink-0 hover:text-brand-crimson transition-colors">
                  {language === "id" ? "Syarat & Ketentuan" : "Terms & Conditions"}
                </Link>
              </div>

              {/* Social Icons */}
              <div className="flex items-center justify-center gap-5 pt-1">
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="text-[#555555] hover:text-brand-crimson" aria-label="Instagram">
                  <Instagram className="h-4 w-4" />
                </a>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("cta_whatsapp_click", { location: "footer" })} className="text-[#1F9849]" aria-label="WhatsApp">
                  <MessageCircle className="h-4 w-4" />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-[#555555] hover:text-brand-crimson" aria-label="LinkedIn">
                  <Linkedin className="h-4 w-4" />
                </a>
              </div>

              {/* Copyright */}
              <p className="text-[10.5px] sm:text-[11.5px] text-[#777777] font-normal pt-0.5">
                © Alfa Beauty {currentYear}. {dict.footer.copyright || (language === "id" ? "Semua Hak Dilindungi" : "All Rights Reserved")}
              </p>
            </div>

          </div>

        </div>
      </footer>

      {/* Floating Action Button (WhatsApp #1F9849) */}
      <motion.a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackEvent("cta_whatsapp_click", { location: "sticky_fab" })}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#1F9849] text-white shadow-[0_10px_25px_rgba(31,152,73,0.35)] transition-all duration-300 hover:scale-105 hover:bg-[#187d3c] active:scale-95"
        aria-label={language === "id" ? "Hubungi via WhatsApp" : "Chat on WhatsApp"}
        initial={{ y: 80, opacity: 0 }}
        animate={showFab ? { y: 0, opacity: 1, pointerEvents: "auto" as const } : { y: 80, opacity: 0, pointerEvents: "none" as const }}
        transition={{ type: "spring", stiffness: 260, damping: 25 }}
      >
        <MessageCircle className="h-6 w-6 fill-current" />
      </motion.a>
    </>
  );
}

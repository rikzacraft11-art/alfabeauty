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
import { cn } from "@/shared/lib/utils";

/* ─────────────────────────────────────────────────────────────────────
 * Solutions Pillar Cards matching Section 3 (1:1 Yucca Pattern)
 * ───────────────────────────────────────────────────────────────────── */
const FOOTER_SOLUTIONS = [
  {
    title: "Solusi Rebonding",
    href: "/products?category=treatments",
  },
  {
    title: "Solusi Pewarnaan",
    href: "/products?category=hair-colour",
  },
  {
    title: "Solusi Barber",
    href: "/products?category=tools",
  },
];

/* ─────────────────────────────────────────────────────────────────────
 * Micro-Interaction: Dual Text Roll-Over (1:1 Yucca .f-link.split)
 * ───────────────────────────────────────────────────────────────────── */
function TextRoll({ text, className }: { text: string; className?: string }) {
  return (
    <span className={cn("group/roll relative inline-block overflow-hidden", className)}>
      <span className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/roll:-translate-y-full">
        {text}
      </span>
      <span className="absolute left-0 top-full inline-block text-[#ba181b] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/roll:-translate-y-full">
        {text}
      </span>
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────────────
 * MegaFooter (Official Brand Color Palette: #000000, #ffffff, #ba181b, #660708)
 *
 * - Canvas: Pure Black (#000000) with Pure White (#ffffff) typography and Red (#ba181b) accents
 * - Fullscreen 100vh Curtain Reveal
 * ───────────────────────────────────────────────────────────────────── */
export function MegaFooter(): React.JSX.Element {
  const currentYear = new Date().getFullYear();
  const [showFab, setShowFab] = React.useState(false);

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    setShowFab(latest > 300);
  });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* ─── Curtain Reveal Spacer: Exact 100vh (h-screen) full viewport height ─── */}
      <div
        className="pointer-events-none hidden sm:block h-screen w-full"
        aria-hidden="true"
      />

      {/* ─── Fixed Fullscreen Footer (h-screen at z-0) in Pure Black #000000 ─── */}
      <footer
        className="relative sm:fixed sm:inset-x-0 sm:bottom-0 z-0 flex min-h-screen sm:h-screen w-full flex-col justify-between bg-[#000000] text-white px-6 sm:px-12 lg:px-20 py-8 sm:py-12 lg:py-14"
      >
        <div className="mx-auto flex h-full w-full max-w-[1540px] flex-col justify-between flex-1 gap-6 sm:gap-8">
          
          {/* ─── Row 1: .f-header (Headline + Morphing Dual-Arrow Scroll-to-top) ─── */}
          <div className="flex w-full items-start justify-between gap-6 pt-2 sm:pt-4">
            <h2 className="text-[2.4rem] sm:text-[3.6rem] lg:text-[4.6rem] font-normal leading-[1.04] tracking-[-0.03em] text-white max-w-4xl text-balance">
              Innovated for Industry Leaders.
            </h2>

            {/* Morphing Square-to-Circle Dual Arrow Button */}
            <button
              onClick={scrollToTop}
              className="group relative flex h-14 w-14 sm:h-16 sm:w-16 lg:h-18 lg:w-18 shrink-0 items-center justify-center overflow-hidden rounded-none border border-white/30 transition-all duration-300 hover:border-[#ba181b] hover:bg-[#ba181b] hover:text-white"
              aria-label="Back to top"
            >
              <div className="relative flex flex-col items-center justify-center">
                <ArrowUp className="h-5 w-5 sm:h-6 sm:w-6 transition-transform duration-300 group-hover:-translate-y-12" />
                <ArrowUp className="absolute top-12 h-5 w-5 sm:h-6 sm:w-6 transition-transform duration-300 group-hover:-translate-y-12" />
              </div>
            </button>
          </div>

          {/* ─── Row 2: .f-content (Giant Brand Mark + 3 Sleek Solution Panels) ─── */}
          <div className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-7 items-center my-auto">
            
            {/* Column 1: Giant Brand Mark in White with Red Accent */}
            <Link
              href="/"
              className="group relative flex aspect-[4/3] lg:aspect-square w-full items-center justify-center p-4 sm:p-6 transition-transform duration-300 hover:scale-105"
            >
              <div className="relative flex flex-col items-center justify-center">
                <Image
                  src="/images/logo/alfa-beauty-mark.svg"
                  alt={SITE_NAME}
                  width={260}
                  height={260}
                  className="h-36 sm:h-48 lg:h-56 w-auto object-contain brightness-0 invert"
                />
                <span className="absolute -bottom-2 -right-2 text-sm font-bold text-[#ba181b]">
                  ®
                </span>
              </div>
            </Link>

            {/* Columns 2, 3, 4: 3 Solution Panels with Calvin Klein Minimalist Underline Style */}
            {FOOTER_SOLUTIONS.map((item, idx) => (
              <Link
                key={item.title}
                href={item.href}
                className="group relative flex aspect-[4/3] lg:aspect-square w-full cursor-pointer items-center justify-center rounded-none border border-white/15 bg-white/[0.02] p-6 sm:p-10 text-center transition-all duration-300 hover:bg-white/[0.06] hover:border-white/50"
              >
                <div className="flex flex-col items-center justify-center gap-3">
                  <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#ba181b]">
                    0{idx + 1}
                  </span>
                  <div className="relative overflow-hidden py-1">
                    <span className="block text-xl sm:text-2xl lg:text-[1.85rem] font-light leading-snug tracking-[-0.01em] text-white transition-transform duration-300 group-hover:-translate-y-full">
                      {item.title}
                    </span>
                    <span className="absolute left-0 top-full block w-full text-xl sm:text-2xl lg:text-[1.85rem] font-normal leading-snug tracking-[-0.01em] text-[#ba181b] transition-transform duration-300 group-hover:-translate-y-full">
                      {item.title}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* ─── Row 3: .f-footer (Sleek Minimalist Legal Bar) ─── */}
          <div className="w-full rounded-none border-t border-white/15 pt-6 pb-2 flex flex-col md:flex-row items-center justify-between gap-4 text-[12.5px] sm:text-[13.5px] text-white/70">
            
            {/* Left: Copyright + Social Icons */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-8">
              <p className="flex items-center gap-1.5 font-normal text-white/60">
                <span>©</span>
                <span>Alfa Beauty {currentYear}. All Rights Reserved</span>
              </p>

              {/* Social Icons with Red & Green Accents */}
              <div className="flex items-center gap-4">
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-6 w-6 items-center justify-center text-white/70 transition-colors duration-200 hover:text-[#ba181b]"
                  aria-label="Instagram"
                >
                  <Instagram className="h-4 w-4" />
                </a>

                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent("cta_whatsapp_click", { location: "footer" })}
                  className="flex h-6 w-6 items-center justify-center text-[#259E4A] transition-colors duration-200 hover:text-white"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="h-4 w-4" />
                </a>

                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-6 w-6 items-center justify-center text-white/70 transition-colors duration-200 hover:text-[#ba181b]"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Right: Legal Links with Calvin Klein Underline Hover */}
            <div className="flex flex-wrap items-center gap-x-8 gap-y-2 uppercase tracking-[0.12em] text-[11px] font-semibold text-white/70">
              <Link href={NAV_LINKS.contact} className="hover:text-white transition-colors">
                <TextRoll text="Contact Us" />
              </Link>
              <Link href="/privacy" className="hover:text-white transition-colors">
                <TextRoll text="Privacy Policy" />
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                <TextRoll text="Terms & Conditions" />
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Action Button (Official WhatsApp Green) */}
      <motion.a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackEvent("cta_whatsapp_click", { location: "sticky_fab" })}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_25px_rgba(37,211,102,0.35)] transition-all duration-300 hover:scale-105 hover:bg-[#20bd5a]"
        aria-label="Chat on WhatsApp"
        initial={{ y: 80, opacity: 0 }}
        animate={showFab ? { y: 0, opacity: 1, pointerEvents: "auto" as const } : { y: 80, opacity: 0, pointerEvents: "none" as const }}
        transition={{ type: "spring", stiffness: 260, damping: 25 }}
      >
        <MessageCircle className="h-6 w-6 fill-current" />
      </motion.a>
    </>
  );
}

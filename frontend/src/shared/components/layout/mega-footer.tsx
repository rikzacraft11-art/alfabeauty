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
              className="group relative flex h-16 w-16 sm:h-20 sm:w-20 lg:h-22 lg:w-22 shrink-0 items-center justify-center overflow-hidden rounded-[20px] border border-white/30 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:rounded-full hover:border-[#ba181b] hover:bg-[#ba181b] hover:text-white"
              aria-label="Back to top"
            >
              <div className="relative flex flex-col items-center justify-center">
                <ArrowUp className="h-6 w-6 sm:h-7 sm:w-7 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-12" />
                <ArrowUp className="absolute top-12 h-6 w-6 sm:h-7 sm:w-7 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-12" />
              </div>
            </button>
          </div>

          {/* ─── Row 2: .f-content (Giant Brand Mark + 3 Large Solution Cards) ─── */}
          <div className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-7 items-center my-auto">
            
            {/* Column 1: Giant Brand Mark in White with Red Accent */}
            <Link
              href="/"
              className="group relative flex aspect-[4/3] lg:aspect-square w-full items-center justify-center p-4 sm:p-6 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-105"
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

            {/* Columns 2, 3, 4: 3 Solution Cards with Dual Roll-Over Text */}
            {FOOTER_SOLUTIONS.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group relative flex aspect-[4/3] lg:aspect-square w-full cursor-pointer items-center justify-center rounded-[28px] border border-white/20 bg-white/[0.03] p-6 sm:p-10 text-center backdrop-blur-sm transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-white/[0.08] hover:border-[#ba181b] hover:shadow-[0_15px_40px_rgba(186,24,27,0.15)]"
              >
                <div className="relative overflow-hidden py-1">
                  <span className="block text-2xl sm:text-3xl lg:text-[2.2rem] font-normal leading-snug tracking-[-0.01em] text-white transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-full">
                    {item.title}
                  </span>
                  <span className="absolute left-0 top-full block w-full text-2xl sm:text-3xl lg:text-[2.2rem] font-normal leading-snug tracking-[-0.01em] text-[#ba181b] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-full">
                    {item.title}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* ─── Row 3: .f-footer (Single Rounded Capsule Bar with Roll-Over Links) ─── */}
          <div className="w-full rounded-[24px] border border-white/20 bg-white/[0.02] px-6 sm:px-10 py-4 sm:py-5 flex flex-col md:flex-row items-center justify-between gap-4 text-[13.5px] sm:text-[14.5px] text-white/80">
            
            {/* Left: Copyright + Social Icons */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-8">
              <p className="flex items-center gap-1.5 font-normal text-white/70">
                <span>©</span>
                <span>Alfa Beauty {currentYear}. All Rights Reserved</span>
              </p>

              {/* Social Icons with Red Hover */}
              <div className="flex items-center gap-4">
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-7 w-7 items-center justify-center rounded-full text-white/80 transition-all duration-300 hover:scale-125 hover:text-[#ba181b]"
                  aria-label="Instagram"
                >
                  <Instagram className="h-4.5 w-4.5" />
                </a>

                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent("cta_whatsapp_click", { location: "footer" })}
                  className="flex h-7 w-7 items-center justify-center rounded-full text-white/80 transition-all duration-300 hover:scale-125 hover:text-[#ba181b]"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="h-4.5 w-4.5" />
                </a>

                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-7 w-7 items-center justify-center rounded-full text-white/80 transition-all duration-300 hover:scale-125 hover:text-[#ba181b]"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-4.5 w-4.5" />
                </a>
              </div>
            </div>

            {/* Right: Legal Links with Dual Roll-Over Animation */}
            <div className="flex flex-wrap items-center gap-x-8 gap-y-2 font-normal text-white/80">
              <Link href={NAV_LINKS.contact}>
                <TextRoll text="Contact Us" />
              </Link>
              <Link href="/privacy">
                <TextRoll text="Privacy Policy" />
              </Link>
              <Link href="/terms">
                <TextRoll text="Terms & Conditions" />
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Action Button */}
      <motion.a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackEvent("cta_whatsapp_click", { location: "sticky_fab" })}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#ba181b] text-white shadow-xl transition-all duration-300 hover:scale-110 hover:bg-[#e5383b]"
        aria-label="Chat on WhatsApp"
        initial={{ y: 80, opacity: 0 }}
        animate={showFab ? { y: 0, opacity: 1, pointerEvents: "auto" as const } : { y: 80, opacity: 0, pointerEvents: "none" as const }}
        transition={{ type: "spring", stiffness: 260, damping: 25 }}
      >
        <MessageCircle className="h-6 w-6" />
      </motion.a>
    </>
  );
}

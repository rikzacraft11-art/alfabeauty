"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  motion,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import {
  ArrowUp,
  ArrowUpRight,
  Instagram,
  MessageCircle,
} from "lucide-react";
import {
  SITE_NAME,
  SITE_SHORT_NAME,
  WHATSAPP_URL,
  INSTAGRAM_URL,
  PILLARS,
  LEGAL_LINKS,
} from "@/lib/config";
import { trackEvent } from "@/lib/analytics";
import { cardStagger, cardFadeScale, PARALLAX, cinematicEase, listStagger, listItemFadeIn } from "@/lib/motion";
import { TextReveal } from "@/components/motion/text-reveal";
import { LineGrow, useParallax } from "@/hooks/use-animations";
import { FadeIn } from "@/components/motion/fade-in";

/* ─────────────────────────────────────────────────────────────────────
 * Component: MegaFooter V9
 *
 * V9 Upgrades:
 *   - Enhanced pillar cards with product imagery backgrounds
 *   - Deeper atmospheric overlays (dual warm vignette + radial glow)
 *   - Richer grain + mood on the fixed footer layer
 *   - Cinematic card hover with image reveal
 * ───────────────────────────────────────────────────────────────────── */

const PILLAR_IMAGES = [
  "/images/brands/alfaparf-milano.webp",
  "/images/brands/montibello.webp",
  "/images/brands/gamma-plus.webp",
] as const;

function WordmarkParallax() {
  const { ref, y } = useParallax({ speed: PARALLAX.subtle });
  return (
    <div ref={ref} className="hidden shrink-0 lg:block">
      <motion.div className="flex flex-col items-start gap-2" style={{ y }}>
        <div className="flex items-center gap-3">
          <Image
            src="/images/logo/alfa-beauty-mark.svg"
            alt={SITE_NAME}
            width={40}
            height={40}
            className="h-10 w-10 object-contain invert brightness-0 opacity-90"
          />
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-[0.25em] text-foreground uppercase">
              {SITE_SHORT_NAME}
            </span>
            <span className="text-[9px] font-semibold tracking-[0.2em] text-text-muted uppercase">
              Cosmetica
            </span>
          </div>
        </div>
        <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.3em] text-brand-dark/40">
          Professional Distribution ®
        </span>
      </motion.div>
    </div>
  );
}

export function MegaFooter(): React.JSX.Element {
  const currentYear = new Date().getFullYear();
  const [showScrollTop, setShowScrollTop] = React.useState(false);
  const [showFab, setShowFab] = React.useState(false);
  const footerRef = React.useRef<HTMLElement>(null);
  const [footerHeight, setFooterHeight] = React.useState(600);

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    setShowScrollTop(latest > 400);
    setShowFab(latest > 300);
  });

  // Measure actual footer height for the spacer (ResizeObserver)
  React.useEffect(() => {
    const el = footerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setFooterHeight(entry.contentRect.height);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* ── Spacer: pushes content so the fixed footer reveals underneath (sm+ only) ── */}
      <div
        className="pointer-events-none hidden sm:block"
        style={{ height: footerHeight }}
        aria-hidden="true"
      />

      <footer
        ref={footerRef}
        className="relative sm:fixed sm:inset-x-0 sm:bottom-0 z-0 flex sm:min-h-[520px] flex-col bg-surface"
      >
        {/* Warm vignette atmosphere */}
        <div className="absolute inset-0 vignette-warm pointer-events-none" />
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background: "radial-gradient(ellipse at 70% 80%, rgba(164,22,26,0.03) 0%, transparent 60%)",
          }}
        />
        {/* ─── Top section: Headline + Scroll-to-top ─── */}
        <div className="mx-auto flex w-full max-w-[1400px] items-start justify-between px-6 pt-10 sm:pt-14 sm:px-8 lg:px-12">
          <div className="max-w-xl">
            <TextReveal
              as="h2"
              className="heading-section text-foreground"
              split="word"
              blur
              delay={0.15}
              lines={[
                "Innovated for Salon",
                "& Barber Professionals.",
              ]}
            />
          </div>

          {/* Scroll-to-top (Yucca arrow-up button) */}
          <motion.button
            onClick={scrollToTop}
            className="group flex h-10 w-10 shrink-0 items-center justify-center border border-charcoal/20 text-foreground transition-all duration-300 hover:border-charcoal hover:bg-foreground hover:text-white"
            aria-label="Scroll to top"
            initial={{ opacity: 0 }}
            animate={{ opacity: showScrollTop ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ArrowUp className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
          </motion.button>
        </div>

        {/* Animated line under headline */}
        <div className="mx-auto w-full max-w-[1400px] px-6 pt-4 sm:pt-6 sm:px-8 lg:px-12">
          <LineGrow className="h-px bg-charcoal/10" />
        </div>

        {/* ─── Main: Logo wordmark + 3 Pillar cards ─── */}
        <div className="mx-auto flex w-full max-w-[1400px] flex-1 items-center gap-3 py-6 sm:gap-8 sm:py-0 px-6 sm:px-8 lg:gap-12 lg:px-12">
          {/* Brand wordmark (Yucca large logo equivalent) — real parallax */}
          <WordmarkParallax />

          {/* 3 Pillar cards (Yucca: Food Service / Food Processing / Agriculture) */}
          <motion.div
            className="grid w-full flex-1 grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4"
            variants={cardStagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            {PILLARS.map((pillar, idx) => (
              <motion.div
                key={pillar.label}
                variants={cardFadeScale}
              >
                <Link
                  href={pillar.href}
                  className="group relative flex h-full min-h-[100px] sm:min-h-[200px] flex-col justify-between overflow-hidden border border-charcoal/15 bg-surface-elevated/50 p-4 sm:p-6 transition-[box-shadow,border-color] duration-500 ease-[var(--ease)] hover:border-charcoal/25 hover:shadow-sm"
                >
                  {/* Background product image — reveals on hover */}
                  <Image
                    src={PILLAR_IMAGES[idx] ?? PILLAR_IMAGES[0]}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover opacity-0 transition-opacity duration-[800ms] ease-[var(--ease)] group-hover:opacity-[0.1]"
                    aria-hidden="true"
                  />

                  {/* Subtle gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-surface/30 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  <div className="relative z-10">
                    {/* Numbered index */}
                    <span className="mb-2 block text-[10px] font-bold tabular-nums tracking-[0.3em] text-brand-crimson/50">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-base font-bold text-foreground">
                      {pillar.label}
                    </h3>
                    <p className="mt-1.5 sm:mt-3 text-xs sm:text-sm leading-relaxed text-text-muted">
                      {pillar.description}
                    </p>
                  </div>

                  {/* Animated divider in card */}
                  <div className="relative z-10 mt-4">
                    <div className="h-px w-0 bg-charcoal/15 transition-[width] duration-[800ms] ease-[var(--ease)] group-hover:w-full" />
                  </div>

                  {/* Yucca hover-reveal "Explore" CTA with animated underline */}
                  <div className="relative z-10 mt-3 flex items-center gap-1 text-xs font-bold uppercase tracking-[0.12em] text-brand-crimson sm:translate-y-2 sm:opacity-0 transition-[transform,opacity] duration-300 sm:group-hover:translate-y-0 sm:group-hover:opacity-100">
                    <span className="link-animated">Explore</span>
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>

                  {/* Hover accent line at bottom */}
                  <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-brand-crimson transition-[width] duration-[800ms] ease-[var(--ease)] group-hover:w-full" />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* ─── Bottom bar ─── */}
        <FadeIn delay={0.3} blur>
          <div className="border-t border-charcoal/10 bg-surface-elevated">
            <motion.div
              className="mx-auto flex max-w-[1400px] flex-row items-center justify-between gap-4 px-5 py-4 sm:px-8 sm:py-5 lg:px-12"
              variants={listStagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              {/* Left: Copyright + Social icons */}
              <motion.div className="flex flex-row items-center gap-3 sm:gap-5" variants={listItemFadeIn}>
                <p className="text-[11px] sm:text-sm font-medium text-foreground/70 whitespace-nowrap">
                  © {currentYear} {SITE_NAME}
                </p>

                {/* Social icons (Yucca pattern) — hover scale micro-interaction */}
                <div className="flex items-center gap-3">
                  <a
                    href={INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center p-2.5 -m-2.5 text-foreground/50 transition-colors duration-300 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label="Instagram"
                  >
                    <Instagram className="h-4 w-4" />
                    <span className="sr-only">(opens in new tab)</span>
                  </a>
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent("cta_whatsapp_click", { location: "footer" })}
                    className="inline-flex items-center justify-center p-2.5 -m-2.5 text-foreground/50 transition-colors duration-300 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label="WhatsApp"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span className="sr-only">(opens in new tab)</span>
                  </a>
                </div>
              </motion.div>

              {/* Right: Legal links */}
              <motion.div className="flex flex-wrap items-center justify-end gap-x-4 sm:gap-x-6 gap-y-1" variants={listItemFadeIn}>
                {LEGAL_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-[11px] sm:text-sm font-medium text-foreground/60 transition-colors duration-300 hover:text-foreground hover:underline underline-offset-4"
                  >
                    {link.label}
                  </Link>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </FadeIn>
      </footer>

      <motion.a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackEvent("cta_whatsapp_click", { location: "sticky_fab" })}
        className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-whatsapp text-white shadow-lg transition-[transform,box-shadow] duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(37,211,102,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        aria-label="Chat on WhatsApp"
        initial={{ y: 80, opacity: 0 }}
        animate={showFab ? { y: 0, opacity: 1, pointerEvents: "auto" as const } : { y: 80, opacity: 0, pointerEvents: "none" as const }}
        transition={{ type: "spring", stiffness: 260, damping: 25 }}
      >
        <MessageCircle className="h-5 w-5" />
      </motion.a>
    </>
  );
}

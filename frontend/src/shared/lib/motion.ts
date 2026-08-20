/* ─────────────────────────────────────────────────────────────────────
 * Shared Framer Motion variants & constants
 *
 * Centralizes animation presets so every component animates consistently.
 *
 *   import { smoothEase, cardStagger, fadeInUp } from "@/shared/lib/motion";
 * ───────────────────────────────────────────────────────────────────── */

import type { Variants } from "framer-motion";

/* ─────────────────────────────────────────────────────────────────────
 * §1  Easing Curves
 * ───────────────────────────────────────────────────────────────────── */

/** Smooth ease — default scroll reveals. Matches CSS `--ease` */
export const smoothEase = [0.22, 1, 0.36, 1] as const;

/** Cinematic ease — hero-level / dramatic reveals */
export const cinematicEase = [0.16, 1, 0.3, 1] as const;

/** Exit ease — tighter curve for exit/close animations (internal) */
const exitEase = [0.4, 0, 0.7, 0.2] as const;

/* ─────────────────────────────────────────────────────────────────────
 * §2  Parallax Constants
 * ───────────────────────────────────────────────────────────────────── */

export const PARALLAX = {
  micro: 0.04,
  subtle: 0.08,
  default: 0.15,
  strong: 0.25,
  hero: 0.35,
} as const;

/* ─────────────────────────────────────────────────────────────────────
 * §3  Orchestration Timing
 * ───────────────────────────────────────────────────────────────────── */

const PRELOADER_DURATION = 2.6;

/**
 * Hero timing offsets. Components should call `getHeroTiming()` at render time
 * (not import time) so sessionStorage check is accurate.
 *
 * On first visit: preloader plays → long delays coordinated with preloader exit.
 * On repeat visits: preloader skipped → zero-delay instant reveal.
 */
export function getHeroTiming() {
  let base = PRELOADER_DURATION;
  if (typeof window !== "undefined" && sessionStorage.getItem("preloader-seen") === "1") {
    base = 0;
  }
  return {
    eyebrow: base + 0.15,
    heading: base * 1000 + 300,
    body: base + 0.4,
    cta: base + 0.6,
    scroll: base + 1.0,
  };
}

/* ─────────────────────────────────────────────────────────────────────
 * §4  Page-level variants
 * ───────────────────────────────────────────────────────────────────── */

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: smoothEase },
  },
};

/* ─────────────────────────────────────────────────────────────────────
 * §5  Card stagger — grids (carousel, partnership, footer pillars)
 * ───────────────────────────────────────────────────────────────────── */

export const cardStagger: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.1,
    },
  },
};

export const cardFadeScale: Variants = {
  hidden: { opacity: 0, y: 32, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.85, ease: cinematicEase },
  },
};

/* ─────────────────────────────────────────────────────────────────────
 * §6  List item stagger — bullet lists inside cards/sections
 * ───────────────────────────────────────────────────────────────────── */

export const listStagger: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.25,
    },
  },
};

export const listItemFadeIn: Variants = {
  hidden: { opacity: 0, x: 16 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.55, ease: smoothEase },
  },
};

/* ─────────────────────────────────────────────────────────────────────
 * §7  Mobile menu — blur+slide item variant
 * ───────────────────────────────────────────────────────────────────── */

export const mobileMenuStagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
};

export const mobileMenuItemFade: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: smoothEase },
  },
};

/* ─────────────────────────────────────────────────────────────────────
 * §8  Glassmorphism — blur-in badge/overlay reveals
 * ───────────────────────────────────────────────────────────────────── */

export const glassBadgeReveal: Variants = {
  hidden: { opacity: 0, y: 14, scale: 0.92 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 1, delay: 0.7, ease: smoothEase },
  },
};

/* ─────────────────────────────────────────────────────────────────────
 * §9  Counter section — cascading grid entrance
 * ───────────────────────────────────────────────────────────────────── */

export const counterStagger: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.15,
    },
  },
};

export const counterFadeUp: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.8, ease: cinematicEase },
  },
};

/* ─────────────────────────────────────────────────────────────────────
 * §10  Divider / line reveal — animated separator
 * ───────────────────────────────────────────────────────────────────── */

export const dividerReveal: Variants = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: { duration: 1, ease: cinematicEase },
  },
};

/* ─────────────────────────────────────────────────────────────────────
 * §11  Stagger presets
 * ───────────────────────────────────────────────────────────────────── */

export const staggerMedium: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

/* ─────────────────────────────────────────────────────────────────────
 * §12  Announcement bar — slide down entrance
 * ───────────────────────────────────────────────────────────────────── */

export const announcementSlide: Variants = {
  hidden: { y: "-100%", opacity: 0 },
  visible: {
    y: "0%",
    opacity: 1,
    transition: { duration: 0.5, ease: smoothEase },
  },
  exit: {
    y: "-100%",
    opacity: 0,
    transition: { duration: 0.3, ease: exitEase },
  },
};



"use client";

import * as React from "react";
import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { smoothEase, cinematicEase } from "@/lib/motion";

/* ─────────────────────────────────────────────────────────────────────
 * FadeIn V3 — Premium scroll-reveal wrapper.
 *
 * V3 additions over V2:
 *   - `stagger` prop — child-index delay multiplier for array usage
 *   - `amount` prop — viewport intersection ratio (0–1)
 *   - `once` prop — override viewport.once (default true)
 *   - `offset` prop — override directional offset distance
 *   - Tighter defaults: 32px offset, -60px margin
 *
 * Usage:
 *   {items.map((item, i) => (
 *     <FadeIn direction="up" blur scale stagger={i} key={item.id}>
 *       <Card {...item} />
 *     </FadeIn>
 *   ))}
 * ───────────────────────────────────────────────────────────────────── */

type Direction = "up" | "down" | "left" | "right" | "none";

interface FadeInProps
  extends Omit<HTMLMotionProps<"div">, "initial" | "whileInView" | "viewport" | "transition"> {
  children: React.ReactNode;
  delay?: number;
  direction?: Direction;
  className?: string;
  /** Add blur-in effect (6px → 0) */
  blur?: boolean;
  /** Add scale entrance (0.96 → 1) */
  scale?: boolean;
  /** Use cinematicEase + longer duration */
  dramatic?: boolean;
  /** Custom duration override (default 0.7 / 0.9 dramatic) */
  duration?: number;
  /** Child index for stagger — adds index * 0.08s to delay */
  stagger?: number;
  /** Viewport intersection amount 0–1 (default: uses margin) */
  amount?: number;
  /** Override viewport.once — default true */
  once?: boolean;
  /** Override directional offset distance in px (default 32) */
  offset?: number;
}

export function FadeIn({
  children,
  delay = 0,
  direction = "up",
  className,
  blur = false,
  scale = false,
  dramatic = false,
  duration,
  stagger,
  amount,
  once = true,
  offset = 32,
  ...props
}: FadeInProps): React.JSX.Element {
  const directionOffset: Record<Direction, { x: number; y: number }> = {
    up: { y: offset, x: 0 },
    down: { y: -offset, x: 0 },
    left: { x: offset, y: 0 },
    right: { x: -offset, y: 0 },
    none: { x: 0, y: 0 },
  };

  const off = directionOffset[direction];
  const prefersReducedMotion = useReducedMotion();
  void blur;
  const staggerDelay = stagger != null ? stagger * 0.08 : 0;
  const totalDelay = delay + staggerDelay;

  const baseDuration = dramatic ? 0.9 : 0.7;
  const initialState: Record<string, number | string> = {
    opacity: 0,
    ...off,
  };
  const animateState: Record<string, number | string> = {
    opacity: 1,
    x: 0,
    y: 0,
  };

  // blur prop is accepted but no longer applies filter for performance
  // The opacity+transform animation is sufficient for a premium feel

  if (scale) {
    initialState.scale = 0.96;
    animateState.scale = 1;
  }

  const viewportConfig: { once: boolean; margin?: string; amount?: number } = {
    once,
  };
  if (amount != null) {
    viewportConfig.amount = amount;
  } else {
    viewportConfig.margin = "-60px";
  }

  return (
    <motion.div
      initial={initialState}
      whileInView={animateState}
      viewport={viewportConfig}
      transition={{
        duration: prefersReducedMotion ? 0 : (duration ?? baseDuration),
        delay: prefersReducedMotion ? 0 : totalDelay,
        ease: dramatic ? cinematicEase : smoothEase,
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

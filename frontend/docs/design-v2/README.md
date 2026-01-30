# Design V2 Specification: "Elegant Professional"

**Status**: ✅ Implementation Complete (83/100 tasks)
**Reference**: [Ineo-Sense](https://www.ineo-sense.com/v) (Structure & Motion ONLY)
**Typography**: **Montserrat** (Single Family, All Weights)
**Color**: **Existing Monochrome** (DO NOT CHANGE)

---

## ⚠️ Critical Constraints

> [!CAUTION]
> **DO NOT** change the color palette. Use `globals.css` tokens (`--background`, `--foreground`, etc.).

> [!IMPORTANT]
> **DO** use Montserrat for ALL text (no secondary font).
> **DO** focus on Layout, Typography Weight, and Motion.

---

## 1. Typography Tokens (Montserrat)

| Class | Weight | Size | Use |
|---|---|---|---|
| `type-hero` | Bold (700) | `clamp(2.5rem, 6vw, 5rem)` | Hero Headlines |
| `type-h1` | SemiBold (600) | `clamp(2rem, 4vw, 3rem)` | Page Titles |
| `type-h2` | SemiBold (600) | `clamp(1.5rem, 3vw, 2rem)` | Section Titles |
| `type-body` | Regular (400) | `1rem` | Paragraphs |
| `type-kicker` | Medium (500) | `0.75rem` uppercase | Labels |

---

## 2. Motion Tokens

| Token | Value | Use |
|---|---|---|
| `--transition-elegant` | `400ms cubic-bezier(0.22, 1, 0.36, 1)` | Hovers, reveals |
| `--shadow-elegant` | Multi-layer soft shadow | Cards, CTAs |

---

## 3. Component Status

### Navigation ✅

- [x] Transparent at top, Frosted on scroll.
- [x] Magnetic hover on links.
- [x] Mobile curtain menu.

### Hero ✅

- [x] Asymmetric split layout.
- [x] Gradient mesh background.
- [x] Staggered text reveal.

### Cards ✅

- [x] Multi-layer shadow (`--shadow-elegant`).
- [x] Hover scale effects.

### Buttons ✅

- [x] Pill shape.
- [x] WhatsApp CTA sticky.

### Motion Components ✅

- [x] `LenisProvider` - Smooth scroll
- [x] `StaggerReveal` - Staggered entrance
- [x] `TextReveal` - Word-by-word
- [x] `SectionReveal` - Viewport trigger
- [x] `Marquee` - Infinite scroll
- [x] `PageTransition` - Route wipe
- [x] `V2Preloader` - Curtain reveal

### Accessibility ✅

- [x] `SkipLink` - Keyboard navigation
- [x] `FocusManager` - Lenis sync
- [x] `ReducedMotionProvider` - WCAG 2.2 AA

---

## 4. Page Status

| Page | Route | Status |
|---|---|---|
| Homepage | `/` | ✅ Complete |
| Products | `/products` | ✅ Complete |
| Product Detail | `/products/[id]` | ✅ Complete |
| Education | `/education` | ✅ Complete |
| Partnership | `/partnership` | ✅ Complete |
| About | `/about` | ✅ Complete |
| Contact | `/contact` | ✅ Complete |
| Privacy | `/privacy` | ✅ Complete |
| Terms | `/terms` | ✅ Complete |
| 404 | `/not-found` | ✅ Complete |

---

## 5. Dependencies

- `lenis` (Smooth Scroll) - ✅ Configured
- `framer-motion` (Animations) - ✅ Configured
- `next/font/google` (Montserrat) - ✅ Configured

---

## 6. Related Documents

- [Migration Runbook](./MIGRATION-RUNBOOK.md)
- [Task Backlog](../../.gemini/antigravity/brain/*/task.md)

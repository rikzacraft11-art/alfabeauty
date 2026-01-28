"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";

import { useLocale } from "@/components/i18n/LocaleProvider";
import AppLink from "@/components/ui/AppLink";
import { t } from "@/lib/i18n";
import { IconChevronDown } from "@/components/ui/icons";

type MegaLink = {
  href: string;
  label: string;
};

type MegaItem = {
  key: string;
  href: string;
  label: string;
  links?: MegaLink[];
};

type HeaderTone = "default" | "onMedia";

export default function DesktopMegaNav({
  items,
  tone = "default",
  onOpenChange,
}: {
  items: MegaItem[];
  tone?: HeaderTone;
  onOpenChange?: (open: boolean) => void;
}) {
  const { locale } = useLocale();
  const tx = t(locale);
  const pathname = usePathname() ?? "";

  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [openByKeyboard, setOpenByKeyboard] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const triggerLinkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const triggerBtnRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const active = useMemo(() => items.find((i) => i.key === activeKey), [activeKey, items]);
  const panelOpen = Boolean(active && active.links && active.links.length > 0);

  // Cancel any pending close when entering nav item or panel
  const handleMouseEnter = useCallback((key: string) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    // Only update if different key to prevent unnecessary rerenders
    setActiveKey(prev => prev === key ? prev : key);
  }, []);

  // Enterprise-grade debounced close (200ms for smooth transitions)
  const handleMouseLeave = useCallback(() => {
    closeTimeoutRef.current = setTimeout(() => {
      setActiveKey(null);
    }, 200);
  }, []);

  useEffect(() => {
    onOpenChange?.(panelOpen);
  }, [onOpenChange, panelOpen]);

  const normalizePath = useCallback((path: string) => {
    if (!path) return "/";
    const trimmed = path.replace(/\/+$/, "");
    return trimmed === "" ? "/" : trimmed;
  }, []);

  const isActiveHref = useCallback(
    (href: string) => {
      const current = normalizePath(pathname);
      const target = normalizePath(href);
      if (current === target) return true;
      if (target === "/") return current === "/";
      return current.startsWith(`${target}/`);
    },
    [normalizePath, pathname],
  );

  const closePanel = useCallback(
    (opts?: { restoreFocus?: boolean; key?: string }) => {
      const key = opts?.key ?? activeKey;
      setActiveKey(null);
      setOpenByKeyboard(false);

      if (opts?.restoreFocus && key) {
        // Prefer returning focus to the disclosure button (APG disclosure navigation pattern).
        triggerBtnRefs.current[key]?.focus();
        if (document.activeElement === document.body) {
          triggerLinkRefs.current[key]?.focus();
        }
      }
    },
    [activeKey],
  );

  // Guard: when resizing below the desktop cutoff, ensure the (hidden) desktop nav is closed.
  // Do this via a matchMedia callback (not synchronously in the effect body) to satisfy our lint rule.
  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;

    const media = window.matchMedia("(min-width: 992px)");

    function onChange() {
      if (!media.matches) closePanel({ restoreFocus: false });
    }

    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    }

    media.addListener(onChange);
    return () => media.removeListener(onChange);
  }, [closePanel]);

  const focusFirstPanelLink = () => {
    const root = panelRef.current;
    if (!root) return;
    const first = root.querySelector<HTMLElement>("a[href], button:not([disabled]), [tabindex]:not([tabindex='-1'])");
    first?.focus();
  };

  const focusTriggerLink = (key: string) => {
    triggerLinkRefs.current[key]?.focus();
  };

  const focusAdjacentTrigger = (currentKey: string, direction: -1 | 1) => {
    const idx = items.findIndex((it) => it.key === currentKey);
    if (idx < 0) return;
    const nextIdx = (idx + direction + items.length) % items.length;
    const nextItem = items[nextIdx];
    if (nextItem) focusTriggerLink(nextItem.key);
  };

  useEffect(() => {
    if (!panelOpen) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        closePanel({ restoreFocus: true });
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [closePanel, panelOpen]);


  useEffect(() => {
    if (!panelOpen) return;

    function onFocusIn(e: FocusEvent) {
      const root = rootRef.current;
      if (!root) return;
      if (e.target instanceof Node && root.contains(e.target)) return;
      setActiveKey(null);
    }

    document.addEventListener("focusin", onFocusIn);
    return () => document.removeEventListener("focusin", onFocusIn);
  }, [panelOpen]);

  useEffect(() => {
    if (!panelOpen) return;
    if (!openByKeyboard) return;

    const t0 = window.setTimeout(() => {
      focusFirstPanelLink();
    }, 0);

    return () => window.clearTimeout(t0);
  }, [panelOpen, openByKeyboard]);

  useEffect(() => {
    function onDocumentClick(e: MouseEvent) {
      const root = rootRef.current;
      if (!root) return;
      if (e.target instanceof Node && root.contains(e.target)) return;
      setActiveKey(null);
    }

    document.addEventListener("mousedown", onDocumentClick);
    return () => document.removeEventListener("mousedown", onDocumentClick);
  }, []);

  const navTextClass = tone === "onMedia" ? "text-background" : "text-foreground";
  const navMutedTextClass = tone === "onMedia" ? "text-background/80 hover:text-background" : "text-foreground-muted hover:text-foreground";

  return (
    <div ref={rootRef} className="relative header-desktop-only-block" onMouseLeave={handleMouseLeave}>
      <nav className={`flex items-center gap-10 type-nav ${navTextClass}`} aria-label="Main Navigation" id="nav-main">
        {items.map((item) => {
          const hasPanel = Boolean(item.links && item.links.length > 0);
          const isActive = activeKey === item.key;
          const isCurrent = isActiveHref(item.href);
          const triggerBtnId = `mega-trigger-${item.key}`;
          const panelId = `mega-${item.key}`;

          return (
            <div key={item.key} className="relative py-2 -my-2" onMouseEnter={() => handleMouseEnter(item.key)}>
              <div className="flex items-center gap-1">
                <AppLink
                  href={item.href}
                  ref={(el) => {
                    triggerLinkRefs.current[item.key] = el;
                  }}
                  aria-current={isCurrent ? "page" : undefined}
                  aria-expanded={hasPanel ? (isActive ? true : false) : undefined}
                  aria-controls={hasPanel ? panelId : undefined}
                  className={`ui-focus-ring ui-radius-tight transition-colors duration-150 ${isCurrent
                    ? `${tone === "onMedia" ? "text-background" : "text-foreground"} underline underline-offset-[10px]`
                    : isActive
                      ? `${tone === "onMedia" ? "text-background" : "text-foreground"}`
                      : tone === "onMedia" ? "text-background/80 hover:text-background" : "text-foreground-muted hover:text-foreground"
                    }`}
                  onKeyDown={(e) => {
                    if (!hasPanel) {
                      if (e.key === "ArrowLeft") {
                        e.preventDefault();
                        focusAdjacentTrigger(item.key, -1);
                      } else if (e.key === "ArrowRight") {
                        e.preventDefault();
                        focusAdjacentTrigger(item.key, 1);
                      }
                      return;
                    }

                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      setOpenByKeyboard(true);
                      setActiveKey(item.key);
                      return;
                    }
                    if (e.key === "ArrowLeft") {
                      e.preventDefault();
                      focusAdjacentTrigger(item.key, -1);
                      return;
                    }
                    if (e.key === "ArrowRight") {
                      e.preventDefault();
                      focusAdjacentTrigger(item.key, 1);
                      return;
                    }
                  }}
                >
                  {item.label}
                </AppLink>
                {hasPanel ? (
                  <button
                    type="button"
                    className={`ui-focus-ring ui-radius-tight inline-flex h-8 w-8 items-center justify-center ${navMutedTextClass}`}
                    aria-label={`Open ${item.label} menu`}
                    id={triggerBtnId}
                    aria-haspopup="true"
                    aria-expanded={isActive ? true : false}
                    aria-controls={panelId}
                    ref={(el) => {
                      triggerBtnRefs.current[item.key] = el;
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      setOpenByKeyboard(false);
                      setActiveKey((k) => (k === item.key ? null : item.key));
                    }}
                    onKeyDown={(e) => {
                      if (e.key === " " || e.key === "Enter") {
                        e.preventDefault();
                        setOpenByKeyboard(true);
                        setActiveKey((k) => (k === item.key ? null : item.key));
                        return;
                      }
                      if (e.key === "ArrowLeft") {
                        e.preventDefault();
                        focusAdjacentTrigger(item.key, -1);
                        return;
                      }
                      if (e.key === "ArrowRight") {
                        e.preventDefault();
                        focusAdjacentTrigger(item.key, 1);
                        return;
                      }
                      if (e.key === "ArrowDown") {
                        e.preventDefault();
                        setOpenByKeyboard(true);
                        setActiveKey(item.key);
                        return;
                      }
                    }}
                  >
                    <IconChevronDown className="h-4 w-4" aria-hidden="true" />
                  </button>
                ) : null}
              </div>
            </div>
          );
        })}
      </nav>

      {panelOpen && active ? (
        <>
          {/* Overlay with subtle blur */}
          <div
            className="fixed inset-x-0 bottom-0 top-[var(--header-offset)] z-30 
                       bg-black/5 backdrop-blur-[2px]"
            aria-hidden="true"
            onMouseDown={() => closePanel({ key: active.key })}
          />

          {/* Enterprise Mega Panel */}
          <div
            id={`mega-${active.key}`}
            ref={panelRef}
            className="fixed left-0 right-0 top-[var(--header-offset)] z-40 
                       max-h-[calc(var(--vh,100dvh)-var(--header-offset))] 
                       overflow-y-auto bg-background
                       shadow-[0_4px_24px_-6px_rgba(0,0,0,0.1)]"
            style={{
              animation: 'megaMenuEnter 350ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
            }}
            onMouseEnter={() => handleMouseEnter(active.key)}
            role="region"
            aria-labelledby={`mega-trigger-${active.key}`}
          >
            {/* Top accent line */}
            <div className="h-px bg-gradient-to-r from-transparent via-foreground/15 to-transparent" />

            <div className="mx-auto w-full max-w-[90rem] px-8 py-8 lg:px-12">
              <div
                className="grid grid-cols-12 gap-16"
                style={{
                  animation: 'megaMenuContentFade 300ms cubic-bezier(0.16, 1, 0.3, 1) 50ms forwards',
                  opacity: 0,
                }}
              >

                {/* Links Section - Clean columns with headers */}
                <div className="col-span-7 lg:col-span-8">
                  {/* Category title */}
                  <p className="type-data text-foreground/40 uppercase mb-4">
                    {active.label}
                  </p>

                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-0">
                    {active.links?.map((l) => (
                      <AppLink
                        key={l.href}
                        href={l.href}
                        aria-current={isActiveHref(l.href) ? "page" : undefined}
                        className={`py-1.5 type-body transition-colors duration-150
                          ${isActiveHref(l.href)
                            ? "text-foreground"
                            : "text-foreground-muted hover:text-foreground"
                          }`}
                        onClick={() => closePanel({ key: active.key })}
                      >
                        {l.label}
                      </AppLink>
                    ))}
                  </div>

                  {/* Shop All CTA */}
                  <div className="mt-6 pt-5 border-t border-border/50">
                    <AppLink
                      href={active.href}
                      className="inline-flex items-center gap-3 type-body-strong 
                                 text-foreground group"
                      onClick={() => setActiveKey(null)}
                    >
                      <span className="underline underline-offset-4 decoration-foreground/30
                                      group-hover:decoration-foreground transition-colors duration-200">
                        {tx.header.mega.shopAll} {active.label}
                      </span>
                      <svg
                        width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="1.5" aria-hidden="true"
                        className="group-hover:translate-x-1 transition-transform duration-200"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </AppLink>
                  </div>
                </div>

                {/* Featured Section - Premium visual */}
                <div className="col-span-5 lg:col-span-4">
                  <div className="relative aspect-[5/3] bg-muted overflow-hidden group cursor-pointer">
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent 
                                   group-hover:from-black/80 transition-all duration-500" />

                    {/* Content */}
                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <p className="type-data uppercase text-background/60 mb-2">
                        {tx.header.mega.featuredTitle}
                      </p>
                      <p className="type-body text-background
                                   group-hover:translate-y-[-2px] transition-transform duration-300">
                        {tx.header.mega.featuredBody}
                      </p>

                      {/* Explore indicator */}
                      <div className="mt-3 flex items-center gap-2 text-background/70 type-data uppercase
                                     opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0
                                     transition-all duration-300 delay-100">
                        <span>{locale === 'id' ? 'Jelajahi' : 'Explore'}</span>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>

                    {/* Corner accent */}
                    <div className="absolute top-4 right-4 w-6 h-px bg-background/30" />
                    <div className="absolute top-4 right-4 w-px h-6 bg-background/30" />
                  </div>
                </div>

              </div>
            </div>

            {/* Bottom accent line */}
            <div className="h-px bg-border" />
          </div>
        </>
      ) : null}
    </div>
  );
}

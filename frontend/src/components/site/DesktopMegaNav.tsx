"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useLocale } from "@/components/i18n/LocaleProvider";
import AppLink from "@/components/ui/AppLink";
import { t } from "@/lib/i18n";

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

function IconChevronDown(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export default function DesktopMegaNav({ items }: { items: MegaItem[] }) {
  const { locale } = useLocale();
  const tx = t(locale);

  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [openByKeyboard, setOpenByKeyboard] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const triggerLinkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const triggerBtnRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const active = useMemo(() => items.find((i) => i.key === activeKey), [activeKey, items]);
  const panelOpen = Boolean(active && active.links && active.links.length > 0);

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
    focusTriggerLink(items[nextIdx].key);
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

  return (
    <div ref={rootRef} className="relative hidden md:block" onMouseLeave={() => setActiveKey(null)}>
      <nav className="flex items-center gap-10 type-nav text-foreground" aria-label="Primary">
        {items.map((item) => {
          const hasPanel = Boolean(item.links && item.links.length > 0);
          const isActive = activeKey === item.key;
          const triggerBtnId = `mega-trigger-${item.key}`;
          const panelId = `mega-${item.key}`;

          return (
            <div key={item.key} className="relative" onMouseEnter={() => setActiveKey(item.key)}>
              <div className="flex items-center gap-1">
                <AppLink
                  href={item.href}
                  ref={(el) => {
                    triggerLinkRefs.current[item.key] = el;
                  }}
                  className={`ui-focus-ring ui-radius-tight ${
                    isActive
                      ? "text-foreground underline underline-offset-[10px]"
                      : "hover:text-foreground"
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
                    className="ui-focus-ring ui-radius-tight inline-flex h-8 w-8 items-center justify-center text-foreground-muted hover:text-foreground"
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
          {/*
            Overlay + panel are positioned to start below the sticky header.
            Header heights: promo (h-9 = 36px) + nav (72px) = 108px.
          */}
          <div
            className="fixed inset-x-0 bottom-0 top-[108px] z-30 bg-black/20"
            aria-hidden="true"
            onMouseDown={() => closePanel({ key: active.key })}
          />
          <div
            id={`mega-${active.key}`}
            ref={panelRef}
            className="fixed left-0 right-0 top-[108px] z-40 border-b border-border bg-background"
            onMouseEnter={() => setActiveKey(active.key)}
            role="region"
            aria-labelledby={`mega-trigger-${active.key}`}
          >
            <div className="mx-auto grid w-full max-w-[80rem] grid-cols-12 gap-8 px-4 py-8 sm:px-6 lg:px-10">
              <div className="col-span-4">
                <p className="type-kicker text-muted">{tx.header.mega.featuredTitle}</p>
                <p className="mt-2 type-body-compact">{tx.header.mega.featuredBody}</p>
                <div className="mt-4">
                  <AppLink
                    href={active.href}
                    className="inline-flex type-data-strong text-foreground underline underline-offset-4 hover:no-underline"
                    onClick={() => setActiveKey(null)}
                  >
                    {tx.header.mega.shopAll} {active.label}
                  </AppLink>
                </div>
              </div>

              <div className="col-span-8">
                <div className="grid grid-cols-2 gap-x-10 gap-y-3">
                  {active.links?.map((l) => (
                    <AppLink
                      key={l.href}
                      href={l.href}
                      className="type-data text-foreground-soft hover:text-foreground"
                      onClick={() => closePanel({ key: active.key })}
                    >
                      {l.label}
                    </AppLink>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import DesktopMegaNav from "@/components/site/DesktopMegaNav";
import HeaderPromo from "@/components/site/HeaderPromo";
import LocaleToggle from "@/components/i18n/LocaleToggle";
import { useLocale } from "@/components/i18n/LocaleProvider";
import AppLink from "@/components/ui/AppLink";
import ButtonLink from "@/components/ui/ButtonLink";
import { t } from "@/lib/i18n";

function IconMenu(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M4 6h16" />
      <path d="M4 12h16" />
      <path d="M4 18h16" />
    </svg>
  );
}

function IconClose(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M18 6 6 18" />
      <path d="M6 6l12 12" />
    </svg>
  );
}

function IconChevronRight(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function IconChevronLeft(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function lockScroll(locked: boolean) {
  // Scroll lock that works well on mobile and avoids background scroll.
  const el = document.documentElement;
  if (locked) {
    el.style.overflow = "hidden";
  } else {
    el.style.overflow = "";
  }
}

function getFocusable(root: HTMLElement | null): HTMLElement[] {
  if (!root) return [];
  const nodes = root.querySelectorAll<HTMLElement>(
    [
      "a[href]",
      "button:not([disabled])",
      "input:not([disabled])",
      "select:not([disabled])",
      "textarea:not([disabled])",
      "[tabindex]:not([tabindex='-1'])",
    ].join(","),
  );
  return Array.from(nodes).filter((n) => !n.hasAttribute("disabled") && n.tabIndex !== -1);
}

export default function SiteHeader() {
  const { locale } = useLocale();
  const tx = t(locale);
  const base = `/${locale}`;

  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileSubmenu, setMobileSubmenu] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);

  const nav = useMemo(() => {
    const productsHref = `${base}/products`;
    const educationHref = `${base}/education`;
    const educationArticlesHref = `${base}/education/articles`;
    const educationEventsHref = `${base}/education/events`;
    const partnershipHref = `${base}/partnership`;
    const becomePartnerHref = `${base}/partnership/become-partner`;
    const aboutHref = `${base}/about`;
    const contactHref = `${base}/contact`;

    return [
      {
        key: "products",
        href: productsHref,
        label: tx.nav.products,
        links: [
          { href: productsHref, label: `${tx.header.mega.shopAll} ${tx.nav.products}` },
          { href: becomePartnerHref, label: tx.cta.becomePartner },
          { href: contactHref, label: tx.nav.contact },
        ],
      },
      {
        key: "education",
        href: educationHref,
        label: tx.nav.education,
        links: [
          { href: educationHref, label: `${tx.header.mega.shopAll} ${tx.nav.education}` },
          { href: educationArticlesHref, label: tx.header.mega.links.articles },
          { href: educationEventsHref, label: tx.header.mega.links.events },
        ],
      },
      {
        key: "partnership",
        href: partnershipHref,
        label: tx.nav.partnership,
        links: [
          { href: partnershipHref, label: `${tx.header.mega.shopAll} ${tx.nav.partnership}` },
          { href: becomePartnerHref, label: tx.cta.becomePartner },
        ],
      },
      { key: "about", href: aboutHref, label: tx.nav.about },
      { key: "contact", href: contactHref, label: tx.nav.contact },
    ];
  }, [base, tx]);

  useEffect(() => {
    if (!menuOpen) return;

    lockScroll(true);

    const openerEl = openerRef.current;

    // Focus the close button for an accessible entry point.
    const t0 = window.setTimeout(() => {
      closeBtnRef.current?.focus();
    }, 0);

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        setMobileSubmenu(null);
        setMenuOpen(false);
        return;
      }
      if (e.key !== "Tab") return;

      const focusables = getFocusable(drawerRef.current);
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      const active = document.activeElement as HTMLElement | null;
      if (!active) return;

      if (e.shiftKey) {
        if (active === first || active === drawerRef.current) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(t0);
      document.removeEventListener("keydown", onKeyDown);
      lockScroll(false);
      // Return focus to the menu opener.
      openerEl?.focus();
    };
  }, [menuOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const becomePartnerHref = `${base}/partnership/become-partner`;
  const contactHref = `${base}/contact`;
  const productsHref = `${base}/products`;
  const educationHref = `${base}/education`;
  const partnershipHref = `${base}/partnership`;

  return (
    <header
      className={"sticky top-0 z-40 bg-background"}
      data-scrolled={scrolled ? "true" : "false"}
    >
      <HeaderPromo />

      {/* Main nav */}
      <div className="border-b border-border">
        <div className="mx-auto grid h-[72px] w-full grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-6 lg:px-10">
          <div className="flex items-center justify-start gap-4">
            <AppLink href={base} underline="none" className="type-brand text-foreground">
              Alfa Beauty
            </AppLink>
          </div>

          <div className="justify-self-center">
            <DesktopMegaNav items={nav} />
          </div>

          <div className="flex items-center justify-end gap-2">
            {/* Desktop actions */}
            <div className="hidden md:flex items-center gap-4">
              <div className="border-r border-border pr-4">
                <LocaleToggle />
              </div>
              <ButtonLink href={becomePartnerHref} size="sm">
                {tx.cta.becomePartner}
              </ButtonLink>
            </div>

            {/* Mobile actions */}
            <button
              ref={openerRef}
              type="button"
              className="ui-focus-ring ui-radius-tight inline-flex h-10 w-10 items-center justify-center text-foreground-muted hover:text-foreground md:hidden"
              aria-label={tx.header.actions.openMenu}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              onClick={() => {
                setMobileSubmenu(null);
                setMenuOpen(true);
              }}
            >
              <IconMenu className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile full-screen drawer */}
      {menuOpen ? (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <div
            className="absolute inset-0 bg-foreground/30"
            onClick={() => {
              setMobileSubmenu(null);
              setMenuOpen(false);
            }}
            aria-hidden="true"
          />
          <div
            id="mobile-nav"
            ref={drawerRef}
            className="absolute inset-x-0 top-0 max-h-[100dvh] overflow-auto bg-background"
          >
            <div className="flex h-16 items-center justify-between border-b border-border px-4 sm:px-6">
              <AppLink
                href={base}
                underline="none"
                className="type-brand text-foreground"
                onClick={() => setMenuOpen(false)}
              >
                Alfa Beauty
              </AppLink>
              <button
                ref={closeBtnRef}
                type="button"
                className="ui-focus-ring ui-radius-tight inline-flex h-10 w-10 items-center justify-center text-foreground-muted hover:text-foreground"
                aria-label={tx.header.actions.closeMenu}
                onClick={() => {
                  setMobileSubmenu(null);
                  setMenuOpen(false);
                }}
              >
                <IconClose className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="py-8 px-4 sm:px-6">
              {mobileSubmenu ? (
                <div>
                  <button
                    type="button"
                    className="type-data-strong mb-6 inline-flex items-center gap-2 text-foreground"
                    onClick={() => setMobileSubmenu(null)}
                  >
                    <IconChevronLeft className="h-5 w-5" aria-hidden="true" />
                    {tx.header.mega.actions.back}
                  </button>

                  <div className="space-y-2">
                    {nav
                      .find((n) => n.key === mobileSubmenu)
                      ?.links?.map((l) => (
                        <AppLink
                          key={l.href}
                          href={l.href}
                          className="type-nav flex items-center justify-between border-b border-border py-6 text-foreground"
                          onClick={() => {
                            setMobileSubmenu(null);
                            setMenuOpen(false);
                          }}
                        >
                          <span>{l.label}</span>
                          <IconChevronRight className="h-6 w-6 text-muted-soft" aria-hidden="true" />
                        </AppLink>
                      ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {nav.map((n) => {
                    const hasSub = Boolean(n.links && n.links.length > 0);
                    if (hasSub) {
                      return (
                        <button
                          key={n.key}
                          type="button"
                          className="type-nav flex w-full items-center justify-between border-b border-border py-6 text-left text-foreground"
                          onClick={() => setMobileSubmenu(n.key)}
                        >
                          <span>{n.label}</span>
                          <IconChevronRight className="h-6 w-6 text-muted-soft" aria-hidden="true" />
                        </button>
                      );
                    }

                    return (
                      <AppLink
                        key={n.key}
                        href={n.href}
                        className="type-nav flex items-center justify-between border-b border-border py-6 text-foreground"
                        onClick={() => setMenuOpen(false)}
                      >
                        <span>{n.label}</span>
                        <IconChevronRight className="h-6 w-6 text-muted-soft" aria-hidden="true" />
                      </AppLink>
                    );
                  })}
                </div>
              )}

              <div className="mt-10 space-y-6">
                <div>
                  <p className="type-data-strong text-foreground">Language</p>
                  <div className="mt-3 inline-flex">
                    <LocaleToggle />
                  </div>
                </div>

                <div className="space-y-3">
                  <ButtonLink
                    href={becomePartnerHref}
                    className="w-full"
                    size="md"
                    prefetch={false}
                    onClick={() => setMenuOpen(false)}
                  >
                    {tx.cta.becomePartner}
                  </ButtonLink>
                  <ButtonLink
                    href={contactHref}
                    className="w-full"
                    size="md"
                    variant="secondary"
                    prefetch={false}
                    onClick={() => setMenuOpen(false)}
                  >
                    {tx.nav.contact}
                  </ButtonLink>
                </div>

                <div className="space-y-2 type-body">
                  <p>{tx.header.announcement}</p>
                  <p>
                    <AppLink
                      href={productsHref}
                      className="type-data-strong text-foreground underline underline-offset-2 hover:no-underline"
                      onClick={() => setMenuOpen(false)}
                    >
                      {tx.nav.products}
                    </AppLink>
                    {" · "}
                    <AppLink
                      href={educationHref}
                      className="type-data-strong text-foreground underline underline-offset-2 hover:no-underline"
                      onClick={() => setMenuOpen(false)}
                    >
                      {tx.nav.education}
                    </AppLink>
                    {" · "}
                    <AppLink
                      href={partnershipHref}
                      className="type-data-strong text-foreground underline underline-offset-2 hover:no-underline"
                      onClick={() => setMenuOpen(false)}
                    >
                      {tx.nav.partnership}
                    </AppLink>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}

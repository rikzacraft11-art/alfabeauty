"use client";

import { useMemo, useRef, useState, useCallback, useEffect } from "react";
import { usePathname } from "next/navigation";

import DesktopMegaNav from "@/components/site/DesktopMegaNav";
import HeaderPromo from "@/components/site/HeaderPromo";
import MobileDrawer from "@/components/site/MobileDrawer";
import MobileNavMenu, { NavItem } from "@/components/site/MobileNavMenu";
import LocaleToggle from "@/components/i18n/LocaleToggle";
import { useLocale } from "@/components/i18n/LocaleProvider";
import AppLink from "@/components/ui/AppLink";
import ButtonLink from "@/components/ui/ButtonLink";
import HamburgerIcon from "@/components/ui/HamburgerIcon";
import { t } from "@/lib/i18n";
import { useHeaderScroll } from "@/lib/useHeaderScroll";
import { useHeaderOffset } from "@/lib/useHeaderOffset";

export default function SiteHeader() {
  const { locale } = useLocale();
  const tx = t(locale);
  const base = `/${locale}`;
  const pathname = usePathname() ?? "";

  // Prevent first-paint flicker on homepage (transparent header) during hydration.
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    const raf = window.requestAnimationFrame(() => setHydrated(true));
    return () => window.cancelAnimationFrame(raf);
  }, []);

  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);

  // Reference parity: ds-navbar-expand-lg uses ~992px cutoff for desktop nav.
  // Close the mobile menu when resizing into desktop (do it from an external callback,
  // not synchronously inside the effect body, to satisfy our hooks lint rule).
  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;

    const media = window.matchMedia("(min-width: 992px)");

    function onChange() {
      if (media.matches) setMenuOpen(false);
    }

    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    }

    media.addListener(onChange);
    return () => media.removeListener(onChange);
  }, []);

  // Extracted hooks
  const { scrolled, headerHidden } = useHeaderScroll({ disabled: menuOpen });
  useHeaderOffset(headerRef);

  // Reference parity: mobile menu open toggles a global `menu-open` state.
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.classList.toggle("menu-open", menuOpen);
    return () => {
      document.body.classList.remove("menu-open");
    };
  }, [menuOpen]);

  const nav: NavItem[] = useMemo(() => {
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

  const handleCloseMenu = useCallback(() => setMenuOpen(false), []);

  // Reference parity: snapshots use `var(--vh)` (set via DevTools/runtime JS) for mega-menu heights.
  // We mirror that behavior so viewport-dependent calc() matches what DevTools captures.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const root = document.documentElement;

    const updateVh = () => {
      root.style.setProperty("--vh", `${window.innerHeight}px`);
    };

    updateVh();
    window.addEventListener("resize", updateVh, { passive: true });
    window.addEventListener("orientationchange", updateVh);
    return () => {
      window.removeEventListener("resize", updateVh);
      window.removeEventListener("orientationchange", updateVh);
    };
  }, []);

  const becomePartnerHref = nav.find((n) => n.key === "partnership")?.links?.[1]?.href ?? `${base}/partnership/become-partner`;

  // Restore transparent header on home (Phase 12 Request)
  const isHome = pathname === "/" || pathname === `/${locale}`;
  const useTransparent = isHome && !scrolled && !menuOpen;

  const headerTone = useTransparent ? "onMedia" : "default";

  // If transparent, use transparent bg + white text (onMedia)
  // If solid, use background bg + foreground text (default)
  const headerBgClass = useTransparent
    ? "bg-transparent border-transparent ui-header-transparent"
    : "bg-background border-b border-border ui-header-solid";

  const brandClass = useTransparent
    ? "type-brand text-background"
    : "type-brand text-foreground";

  const mobileBtnClass = useTransparent
    ? "header-mobile-only touch-target ui-focus-ring ui-radius-tight text-white hover:text-white/80"
    : "header-mobile-only touch-target ui-focus-ring ui-radius-tight text-foreground-muted hover:text-foreground";

  const headerTransitionClass = hydrated
    ? "transition-[transform,background-color] duration-[400ms] ease-[cubic-bezier(0.19,1,0.22,1)]"
    : "";

  return (
    <>
      <header
        id="headerComponent"
        ref={headerRef}
        className={`sticky top-0 z-50 ${headerBgClass} ${headerTransitionClass} ${menuOpen ? "drawer-open" : ""} ${headerHidden ? "-translate-y-full" : "translate-y-0"
          }`}
        data-scrolled={scrolled ? "true" : "false"}
        data-hidden={headerHidden ? "true" : "false"}
        data-drawer-open={menuOpen ? "true" : "false"}
      >
        <HeaderPromo />

        <nav role="presentation">
          <div className="site-header-row mx-auto max-w-[120rem] w-full grid grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-6 lg:px-10">
            <div className="flex items-center justify-start gap-4">
              <div className="navbar-header__brand" role="heading" aria-level={1}>
                <AppLink href={base} underline="none" className={brandClass} aria-label="Alfa Beauty Homepage">
                  Alfa Beauty
                </AppLink>
              </div>
            </div>

            <div className="justify-self-center">
              <DesktopMegaNav items={nav} tone={headerTone} />
            </div>

            <div className="flex items-center justify-end gap-2">
              <div className="header-desktop-only items-center gap-4">
                <div className="border-r border-border pr-4">
                  <LocaleToggle tone={headerTone} />
                </div>
                <ButtonLink href={becomePartnerHref} size="sm" variant={headerTone === "onMedia" ? "inverted" : "primary"}>
                  {tx.cta.becomePartner}
                </ButtonLink>
              </div>

              {/* Reference-style mobile toggle + close buttons (separate elements) */}
              <button
                ref={openerRef}
                type="button"
                className={`${mobileBtnClass} ${menuOpen ? "hidden" : "inline-flex"}`}
                aria-label={tx.header.actions.openMenu}
                aria-expanded={menuOpen}
                aria-controls="mobile-nav"
                onClick={() => setMenuOpen(true)}
              >
                <HamburgerIcon isOpen={false} />
              </button>

              <button
                type="button"
                className={`${mobileBtnClass} ${menuOpen ? "inline-flex" : "hidden"}`}
                aria-label={tx.header.actions.closeMenu}
                aria-controls="mobile-nav"
                onClick={() => setMenuOpen(false)}
              >
                <HamburgerIcon isOpen={true} />
              </button>
            </div>
          </div>
        </nav>
      </header>

      <MobileDrawer
        isOpen={menuOpen}
        onClose={handleCloseMenu}
        ariaLabel="Menu"
        openerRef={openerRef}
      >
        <MobileNavMenu
          nav={nav}
          locale={locale}
          baseHref={base}
          tx={tx}
          onClose={handleCloseMenu}
          isActiveHref={isActiveHref}
        />
      </MobileDrawer>
    </>
  );
}

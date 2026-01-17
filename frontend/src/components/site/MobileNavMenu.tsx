"use client";

import { useState, useCallback, useEffect, useRef } from "react";

import AppLink from "@/components/ui/AppLink";
import ButtonLink from "@/components/ui/ButtonLink";
import LocaleToggle from "@/components/i18n/LocaleToggle";
import { IconChevronRight, IconChevronLeft } from "@/components/ui/icons";

export type NavItem = {
    key: string;
    href: string;
    label: string;
    links?: { href: string; label: string }[];
};

type Props = {
    nav: NavItem[];
    locale: string;
    baseHref: string;
    tx: {
        header: {
            mega: { actions: { back: string } };
            announcement: string;
        };
        nav: { products: string; education: string; partnership: string; contact: string };
        cta: { becomePartner: string };
    };
    onClose: () => void;
    isActiveHref: (href: string) => boolean;
};

/**
 * Mobile nav menu with drill-down submenus.
 * Renders main nav list and handles submenu navigation with slide animations.
 */
export default function MobileNavMenu({
    nav,
    locale,
    baseHref,
    tx,
    onClose,
    isActiveHref,
}: Props) {
    const [submenu, setSubmenu] = useState<string | null>(null);

    const backButtonRef = useRef<HTMLButtonElement | null>(null);
    const lastTriggerRef = useRef<HTMLElement | null>(null);
    const prevSubmenuRef = useRef<string | null>(null);

    const handleBack = useCallback(() => setSubmenu(null), []);

    const activeSubmenu = submenu ? nav.find((n) => n.key === submenu) : null;

    // Derived hrefs
    const becomePartnerHref = nav.find((n) => n.key === "partnership")?.links?.[1]?.href ?? `${baseHref}/partnership/become-partner`;
    const contactHref = nav.find((n) => n.key === "contact")?.href ?? `${baseHref}/contact`;
    const productsHref = nav.find((n) => n.key === "products")?.href ?? `${baseHref}/products`;
    const educationHref = nav.find((n) => n.key === "education")?.href ?? `${baseHref}/education`;
    const partnershipHref = nav.find((n) => n.key === "partnership")?.href ?? `${baseHref}/partnership`;

    const sliderStyle = {
        transition: "transform 400ms cubic-bezier(0.19,1,0.22,1)",
        transform: submenu ? "translateX(-50%)" : "translateX(0)",
    } as const;

    const submenuPanelId = "mobile-submenu-panel";

    useEffect(() => {
        if (submenu) {
            backButtonRef.current?.focus();
        } else if (prevSubmenuRef.current) {
            lastTriggerRef.current?.focus();
        }

        prevSubmenuRef.current = submenu;
    }, [submenu]);

    return (
        <div className="h-full overflow-hidden">
            <div className="flex h-full w-[200%] transform-gpu" style={sliderStyle}>
                {/* Main panel */}
                <div
                    className={`h-full w-1/2 overflow-y-auto px-4 py-8 sm:px-6 ${submenu ? "pointer-events-none" : "pointer-events-auto"}`}
                    aria-hidden={submenu ? true : undefined}
                >
                    <div>
                        {nav.map((n) => {
                            const hasSub = Boolean(n.links && n.links.length > 0);

                            if (hasSub) {
                                return (
                                    <button
                                        key={n.key}
                                        type="button"
                                        className="type-nav flex w-full items-center justify-between border-b border-border py-6 text-left text-foreground"
                                        aria-expanded={submenu === n.key ? true : false}
                                        aria-controls={submenuPanelId}
                                        tabIndex={submenu ? -1 : undefined}
                                        onClick={(e) => {
                                            lastTriggerRef.current = e.currentTarget;
                                            setSubmenu(n.key);
                                        }}
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
                                    aria-current={isActiveHref(n.href) ? "page" : undefined}
                                    tabIndex={submenu ? -1 : undefined}
                                    className="type-nav flex items-center justify-between border-b border-border py-6 text-foreground"
                                    onClick={onClose}
                                >
                                    <span>{n.label}</span>
                                    <IconChevronRight className="h-6 w-6 text-muted-soft" aria-hidden="true" />
                                </AppLink>
                            );
                        })}
                    </div>

                    {!submenu ? (
                        <div className="mt-10 space-y-6">
                            <div>
                                <p className="type-data-strong text-foreground">
                                    {locale === "id" ? "Bahasa" : "Language"}
                                </p>
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
                                    onClick={onClose}
                                >
                                    {tx.cta.becomePartner}
                                </ButtonLink>
                                <ButtonLink
                                    href={contactHref}
                                    className="w-full"
                                    size="md"
                                    variant="secondary"
                                    prefetch={false}
                                    onClick={onClose}
                                >
                                    {tx.nav.contact}
                                </ButtonLink>
                            </div>

                            <div className="space-y-2 type-body">
                                <p>{tx.header.announcement}</p>
                                <p>
                                    <AppLink
                                        href={productsHref}
                                        aria-current={isActiveHref(productsHref) ? "page" : undefined}
                                        className="type-data-strong text-foreground underline underline-offset-2 hover:no-underline"
                                        onClick={onClose}
                                    >
                                        {tx.nav.products}
                                    </AppLink>
                                    {" · "}
                                    <AppLink
                                        href={educationHref}
                                        aria-current={isActiveHref(educationHref) ? "page" : undefined}
                                        className="type-data-strong text-foreground underline underline-offset-2 hover:no-underline"
                                        onClick={onClose}
                                    >
                                        {tx.nav.education}
                                    </AppLink>
                                    {" · "}
                                    <AppLink
                                        href={partnershipHref}
                                        aria-current={isActiveHref(partnershipHref) ? "page" : undefined}
                                        className="type-data-strong text-foreground underline underline-offset-2 hover:no-underline"
                                        onClick={onClose}
                                    >
                                        {tx.nav.partnership}
                                    </AppLink>
                                </p>
                            </div>
                        </div>
                    ) : null}
                </div>

                {/* Submenu panel */}
                <div
                    id={submenuPanelId}
                    className={`h-full w-1/2 overflow-y-auto px-4 py-8 sm:px-6 ${submenu ? "pointer-events-auto" : "pointer-events-none"}`}
                    aria-hidden={submenu ? undefined : true}
                >
                    {submenu ? (
                        <>
                            <div className="border-b border-border pb-4">
                                <button
                                    ref={backButtonRef}
                                    type="button"
                                    className="touch-target type-data-strong inline-flex items-center gap-2 text-foreground"
                                    onClick={handleBack}
                                >
                                    <IconChevronLeft className="h-5 w-5" aria-hidden="true" />
                                    {tx.header.mega.actions.back}
                                </button>
                                <p className="mt-3 type-nav text-foreground">
                                    {activeSubmenu?.label ?? ""}
                                </p>
                            </div>

                            <div className="mt-4 space-y-2">
                                {activeSubmenu?.links?.map((l) => (
                                    <AppLink
                                        key={l.href}
                                        href={l.href}
                                        aria-current={isActiveHref(l.href) ? "page" : undefined}
                                        className="type-nav flex items-center justify-between border-b border-border py-6 text-foreground"
                                        onClick={onClose}
                                    >
                                        <span>{l.label}</span>
                                        <IconChevronRight className="h-6 w-6 text-muted-soft" aria-hidden="true" />
                                    </AppLink>
                                ))}
                            </div>
                        </>
                    ) : null}
                </div>
            </div>
        </div>
    );
}

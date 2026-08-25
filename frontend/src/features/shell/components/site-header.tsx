"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Menu, FileText, ShoppingBag } from "lucide-react";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/shared/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/shared/components/ui/sheet";
import { Button } from "@/shared/components/ui/button";
import { LanguageSwitcher } from "@/shared/components/ui/language-switcher";
import { useLanguage } from "@/shared/components/providers/language-provider";
import { cn } from "@/shared/lib/utils";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { SITE_NAME, SITE_SHORT_NAME } from "@/shared/lib/config";
import { useLenisControl } from "@/shared/components/providers/lenis-provider";
import { LoginDropdown } from "./login-dropdown";
import { ProductsPanel } from "./nav/products-panel";
import { BrandsPanel } from "./nav/brands-panel";
import { EducationPanel } from "./nav/education-panel";
import { PartnershipPanel } from "./nav/partnership-panel";
import { MobileMenu } from "./nav/mobile-menu";

/* ── Header Performance & Closing Timing Parameters (1:1 Yucca Parity) ── */
const MENU_CLOSE_TIMEOUT_MS = 280;
const SCROLL_DELTA_THRESHOLD = 4;
const NAV_HOVER_DELAY_MS = 100;
const BACKDROP_EXIT_DURATION_S = 0.25;

export function SiteHeader(): React.JSX.Element {
    const pathname = usePathname();
    const solid = pathname !== "/";
    const { dict } = useLanguage();
    const { stop: lenisStop, start: lenisStart } = useLenisControl();
    const [scrolled, setScrolled] = React.useState(false);
    const [menuOpen, setMenuOpen] = React.useState(false);
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [headerHovered, setHeaderHovered] = React.useState(false);
    const [menuClosing, setMenuClosing] = React.useState(false);
    const menuWasOpen = React.useRef(false);
    const { scrollY } = useScroll();
    const lastScrollY = React.useRef(0);
    const currentScrolledRef = React.useRef(false);
    const currentDirectionRef = React.useRef<"up" | "down">("up");
    const accumulatedDelta = React.useRef(0);
    const [scrollDirection, setScrollDirection] = React.useState<"up" | "down">("up");
    const rafId = React.useRef(0);

    useMotionValueEvent(scrollY, "change", (latest) => {
        cancelAnimationFrame(rafId.current);
        rafId.current = requestAnimationFrame(() => {
            const isScrolled = latest > 30;
            if (currentScrolledRef.current !== isScrolled) {
                currentScrolledRef.current = isScrolled;
                setScrolled(isScrolled);
            }
            const diff = latest - lastScrollY.current;

            if (latest <= 30) {
                // At the top of page: always show header
                if (currentDirectionRef.current !== "up") {
                    currentDirectionRef.current = "up";
                    setScrollDirection("up");
                }
                accumulatedDelta.current = 0;
            } else if (diff > 0) {
                // Scrolling DOWN (even very slowly): accumulate delta
                if (accumulatedDelta.current < 0) {
                    accumulatedDelta.current = 0;
                }
                accumulatedDelta.current += diff;

                // Close/hide header as soon as user has scrolled down by at least SCROLL_DELTA_THRESHOLD px total
                if (accumulatedDelta.current >= SCROLL_DELTA_THRESHOLD && currentDirectionRef.current !== "down") {
                    currentDirectionRef.current = "down";
                    setScrollDirection("down");
                }
            } else if (diff < 0) {
                // Scrolling UP: accumulate negative delta
                if (accumulatedDelta.current > 0) {
                    accumulatedDelta.current = 0;
                }
                accumulatedDelta.current += diff;

                // Reveal header when user scrolls up intentionally (>= 6px total)
                if (accumulatedDelta.current <= -6 && currentDirectionRef.current !== "up") {
                    currentDirectionRef.current = "up";
                    setScrollDirection("up");
                }
            }

            lastScrollY.current = latest;
        });
    });

    React.useEffect(() => {
        if (menuOpen) {
            setMenuClosing(false);
        } else if (menuWasOpen.current) {
            setMenuClosing(true);
            const id = setTimeout(() => setMenuClosing(false), MENU_CLOSE_TIMEOUT_MS);
            return () => clearTimeout(id);
        }
        menuWasOpen.current = menuOpen;
    }, [menuOpen]);

    /* GAP-SCROLL-01: Stop Lenis when mega-menu or mobile menu is open */
    React.useEffect(() => {
        if (menuOpen || mobileOpen) {
            lenisStop();
        } else {
            lenisStart();
        }
    }, [menuOpen, mobileOpen, lenisStop, lenisStart]);

    const isSolid = solid || scrolled || menuOpen || headerHovered || menuClosing;
    const isHidden = scrollDirection === "down" && scrolled && !menuOpen && !mobileOpen && !menuClosing;
    const hasElevation = scrolled && !menuOpen;

    const triggerClasses = React.useMemo(() => cn(
        "header-nav-indicator relative h-full whitespace-nowrap bg-transparent px-2.5 xl:px-3.5 text-[12.5px] xl:text-[13.5px] font-medium tracking-[0.01em] transition-colors duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent",
        isSolid
            ? "header-nav-solid text-foreground/90 hover:text-foreground data-[state=open]:text-foreground"
            : "header-nav-transparent text-white/90 hover:text-white data-[state=open]:text-white"
    ), [isSolid]);

    const directLinkClasses = React.useMemo(() => cn(
        "header-nav-indicator relative inline-flex h-full items-center justify-center gap-0 p-0 px-2.5 xl:px-3.5 text-[12.5px] xl:text-[13.5px] font-medium tracking-[0.01em] whitespace-nowrap transition-colors duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-transparent focus:bg-transparent data-[active=true]:bg-transparent",
        isSolid
            ? "header-nav-solid text-foreground/90 hover:text-foreground"
            : "header-nav-transparent text-white/90 hover:text-white"
    ), [isSolid]);

    const handleMouseEnter = React.useCallback(() => setHeaderHovered(true), []);
    const handleMouseLeave = React.useCallback(() => setHeaderHovered(false), []);
    const handleValueChange = React.useCallback((value: string) => setMenuOpen(value !== ""), []);
    const handleMobileClose = React.useCallback(() => setMobileOpen(false), []);

    return (
        <>
        {/* Dark overlay behind mega-menu panels (1:1 Yucca Smooth Fade) */}
        <AnimatePresence>
            {menuOpen && (
                <motion.div
                    className="fixed inset-0 z-40 bg-foreground/50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: BACKDROP_EXIT_DURATION_S, ease: [0.25, 1, 0.5, 1] }}
                    aria-hidden="true"
                />
            )}
        </AnimatePresence>

        <header
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={cn(
                "fixed top-0 left-0 right-0 z-50 header-gpu transition-[background-color,border-color,box-shadow,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                isHidden && "header-hidden",
                menuClosing && "pointer-events-none",
                hasElevation && "shadow-warm-sm",
                isSolid
                    ? "bg-background border-b border-border-warm/60"
                    : "bg-transparent border-b border-white/10"
            )}
        >
            <div className="mx-auto flex h-[var(--header-height,80px)] w-full max-w-[1720px] items-center justify-between px-6 sm:px-10 lg:px-16 xl:px-20">
                {/* ─── Left Group: Logo + Left-Aligned Desktop Navigation ─── */}
                <div className="flex items-center gap-5 xl:gap-8 h-full">
                    {/* Logo */}
                    <Link href="/" className="group flex items-center gap-3 shrink-0 py-2 mr-1 xl:mr-2">
                        <Image
                            src="/images/logo/alfa-beauty-mark.svg"
                            alt={SITE_NAME}
                            width={34}
                            height={44}
                            className="h-8 sm:h-9 w-auto object-contain"
                            priority
                        />
                        <span
                            className={cn(
                                "text-xs sm:text-[13px] font-bold uppercase tracking-[0.2em] transition-colors duration-[400ms] ease-[var(--ease)] whitespace-nowrap",
                                isSolid ? "text-foreground" : "text-white"
                            )}
                        >
                            {SITE_SHORT_NAME}
                        </span>
                    </Link>

                    {/* Desktop Navigation Menu (Left-aligned next to Logo) */}
                    <NavigationMenu
                        className="hidden lg:flex h-[var(--header-height,80px)] items-stretch"
                        viewport={true}
                        fullWidth={true}
                        onValueChange={handleValueChange}
                        delayDuration={NAV_HOVER_DELAY_MS}
                    >
                        <NavigationMenuList className="gap-0 h-full items-stretch">
                            <NavigationMenuItem value="products">
                                <NavigationMenuTrigger hideChevron className={triggerClasses}>
                                    {dict.nav.products}
                                </NavigationMenuTrigger>
                                <NavigationMenuContent className="p-0">
                                    <ProductsPanel />
                                </NavigationMenuContent>
                            </NavigationMenuItem>

                            <NavigationMenuItem value="brands">
                                <NavigationMenuTrigger hideChevron className={triggerClasses}>
                                    {dict.nav.brands}
                                </NavigationMenuTrigger>
                                <NavigationMenuContent className="p-0">
                                    <BrandsPanel />
                                </NavigationMenuContent>
                            </NavigationMenuItem>

                            <NavigationMenuItem value="education">
                                <NavigationMenuTrigger hideChevron className={triggerClasses}>
                                    {dict.nav.education}
                                </NavigationMenuTrigger>
                                <NavigationMenuContent className="p-0">
                                    <EducationPanel />
                                </NavigationMenuContent>
                            </NavigationMenuItem>

                            <NavigationMenuItem value="partnership">
                                <NavigationMenuTrigger hideChevron className={triggerClasses}>
                                    {dict.nav.partnership}
                                </NavigationMenuTrigger>
                                <NavigationMenuContent className="p-0">
                                    <PartnershipPanel />
                                </NavigationMenuContent>
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <Link href="/about" className={directLinkClasses}>
                                        {dict.nav.about}
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <Link href="/contact" className={directLinkClasses}>
                                        {dict.nav.contact}
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>

                {/* ─── Right Group: Credit Application, Cart, ID/EN, Dual-Pane Login Dropdown, Mobile Drawer ─── */}
                <div className="flex items-center gap-3.5 xl:gap-5 shrink-0">
                    {/* Credit Application Link (Yucca style) */}
                    <Link
                        href="/partnership"
                        className={cn(
                            "hidden md:inline-flex items-center gap-1.5 text-[12px] xl:text-[12.5px] font-medium tracking-[0.02em] whitespace-nowrap transition-all duration-[350ms] ease-[var(--ease)] group",
                            isSolid
                                ? "text-foreground/75 hover:text-foreground hover:opacity-100"
                                : "text-white/80 hover:text-white hover:opacity-100"
                        )}
                    >
                        <FileText className="h-3.5 w-3.5 opacity-70 transition-transform duration-300 group-hover:scale-110" />
                        <span>{dict.nav.creditApplication}</span>
                    </Link>

                    {/* Cart Button with Count Badge (1:1 Yucca .h-cart) */}
                    <Link
                        href="/cart"
                        className={cn(
                            "relative flex h-8 w-8 items-center justify-center rounded-full border transition-colors",
                            isSolid
                                ? "border-border-warm/60 bg-background text-foreground hover:border-foreground"
                                : "border-white/20 bg-white/10 text-white hover:bg-white/20"
                        )}
                        aria-label="Shopping Cart (0 items)"
                    >
                        <ShoppingBag className="h-3.5 w-3.5" />
                        <span className="absolute -top-1 -right-1 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-brand-crimson px-1 text-[9px] font-bold text-white">
                            0
                        </span>
                    </Link>

                    {/* Language Switcher (ID / EN) */}
                    <LanguageSwitcher isSolid={isSolid} className="hidden sm:inline-flex" />

                    {/* Dual-Pane Login Dropdown (1:1 Yucca Style) */}
                    <div className="hidden sm:block">
                        <LoginDropdown />
                    </div>

                    {/* Mobile Drawer Trigger */}
                    <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className={cn(
                                    "lg:hidden transition-colors duration-[400ms] ease-[var(--ease)]",
                                    isSolid ? "text-foreground" : "text-white"
                                )}
                                aria-label="Open menu"
                            >
                                <Menu className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent
                            side="right"
                            className="w-full max-w-sm border-l border-border-warm/40 bg-background p-0 [&>button]:hidden"
                        >
                            <SheetTitle className="sr-only">Navigation menu</SheetTitle>
                            <MobileMenu onClose={handleMobileClose} />
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
        </>
    );
}

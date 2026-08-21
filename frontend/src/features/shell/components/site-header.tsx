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
import { smoothEase } from "@/shared/lib/motion";
import { useLenisControl } from "@/shared/components/providers/lenis-provider";
import { LoginDropdown } from "./login-dropdown";
import { ProductsPanel } from "./nav/products-panel";
import { BrandsPanel } from "./nav/brands-panel";
import { EducationPanel } from "./nav/education-panel";
import { PartnershipPanel } from "./nav/partnership-panel";
import { MobileMenu } from "./nav/mobile-menu";

/* SiteHeader — Fixed nav with left-aligned menu, mega-menu panels, right utility actions */

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
    const [scrollDirection, setScrollDirection] = React.useState<"up" | "down">("up");
    const rafId = React.useRef(0);

    useMotionValueEvent(scrollY, "change", (latest) => {
        cancelAnimationFrame(rafId.current);
        rafId.current = requestAnimationFrame(() => {
            setScrolled(latest > 40);
            if (Math.abs(latest - lastScrollY.current) > 12) {
                setScrollDirection(latest > lastScrollY.current ? "down" : "up");
            }
            lastScrollY.current = latest;
        });
    });

    React.useEffect(() => {
        if (menuOpen) {
            setMenuClosing(false);
        } else if (menuWasOpen.current) {
            setMenuClosing(true);
            const id = setTimeout(() => setMenuClosing(false), 500);
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

    const indicatorBar = React.useMemo(() => [
        "before:content-[''] before:absolute before:bottom-[-1px] before:left-[0.6rem] before:right-[0.6rem] xl:before:left-[0.8rem] xl:before:right-[0.8rem]",
        "before:h-[2px]",
        "before:origin-bottom before:[transform:scaleY(0)]",
        "before:transition-[transform,background-color] before:duration-[350ms] before:ease-[var(--ease)]",
        isSolid ? "before:bg-foreground" : "before:bg-white",
    ].join(" "), [isSolid]);

    const triggerClasses = React.useMemo(() => cn(
        "relative h-full whitespace-nowrap",
        "bg-transparent px-2.5 xl:px-3.5 text-[12.5px] xl:text-[13.5px] font-medium tracking-[0.01em]",
        "transition-colors duration-[350ms] ease-[var(--ease)]",
        "hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent",
        indicatorBar,
        "hover:before:[transform:scaleY(1)] data-[state=open]:before:[transform:scaleY(1)]",
        isSolid
            ? "text-foreground/90 hover:text-foreground data-[state=open]:text-foreground"
            : "text-white/90 hover:text-white data-[state=open]:text-white"
    ), [isSolid, indicatorBar]);

    const directLinkClasses = React.useMemo(() => cn(
        "relative inline-flex h-full items-center justify-center gap-0 p-0 px-2.5 xl:px-3.5 text-[12.5px] xl:text-[13.5px] font-medium tracking-[0.01em] whitespace-nowrap",
        "transition-colors duration-[350ms] ease-[var(--ease)]",
        "hover:bg-transparent focus:bg-transparent",
        "data-[active=true]:bg-transparent",
        indicatorBar,
        "hover:before:[transform:scaleY(1)]",
        isSolid ? "text-foreground/90 hover:text-foreground" : "text-white/90 hover:text-white"
    ), [isSolid, indicatorBar]);

    const handleMouseEnter = React.useCallback(() => setHeaderHovered(true), []);
    const handleMouseLeave = React.useCallback(() => setHeaderHovered(false), []);
    const handleValueChange = React.useCallback((value: string) => setMenuOpen(value !== ""), []);
    const handleMobileClose = React.useCallback(() => setMobileOpen(false), []);

    return (
        <>
        {/* Dark overlay behind mega-menu panels */}
        <AnimatePresence>
            {menuOpen && (
                <motion.div
                    className="fixed inset-0 z-40 bg-foreground/50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35, ease: smoothEase }}
                    aria-hidden="true"
                />
            )}
        </AnimatePresence>

        <header
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={cn(
                "fixed top-0 left-0 right-0 z-50",
                isHidden && "-translate-y-[102%]",
                menuClosing && "pointer-events-none",
                hasElevation && "shadow-warm-sm",
                isSolid
                    ? "bg-background border-b border-border-warm/60"
                    : "bg-transparent border-b border-white/10"
            )}
            style={{
                transition: "border-color .5s var(--ease), background-color .5s var(--ease), translate .7s var(--ease), box-shadow .5s var(--ease)",
            }}
        >
            <div className="mx-auto flex h-[var(--header-height,80px)] max-w-[1440px] items-center justify-between px-6 sm:px-8 lg:px-12">
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
                        delayDuration={120}
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
                        aria-label="Shopping Cart"
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

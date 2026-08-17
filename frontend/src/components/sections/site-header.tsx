"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Menu, MessageCircle } from "lucide-react";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { WHATSAPP_URL, SITE_NAME, SITE_SHORT_NAME } from "@/lib/config";
import { trackEvent } from "@/lib/analytics";
import { smoothEase } from "@/lib/motion";
import { useLenisControl } from "@/components/providers/lenis-provider";
import { ProductsPanel } from "./nav/products-panel";
import { BrandsPanel } from "./nav/brands-panel";
import { EducationPanel } from "./nav/education-panel";
import { PartnershipPanel } from "./nav/partnership-panel";
import { MobileMenu } from "./nav/mobile-menu";

/* SiteHeader — Fixed nav with mega-menu panels, scroll-hide, Lenis control */

export function SiteHeader(): React.JSX.Element {
    const pathname = usePathname();
    const solid = pathname !== "/";
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
        "before:content-[''] before:absolute before:bottom-[-1px] before:left-[1.6rem] before:right-[1.6rem]",
        "before:h-[0.35rem] before:rounded-t-[0.35rem]",
        "before:origin-bottom before:[transform:scaleY(0)]",
        "before:transition-[transform,background-color] before:duration-[500ms] before:ease-[var(--ease)]",
        isSolid ? "before:bg-foreground" : "before:bg-white",
    ].join(" "), [isSolid]);

    const triggerClasses = React.useMemo(() => cn(
        "relative h-full",
        "bg-transparent px-[1.6rem] text-[11px] font-semibold uppercase tracking-[0.2em]",
        "transition-colors duration-[500ms] ease-[var(--ease)]",
        "hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent",
        indicatorBar,
        "hover:before:[transform:scaleY(1)] data-[state=open]:before:[transform:scaleY(1)]",
        isSolid
            ? "text-foreground data-[state=open]:text-foreground"
            : "text-white data-[state=open]:text-white"
    ), [isSolid, indicatorBar]);

    const directLinkClasses = React.useMemo(() => cn(
        "relative inline-flex h-full items-center justify-center gap-0 p-0 px-[1.6rem] text-[11px] font-semibold uppercase tracking-[0.2em]",
        "transition-colors duration-[500ms] ease-[var(--ease)]",
        "hover:bg-transparent focus:bg-transparent",
        "data-[active=true]:bg-transparent",
        indicatorBar,
        "hover:before:[transform:scaleY(1)]",
        isSolid ? "text-foreground" : "text-white"
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
            <div className="mx-auto flex h-[var(--header-height)] max-w-[1400px] items-center justify-between px-6 sm:px-8 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:px-12">
                {/* ─── Logo ─── */}
                <Link href="/" className="group flex items-center gap-3.5 shrink-0 lg:justify-self-start">
                    <Image
                        src="/images/logo/alfa-beauty-mark.svg"
                        alt={SITE_NAME}
                        width={36}
                        height={48}
                        className="h-9 sm:h-10 w-auto object-contain transition-transform duration-[500ms] ease-[var(--ease)] group-hover:scale-108"
                        priority
                    />
                    <span
                        className={cn(
                            "text-xs sm:text-[13px] font-bold uppercase tracking-[0.25em] transition-colors duration-[500ms] ease-[var(--ease)]",
                            isSolid ? "text-foreground" : "text-white"
                        )}
                    >
                        {SITE_SHORT_NAME}
                    </span>
                </Link>

                {/* ─── Desktop Navigation ─── */}
                <NavigationMenu
                    className="hidden lg:flex justify-self-center h-[var(--header-height)] items-stretch"
                    viewport={true}
                    fullWidth={true}
                    onValueChange={handleValueChange}
                    delayDuration={120}
                >
                    <NavigationMenuList className="gap-0 h-full items-stretch">
                        <NavigationMenuItem value="products">
                            <NavigationMenuTrigger hideChevron className={triggerClasses}>
                                Products
                            </NavigationMenuTrigger>
                            <NavigationMenuContent className="p-0">
                                <ProductsPanel />
                            </NavigationMenuContent>
                        </NavigationMenuItem>

                        <NavigationMenuItem value="brands">
                            <NavigationMenuTrigger hideChevron className={triggerClasses}>
                                Brands
                            </NavigationMenuTrigger>
                            <NavigationMenuContent className="p-0">
                                <BrandsPanel />
                            </NavigationMenuContent>
                        </NavigationMenuItem>

                        <NavigationMenuItem value="education">
                            <NavigationMenuTrigger hideChevron className={triggerClasses}>
                                Education
                            </NavigationMenuTrigger>
                            <NavigationMenuContent className="p-0">
                                <EducationPanel />
                            </NavigationMenuContent>
                        </NavigationMenuItem>

                        <NavigationMenuItem value="partnership">
                            <NavigationMenuTrigger hideChevron className={triggerClasses}>
                                Partnership
                            </NavigationMenuTrigger>
                            <NavigationMenuContent className="p-0">
                                <PartnershipPanel />
                            </NavigationMenuContent>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <NavigationMenuLink asChild>
                                <Link href="/about" className={directLinkClasses}>
                                    About
                                </Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <NavigationMenuLink asChild>
                                <Link href="/contact" className={directLinkClasses}>
                                    Contact
                                </Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>

                {/* ─── Right actions ─── */}
                <div className="flex items-center gap-3 shrink-0 lg:justify-self-end">
                    <a
                        href={WHATSAPP_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Chat on WhatsApp"
                        onClick={() => trackEvent("cta_whatsapp_click", { location: "header" })}
                        className={cn(
                            "hidden items-center gap-2 px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] transition-[background-color,color,border-color] duration-[500ms] ease-[var(--ease)] lg:inline-flex focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                            isSolid
                                ? "bg-foreground text-white hover:bg-foreground/90"
                                : "bg-white/12 text-white hover:bg-white/20 backdrop-blur-sm"
                        )}
                    >
                        <MessageCircle className="h-3.5 w-3.5" />
                        WhatsApp
                    </a>

                    <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className={cn(
                                    "lg:hidden transition-colors duration-[500ms] ease-[var(--ease)]",
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

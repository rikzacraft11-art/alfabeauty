"use client";

import Image from "next/image";
import AppLink from "@/components/ui/AppLink";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { IconArrowRight } from "@/components/ui/icons";
import { getBentoGridLabels } from "@/content/homepage";

type BentoItem = {
    image: string;
    label: string;
    href: string;
    span?: "tall" | "wide" | "normal";
};

type Props = {
    items: BentoItem[];
    className?: string;
};

export default function BentoGrid({ items, className = "" }: Props) {
    const { locale } = useLocale();
    const labels = getBentoGridLabels(locale);

    // If no items provided, use default showcase items
    const gridItems: BentoItem[] = items.length > 0 ? items : [
        {
            image: "/images/hero/hero-salon.jpg",
            label: labels.professionalSalon,
            href: `/${locale}/products`,
            span: "tall",
        },
        {
            image: "/images/categories/styling.jpg",
            label: labels.styling,
            href: `/${locale}/products?category=styling`,
            span: "normal",
        },
        {
            image: "/images/categories/treatment.jpg",
            label: labels.treatment,
            href: `/${locale}/products?category=treatment`,
            span: "normal",
        },
    ];

    return (
        <div className={`grid grid-cols-2 gap-3 sm:gap-4 ${className}`}>
            {gridItems.map((item, idx) => (
                <AppLink
                    key={item.href + idx}
                    href={item.href}
                    underline="none"
                    className={`group relative overflow-hidden border border-border
                     ${item.span === "tall" ? "row-span-2" : ""}
                     ${item.span === "wide" ? "col-span-2" : ""}`}
                >
                    <div className={`relative ${item.span === "tall" ? "aspect-[3/4]" : "aspect-square"} bg-subtle`}>
                        <Image
                            src={item.image}
                            alt={item.label}
                            fill
                            sizes="(max-width: 640px) 50vw, 33vw"
                            loading={idx > 0 ? "lazy" : "eager"}
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
                        {/* Label */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                            <span className="type-body-strong text-background flex items-center gap-2">
                                {item.label}
                                <IconArrowRight className="h-4 w-4 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                            </span>
                        </div>
                    </div>
                </AppLink>
            ))}
        </div>
    );
}


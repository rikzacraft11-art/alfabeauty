"use client";

import Image from "next/image";
import AppLink from "@/components/ui/AppLink";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { IconArrowRight, IconAcademic, IconCertificate, IconUsers } from "@/components/ui/icons";
import { getEditorialSection } from "@/content/homepage";

// =============================================================================
// Types
// =============================================================================

interface TrainingCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

interface EducationShowcaseProps {
    className?: string;
}

// =============================================================================
// Sub-components
// =============================================================================

/**
 * TrainingCard - Individual training benefit card
 * Different from product cards - focused on value propositions, not products
 */
function TrainingCard({ icon, title, description }: TrainingCardProps) {
    return (
        <div className="bg-background border border-border p-6 sm:p-8 ui-radius flex flex-col h-full group hover:border-foreground/20 transition-colors">
            {/* Icon */}
            <div className="mb-4 text-foreground">
                {icon}
            </div>

            {/* Title */}
            <h3 className="type-body-strong text-foreground mb-2">
                {title}
            </h3>

            {/* Description */}
            <p className="type-body text-foreground-muted flex-1">
                {description}
            </p>
        </div>
    );
}

/**
 * StatHighlight - Key metric highlight for education value
 */
function StatHighlight({ value, label }: { value: string; label: string }) {
    return (
        <div className="text-center">
            <p className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-foreground font-mono">
                {value}
            </p>
            <p className="mt-1 type-data text-foreground-muted">
                {label}
            </p>
        </div>
    );
}

// =============================================================================
// Content Configuration
// =============================================================================

const trainingBenefits = {
    en: [
        {
            key: "technique",
            icon: <IconAcademic className="h-8 w-8" />,
            title: "Brand Techniques",
            description: "Master product-specific techniques with hands-on training from certified educators.",
        },
        {
            key: "certification",
            icon: <IconCertificate className="h-8 w-8" />,
            title: "Official Certification",
            description: "Receive recognized certifications that build client trust and salon credibility.",
        },
        {
            key: "community",
            icon: <IconUsers className="h-8 w-8" />,
            title: "Professional Network",
            description: "Connect with other professionals and stay updated on industry trends.",
        },
    ],
    id: [
        {
            key: "technique",
            icon: <IconAcademic className="h-8 w-8" />,
            title: "Teknik Brand",
            description: "Kuasai teknik spesifik produk dengan pelatihan hands-on dari educator bersertifikat.",
        },
        {
            key: "certification",
            icon: <IconCertificate className="h-8 w-8" />,
            title: "Sertifikasi Resmi",
            description: "Dapatkan sertifikasi yang diakui untuk membangun kepercayaan klien dan kredibilitas salon.",
        },
        {
            key: "community",
            icon: <IconUsers className="h-8 w-8" />,
            title: "Jaringan Profesional",
            description: "Terhubung dengan profesional lain dan tetap update dengan tren industri.",
        },
    ],
} as const;

const educationStats = {
    en: [
        { value: "40%", label: "Higher client retention" },
        { value: "500+", label: "Trained stylists" },
        { value: "15+", label: "Brand programs" },
    ],
    id: [
        { value: "40%", label: "Retensi klien lebih tinggi" },
        { value: "500+", label: "Stylist terlatih" },
        { value: "15+", label: "Program brand" },
    ],
} as const;

// =============================================================================
// Main Component
// =============================================================================

/**
 * EducationShowcase - Dedicated education section (Peak #2)
 * 
 * DIFFERENTIATED FROM PRODUCTS:
 * - Structure: Split layout (image + content) vs carousel
 * - Focus: Value propositions vs product cards
 * - Content: Benefits cards + stats vs product carousel
 * - Visual: More editorial, less catalog-like
 * 
 * This positions Education as a competitive moat, not just another product section.
 */
export default function EducationShowcase({ className = "" }: EducationShowcaseProps) {
    const { locale } = useLocale();
    const content = getEditorialSection(locale, "education");
    const benefits = trainingBenefits[locale];
    const stats = educationStats[locale];
    const baseUrl = `/${locale}`;

    return (
        <section
            className={`py-16 sm:py-20 lg:py-24 ${className}`}
            aria-labelledby="education-showcase-title"
        >
            {/* Hero Split Layout - Image + Content side by side */}
            <div className="px-4 sm:px-6 lg:px-10 max-w-[120rem] mx-auto">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    {/* Left: Editorial Image */}
                    <div className="relative aspect-[4/3] lg:aspect-[3/4] overflow-hidden ui-radius">
                        <Image
                            src="/images/education/education-hero.jpg"
                            alt={locale === "id" ? "Pelatihan profesional" : "Professional training"}
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent" />

                        {/* Badge overlay */}
                        {content.badge && (
                            <div className="absolute top-4 left-4">
                                <span className="inline-block px-4 py-2 bg-background text-foreground type-data-strong ui-radius-tight">
                                    {content.badge}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Right: Content */}
                    <div className="space-y-6 sm:space-y-8">
                        {/* Kicker */}
                        <p className="type-kicker inline-flex items-center gap-3">
                            <span className="h-px w-8 bg-foreground" aria-hidden="true" />
                            {content.kicker}
                        </p>

                        {/* Title */}
                        <h2 id="education-showcase-title" className="type-h2">
                            {content.title}
                        </h2>

                        {/* Description */}
                        <p className="type-lede max-w-lg">
                            {content.description}
                        </p>

                        {/* Stats Row */}
                        <div className="grid grid-cols-3 gap-4 py-6 border-y border-border">
                            {stats.map((stat) => (
                                <StatHighlight
                                    key={stat.label}
                                    value={stat.value}
                                    label={stat.label}
                                />
                            ))}
                        </div>

                        {/* CTA */}
                        <div className="pt-2">
                            <AppLink
                                href={`${baseUrl}/education`}
                                underline="none"
                                className="group type-ui-strong inline-flex items-center justify-center gap-2 border border-foreground bg-foreground text-background px-6 h-12 ui-radius-tight hover:bg-foreground/90 transition-colors"
                            >
                                {locale === "id" ? "Lihat Jadwal Pelatihan" : "View Training Schedule"}
                                <IconArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </AppLink>
                        </div>
                    </div>
                </div>
            </div>

            {/* Benefits Grid - Below the hero split */}
            <div className="px-4 sm:px-6 lg:px-10 max-w-[120rem] mx-auto mt-12 sm:mt-16">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {benefits.map((benefit) => (
                        <TrainingCard
                            key={benefit.key}
                            icon={benefit.icon}
                            title={benefit.title}
                            description={benefit.description}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

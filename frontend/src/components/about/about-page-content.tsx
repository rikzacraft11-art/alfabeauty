import Link from "next/link";
import Image from "next/image";
import {
    ArrowRight,
    Award,
    BookOpen,
    Globe2,
    Handshake,
    Target,
    TrendingUp,
    Users,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { WhatsAppCTA } from "@/components/ui/whatsapp-cta";
import { cn } from "@/lib/utils";
import { FadeIn } from "@/components/motion/fade-in";
import { BRANDS, SITE_NAME, SITE_SHORT_NAME, YEARS_OF_EXPERIENCE } from "@/lib/config";

/* ─────────────────────────────────────────────────────────────────────
 * COMPONENT: AboutPageContent — Company Profile
 *
 *   §1  Hero — company intro + quote
 *   §2  Stats strip
 *   §3  Journey timeline
 *   §4  Our Role — "More Than a Distributor"
 *   §5  Mission & Vision
 *   §6  Brand portfolio
 *   §7  Meet the Team
 *   §8  CTA band — "Let's Work Together"
 *
 * Polish: scroll reveals, pixel-precise tokens, Yucca-style environment
 * ───────────────────────────────────────────────────────────────────── */

/* ─── Data ─── */

const stats = [
    {
        value: YEARS_OF_EXPERIENCE,
        label: "Years of Experience",
        sub: "Serving Indonesia's salon & barber industry",
    },
    {
        value: "4",
        label: "International Brands",
        sub: "From Italy & Spain",
    },
    {
        value: "Nationwide",
        label: "Distribution Network",
        sub: "Jakarta, Surabaya, Bandung, Bali & more",
    },
];

const journeyMilestones = [
    {
        year: "2007",
        title: "Foundation",
        desc: `${SITE_NAME} was established with a vision to bring world-class professional haircare solutions to Indonesia's salon industry.`,
    },
    {
        year: "2010",
        title: "First International Partnership",
        desc: "Secured our first exclusive distribution agreement with a leading Italian professional haircare brand, marking our entry into international partnerships.",
    },
    {
        year: "2015",
        title: "National Expansion",
        desc: "Expanded distribution reach to major cities across Indonesia — Jakarta, Surabaya, Bandung, Bali, and more — building a trusted nationwide network.",
    },
    {
        year: "2020",
        title: "Education & Training Initiative",
        desc: "Launched a structured technical education program for salon and barber professionals, reinforcing our commitment to knowledge-driven industry growth.",
    },
    {
        year: "2025",
        title: "Digital Transformation",
        desc: "Launched our new digital platform to better connect with salon and barber professionals, offering streamlined access to products, education, and partnership opportunities.",
    },
];

const pillars = [
    {
        icon: Globe2,
        title: "Connecting Global Innovation",
        desc: "Bridging international principals with Indonesia's professional salon and barber market through curated brand partnerships.",
    },
    {
        icon: BookOpen,
        title: "Building Brands Through Education",
        desc: "Empowering professionals with technical knowledge and training that builds brand loyalty and elevates service quality.",
    },
    {
        icon: TrendingUp,
        title: "Sustainable Industry Growth",
        desc: "We support the long-term growth of salons, barbershops, and professionals through reliable supply chains, consistent quality, and trusted partnerships.",
    },
];

const teamMembers = [
    {
        name: "Management Team",
        role: "Leadership & Strategy",
    },
    {
        name: "Sales Team",
        role: "Distribution & Client Relations",
    },
    {
        name: "Technical Team",
        role: "Education & Training",
    },
    {
        name: "Operations Team",
        role: "Logistics & Supply Chain",
    },
];

export function AboutPageContent(): React.JSX.Element {
    return (
        <main id="main-content" className="relative z-10 min-h-screen bg-background pt-[var(--header-height)]">
            {/* ─── §1: Hero ─── */}
            <section className="bg-surface py-14 sm:py-20 lg:py-28">
                <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
                    <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
                        <div className="flex flex-col justify-center">
                            <p className="eyebrow">
                                About Us
                            </p>
                            <h1 className="mt-4 heading-display text-foreground">
                                Professional Excellence
                                <br />
                                Since Day One
                            </h1>
                        </div>

                        <div className="flex flex-col justify-center">
                            <p className="body-prose">
                                {SITE_NAME} is a
                                professional haircare distribution
                                company specializing in salon and
                                barber products and solutions. With
                                nationwide coverage and more than 18
                                years of experience, we represent
                                globally recognized professional hair
                                brands and deliver them to the
                                Indonesian market through a structured,
                                reliable, and long-term partnership
                                approach.
                            </p>
                            <p className="mt-7 text-[13px] italic leading-[1.85] text-text-muted">
                                &ldquo;We believe long-term success is
                                built on knowledge, not short-term
                                tactics.&rdquo;
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── §2: Stats Strip ─── */}
            <FadeIn>
            <section
                className="border-y border-border-warm/60 bg-background py-8 sm:py-14"
            >
                <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-6 sm:grid-cols-3 sm:px-8 lg:px-12">
                    {stats.map((stat) => (
                        <div
                            key={stat.label}
                            className="text-center lg:text-left"
                        >
                            <p className="text-[2rem] font-bold tracking-tight text-foreground lg:text-[2.5rem]">
                                {stat.value}
                            </p>
                            <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground">
                                {stat.label}
                            </p>
                            <p className="mt-1 text-[12px] text-text-muted">
                                {stat.sub}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            </FadeIn>

            {/* ─── §3: Our Journey (Timeline) ─── */}
            <FadeIn>
            <section
                className="bg-background py-14 sm:py-20 lg:py-28"
            >
                <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
                    <div className="mx-auto max-w-2xl text-center">
                        <p className="eyebrow">
                            Our Journey
                        </p>
                        <h2 className="mt-3 heading-section text-foreground">
                            The Story of {SITE_SHORT_NAME}
                        </h2>
                        <p className="mt-5 body-prose text-text-muted">
                            From a single partnership to a nationwide
                            distribution network — our journey is
                            built on trust, quality, and a deep
                            commitment to the professional haircare
                            industry.
                        </p>
                    </div>

                    {/* Timeline */}
                    <div className="relative mt-16">
                        {/* Vertical line — desktop only */}
                        <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-border-warm/60 lg:block" />

                        <div className="space-y-8 sm:space-y-12 lg:space-y-0">
                            {journeyMilestones.map(
                                (milestone, i) => {
                                    const isLeft = i % 2 === 0;
                                    return (
                                        <div
                                            key={milestone.year}
                                            className={cn(
                                                "relative lg:grid lg:grid-cols-2 lg:gap-12",
                                                i > 0 && "lg:mt-12"
                                            )}
                                        >
                                            {/* Dot on timeline — desktop */}
                                            <div className="absolute left-1/2 top-1 hidden h-3.5 w-3.5 -translate-x-1/2 bg-foreground lg:block" />

                                            {/* Content */}
                                            <div
                                                className={cn(
                                                    "lg:py-1",
                                                    isLeft
                                                        ? "lg:pr-16 lg:text-right"
                                                        : "lg:col-start-2 lg:pl-16"
                                                )}
                                            >
                                                <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-foreground/40">
                                                    {milestone.year}
                                                </p>
                                                <h3 className="mt-2 text-[15px] font-bold tracking-tight text-foreground">
                                                    {milestone.title}
                                                </h3>
                                                <p className="mt-2 text-[13px] leading-[1.85] text-charcoal">
                                                    {milestone.desc}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                }
                            )}
                        </div>
                    </div>
                </div>
            </section>
            </FadeIn>

            <Separator className="mx-auto max-w-[1400px] bg-border-warm/40" />

            {/* ─── §4: Our Role — "More Than a Distributor" ─── */}
            <FadeIn>
            <section
                className="bg-surface py-14 sm:py-20 lg:py-28"
            >
                <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
                    <div className="mx-auto max-w-2xl text-center">
                        <p className="eyebrow">
                            Our Role
                        </p>
                        <h2 className="mt-3 heading-section text-foreground">
                            More Than a Distributor
                        </h2>
                        <p className="mt-5 body-prose text-text-muted">
                            We act as a strategic bridge between
                            international principals and Indonesia&apos;s
                            professional salon and barber industry.
                        </p>
                    </div>

                    <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-3">
                        {pillars.map((pillar) => {
                            const Icon = pillar.icon;
                            return (
                                <div
                                    key={pillar.title}
                                    className="border border-border-warm/60 bg-background p-6 sm:p-8 transition-all duration-300 hover:shadow-sm lg:p-10"
                                >
                                    <div className="flex h-11 w-11 items-center justify-center bg-foreground/5">
                                        <Icon className="h-5 w-5 text-foreground/60" />
                                    </div>
                                    <h3 className="mt-6 text-[13px] font-bold uppercase tracking-[0.15em] text-foreground">
                                        {pillar.title}
                                    </h3>
                                    <p className="mt-3 text-[13px] leading-[1.85] text-text-muted">
                                        {pillar.desc}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            </FadeIn>

            {/* ─── §5: Mission & Vision ─── */}
            <FadeIn>
            <section
                className="bg-background py-14 sm:py-20 lg:py-28"
            >
                <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        {/* Mission */}
                        <div className="border border-border-warm/60 p-6 sm:p-8 transition-all duration-300 hover:shadow-sm lg:p-12">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center bg-foreground/5">
                                    <Target className="h-5 w-5 text-foreground/60" />
                                </div>
                                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground/60">
                                    Our Mission
                                </p>
                            </div>
                            <p className="mt-7 body-prose">
                                To provide Indonesia&apos;s salon and
                                barber professionals with access to
                                world-class haircare products,
                                supported by structured education and
                                reliable distribution — building a
                                stronger, more professional industry.
                            </p>
                        </div>

                        {/* Vision */}
                        <div className="border border-border-warm/60 p-6 sm:p-8 transition-all duration-300 hover:shadow-sm lg:p-12">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center bg-foreground/5">
                                    <Award className="h-5 w-5 text-foreground/60" />
                                </div>
                                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground/60">
                                    Our Vision
                                </p>
                            </div>
                            <p className="mt-7 body-prose">
                                To be Indonesia&apos;s most trusted
                                distribution partner for global
                                professional haircare brands —
                                recognized for quality, education,
                                and sustainable industry growth.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            </FadeIn>

            <Separator className="mx-auto max-w-[1400px] bg-border-warm/40" />

            {/* ─── §6: Brand Portfolio ─── */}
            <FadeIn>
            <section
                className="bg-surface py-14 sm:py-20 lg:py-28"
            >
                <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
                    <div className="text-center">
                        <p className="eyebrow">
                            Brand Portfolio
                        </p>
                        <h2 className="mt-3 heading-section text-foreground">
                            Global Professional Brands We Represent
                        </h2>
                        <p className="mx-auto mt-5 max-w-lg body-prose text-text-muted">
                            Each brand is carefully selected for its
                            innovation, quality, and relevance to the
                            professional salon and barber market.
                        </p>
                    </div>

                    <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2">
                        {BRANDS.map((brand) => (
                            <div
                                key={brand.name}
                                className="group border border-border-warm/60 bg-background transition-all duration-300 hover:shadow-sm"
                            >
                                {/* Brand logo */}
                                <div className="flex aspect-[5/2] sm:aspect-[3/1] items-center justify-center bg-surface-elevated p-6">
                                    <Image
                                        src={brand.logo}
                                        alt={`${brand.name} logo`}
                                        width={280}
                                        height={80}
                                        className="h-16 w-auto object-contain"
                                    />
                                </div>

                                <div className="p-7 lg:p-8">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-[14px] font-bold text-foreground">
                                            {brand.name}
                                        </h3>
                                        <span className="text-[11px] font-medium text-text-muted">
                                            {brand.origin} {brand.flag}
                                        </span>
                                    </div>
                                    <p className="mt-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40">
                                        {brand.category}
                                    </p>
                                    <p className="mt-4 text-[13px] leading-[1.85] text-text-muted">
                                        {brand.description}
                                    </p>

                                    <Link
                                        href={`/products?brand=${encodeURIComponent(brand.name.toLowerCase().split(" ")[0])}`}
                                        className="group/link mt-5 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-foreground transition-colors hover:text-foreground/70"
                                    >
                                        View Products
                                        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/link:translate-x-0.5" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            </FadeIn>

            {/* ─── §7: Meet the Team ─── */}
            <FadeIn>
            <section
                className="bg-background py-14 sm:py-20 lg:py-28"
            >
                <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
                    <div className="mx-auto max-w-2xl text-center">
                        <p className="eyebrow">
                            Our People
                        </p>
                        <h2 className="mt-3 heading-section text-foreground">
                            Meet the Team
                        </h2>
                        <p className="mt-5 body-prose text-text-muted">
                            Our dedicated team of professionals brings
                            together expertise in distribution, technical
                            education, sales, and industry development.
                        </p>
                    </div>

                    <div className="mt-14 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
                        {teamMembers.map((member) => (
                            <div
                                key={member.name}
                                className="border border-border-warm/60 p-7 text-center transition-all duration-300 hover:shadow-sm"
                            >
                                {/* Avatar placeholder */}
                                <div className="mx-auto flex h-20 w-20 items-center justify-center bg-surface">
                                    <Users className="h-8 w-8 text-text-muted/20" />
                                </div>
                                <h3 className="mt-5 text-[14px] font-bold text-foreground">
                                    {member.name}
                                </h3>
                                <p className="mt-1 text-[12px] text-text-muted">
                                    {member.role}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            </FadeIn>

            {/* ─── §8: CTA Band — "Let's Work Together" ─── */}
            <FadeIn>
            <section
                className="bg-foreground py-14 sm:py-20 lg:py-28"
            >
                <div className="mx-auto max-w-[1400px] px-6 text-center sm:px-8 lg:px-12">
                    <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-white/50">
                        Let&apos;s Work Together
                    </p>
                    <h2 className="mt-5 heading-section text-white">
                        With your vision and our expertise, we can
                        shape the future of professional haircare in
                        Indonesia.
                    </h2>
                    <p className="mx-auto mt-6 max-w-lg text-[14px] leading-[1.85] text-white/60">
                        {SITE_NAME} is a trusted
                        distribution partner committed to quality,
                        education, and sustainable industry growth.
                    </p>
                    <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                        <Button asChild className="group bg-background px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] text-foreground transition-all duration-300 hover:bg-white/90">
                            <Link href="/partnership">
                                <Handshake className="h-4 w-4" />
                                Become a Partner
                            </Link>
                        </Button>
                        <WhatsAppCTA
                            location="about_page"
                            className="border border-white/20 px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-all duration-300 hover:bg-white/10"
                        />
                    </div>
                </div>
            </section>
            </FadeIn>
        </main>
    );
}

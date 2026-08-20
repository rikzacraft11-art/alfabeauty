import dynamic from "next/dynamic";
import {
    ArrowRight,
    Globe2,
    Handshake,
    MessageCircle,
    Phone,
    Store,
} from "lucide-react";
import { Separator } from "@/shared/components/ui/separator";
import { WhatsAppCTA } from "@/shared/components/ui/whatsapp-cta";
const PartnershipForm = dynamic(
    () => import("@/features/partnership/components/partnership-form").then((m) => m.PartnershipForm),
    { loading: () => <div className="h-[500px] animate-pulse bg-surface" /> }
);
import { FadeIn } from "@/shared/components/motion/fade-in";
import { CONTACT_EMAIL, SITE_NAME, SITE_SHORT_NAME, YEARS_OF_EXPERIENCE } from "@/shared/lib/config";

/* ─────────────────────────────────────────────────────────────────────
 * Partnership Page — Agency-Level Polish
 *
 *   §1. Hero
 *   §2. Dual Benefits Cards
 *   §3. How It Works (3-step)
 *   §4. Become Partner Form
 *   §5. Closing Statement
 * ───────────────────────────────────────────────────────────────────── */

const benefitsPrincipal = [
    {
        title: "Strong Nationwide Distribution",
        desc: "Extensive distribution network reaching salon and barber professionals across Indonesia's major cities and regions.",
    },
    {
        title: "Deep Market Understanding",
        desc: `${YEARS_OF_EXPERIENCE} years of experience navigating Indonesia's unique salon and barber ecosystem, cultural nuances, and market dynamics.`,
    },
    {
        title: "Brand Building & Education",
        desc: "Proven capability in building professional brands through structured education programs, technical trainings, and market development.",
    },
];

const benefitsSalon = [
    {
        title: "Trusted Global Brands",
        desc: "Access to carefully selected international professional haircare brands from Italy and Spain — Alfaparf Milano, Farmavita, Montibello, and Gamma+ Professional.",
    },
    {
        title: "Consistent Quality & Support",
        desc: "Reliable product supply chain with professional technical support, product education, and after-sales service.",
    },
    {
        title: "Long-Term Partnership",
        desc: "We build partnerships based on trust, competence, and mutual growth — not short-term transactions.",
    },
];

const processSteps = [
    {
        step: "01",
        title: "Enquire",
        desc: "Fill out the partnership form below or reach out via WhatsApp. Share your business details and interests.",
        icon: Phone,
    },
    {
        step: "02",
        title: "Consultation",
        desc: "Our team will review your inquiry and schedule a consultation to understand your needs and goals.",
        icon: MessageCircle,
    },
    {
        step: "03",
        title: "Partnership",
        desc: "Begin your partnership with access to our brands, education programs, and distribution support.",
        icon: Handshake,
    },
];

export function PartnershipPageContent() {
    return (
        <main id="main-content" className="relative z-10 min-h-screen bg-background pt-[var(--header-height)]">
            {/* ─── §1: Hero ─── */}
            <section className="bg-surface py-14 sm:py-20 lg:py-28">
                <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
                    <div className="mx-auto max-w-2xl text-center">
                        <p className="eyebrow">
                            Partnership
                        </p>
                        <h1 className="mt-4 heading-display text-foreground">
                            Why Partner With Us
                        </h1>
                        <p className="mt-7 body-prose">
                            {SITE_NAME} is a trusted
                            distribution partner for global professional
                            haircare suppliers and a reliable supplier
                            for salons and barbershops across
                            Indonesia — committed to quality, education,
                            and sustainable industry growth.
                        </p>
                    </div>
                </div>
            </section>

            {/* ─── §2: Dual Benefits Cards ─── */}
            <FadeIn>
            <section
                className="bg-background py-14 sm:py-20 lg:py-28"
            >
                <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
                        {/* For International Principals */}
                        <div className="border border-border-warm/60 p-6 sm:p-8 transition-all duration-300 hover:shadow-sm lg:p-12">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center bg-foreground/5">
                                    <Globe2 className="h-5 w-5 text-foreground/50" />
                                </div>
                                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground">
                                    For International Principals
                                </p>
                            </div>

                            <h3 className="mt-7 text-[1.25rem] font-bold leading-[1.2] tracking-[-0.015em] text-foreground">
                                Expand your reach in Indonesia
                            </h3>

                            <div className="mt-8 space-y-6">
                                {benefitsPrincipal.map((b) => (
                                    <div key={b.title}>
                                        <p className="text-[14px] font-semibold text-foreground">
                                            {b.title}
                                        </p>
                                        <p className="mt-1.5 text-[13px] leading-[1.75] text-text-muted">
                                            {b.desc}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* For Professional Salons & Barbershops */}
                        <div className="border border-border-warm/60 p-6 sm:p-8 transition-all duration-300 hover:shadow-sm lg:p-12">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center bg-foreground/5">
                                    <Store className="h-5 w-5 text-foreground/50" />
                                </div>
                                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground">
                                    For Professional Salons &amp;
                                    Barbershops
                                </p>
                            </div>

                            <h3 className="mt-7 text-[1.25rem] font-bold leading-[1.2] tracking-[-0.015em] text-foreground">
                                Elevate your service quality
                            </h3>

                            <div className="mt-8 space-y-6">
                                {benefitsSalon.map((b) => (
                                    <div key={b.title}>
                                        <p className="text-[14px] font-semibold text-foreground">
                                            {b.title}
                                        </p>
                                        <p className="mt-1.5 text-[13px] leading-[1.75] text-text-muted">
                                            {b.desc}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            </FadeIn>

            <Separator className="mx-auto max-w-[1400px] bg-border-warm/40" />

            {/* ─── §3: How It Works ─── */}
            <FadeIn>
            <section
                className="bg-background py-14 sm:py-20 lg:py-28"
            >
                <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
                    <div className="text-center">
                        <p className="eyebrow">
                            Process
                        </p>
                        <h2 className="mt-3 heading-section text-foreground">
                            How It Works
                        </h2>
                    </div>

                    <div className="mt-10 sm:mt-14 grid grid-cols-1 gap-6 sm:gap-8 sm:grid-cols-3">
                        {processSteps.map((step) => {
                            const Icon = step.icon;
                            return (
                                <div
                                    key={step.step}
                                    className="text-center"
                                >
                                    <div className="mx-auto flex h-14 w-14 items-center justify-center border border-border-warm/60">
                                        <Icon className="h-6 w-6 text-foreground/40" />
                                    </div>
                                    <p className="mt-5 text-[2rem] font-bold text-foreground/10">
                                        {step.step}
                                    </p>
                                    <h3 className="mt-2 text-[12px] font-bold uppercase tracking-[0.2em] text-foreground">
                                        {step.title}
                                    </h3>
                                    <p className="mt-3 text-[13px] leading-[1.75] text-text-muted">
                                        {step.desc}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
            </FadeIn>

            {/* ─── §4: Become Partner Form ─── */}
            <FadeIn>
            <section
                id="become-partner"
                className="bg-surface py-14 sm:py-20 lg:py-28"
            >
                <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
                    <div className="grid grid-cols-1 gap-8 sm:gap-12 lg:grid-cols-[1fr_1.5fr] lg:gap-20">
                        {/* Left: intro */}
                        <div>
                            <p className="eyebrow">
                                Become a Partner
                            </p>
                            <h2 className="mt-3 heading-section text-foreground">
                                Start Your Partnership Journey
                            </h2>
                            <p className="mt-5 body-prose">
                                Fill out the form and our team will
                                reach out to discuss how we can
                                support your business. All fields
                                marked with * are required.
                            </p>

                            <Separator className="my-8 bg-border-warm/40" />

                            <div className="space-y-4">
                                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground">
                                    Prefer to talk directly?
                                </p>
                                <WhatsAppCTA
                                    location="partnership_sidebar"
                                    message={`Hi, saya tertarik untuk bermitra dengan ${SITE_SHORT_NAME}.`}
                                    variant="ghost"
                                    className="inline-flex items-center gap-2 px-0 text-[13px] font-semibold text-foreground transition-colors hover:bg-transparent hover:text-foreground/70"
                                >
                                    Chat via WhatsApp
                                    <ArrowRight className="h-3.5 w-3.5" />
                                </WhatsAppCTA>

                                <p className="text-[12px] text-text-muted">
                                    or email us at{" "}
                                    <a
                                        href={`mailto:${CONTACT_EMAIL}`}
                                        className="text-foreground underline underline-offset-4"
                                    >
                                        {CONTACT_EMAIL}
                                    </a>
                                </p>
                            </div>
                        </div>

                        {/* Right: form */}
                        <div className="border border-border-warm/60 bg-background p-5 sm:p-8 lg:p-12">
                            <PartnershipForm />
                        </div>
                    </div>
                </div>
            </section>
            </FadeIn>

            {/* ─── §5: Closing Statement ─── */}
            <FadeIn>
            <section
                className="bg-foreground py-14 sm:py-20 lg:py-28"
            >
                <div className="mx-auto max-w-[1400px] px-6 text-center sm:px-8 lg:px-12">
                    <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-white/50">
                        Our Commitment
                    </p>
                    <p className="mx-auto mt-8 max-w-2xl text-[16px] leading-[1.85] text-white/70 italic lg:text-[18px]">
                        &ldquo;{SITE_NAME} is a trusted
                        distribution partner for global professional
                        haircare suppliers and a reliable supplier for
                        salons and barbershops across
                        Indonesia — committed to quality, education, and
                        sustainable industry growth.&rdquo;
                    </p>
                </div>
            </section>
            </FadeIn>
        </main>
    );
}

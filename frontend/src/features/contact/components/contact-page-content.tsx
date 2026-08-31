"use client";

import dynamic from "next/dynamic";
import {
    Clock,
    Mail,
    MapPin,
    MessageCircle,
    Phone,
} from "lucide-react";
import { Separator } from "@/shared/components/ui/separator";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/shared/components/ui/accordion";
const ContactForm = dynamic(
    () => import("@/features/contact/components/contact-form").then((m) => m.ContactForm),
    { loading: () => <div className="h-[400px] animate-pulse bg-surface" /> }
);
import { WhatsAppCTA } from "@/shared/components/ui/whatsapp-cta";
import { FadeIn } from "@/shared/components/motion/fade-in";
import { WHATSAPP_DISPLAY, CONTACT_EMAIL, OPERATING_HOURS, SITE_ADDRESS } from "@/shared/lib/config";
import { useLanguage } from "@/shared/components/providers/language-provider";

/* ─────────────────────────────────────────────────────────────────────
 * Contact Page — Fully Bilingual (ID / EN)
 * ───────────────────────────────────────────────────────────────────── */

export function ContactPageContent() {
    const { dict, language } = useLanguage();
    const isId = language === "id";

    const faqs = isId
        ? [
              {
                  q: "Brand apa saja yang didistribusikan secara resmi oleh Alfa Beauty?",
                  a: "PT Alfa Beauty Cosmetica merupakan importir dan distributor eksklusif untuk brand internasional terkemuka seperti Alfaparf Milano Professional, Farmavita, Montibello, CORE Japan, dan Gamma+ Professional.",
              },
              {
                  q: "Apakah Alfa Beauty melayani pengiriman ke luar pulau Jawa?",
                  a: "Ya. Kami memiliki jaringan distribusi resmi yang menjangkau seluruh 34 provinsi di Indonesia termasuk Jakarta, Surabaya, Bandung, Bali, Medan, Makassar, dan kota-kota lainnya.",
              },
              {
                  q: "Bagaimana cara mendaftar menjadi mitra salon resmi?",
                  a: "Kunjungi halaman Kemitraan dan isi formulir pendaftaran mitra, atau hubungi tim kami via WhatsApp. Tim representatif kami akan menghubungi Anda dalam waktu 1-2 hari kerja.",
              },
              {
                  q: "Apakah tersedia program pelatihan teknis untuk staf salon?",
                  a: "Tentu. Melalui Alfa Beauty Academy, kami menyelenggarakan workshop dan masterclass rutin seputar teknik pewarnaan lanjutan, perm modern, pemotongan rambut, dan manajemen bisnis salon.",
              },
              {
                  q: "Berapa batas minimum pemesanan (MOQ) untuk salon?",
                  a: "Ketentuan minimum pemesanan bervariasi sesuai lini brand dan kategori produk. Silakan hubungi tim sales kami untuk mendapatkan penawaran dan daftar harga khusus B2B salon.",
              },
              {
                  q: "Apakah kami bisa mendapatkan demo produk atau tester?",
                  a: "Kami dapat mengatur demonstrasi produk dan tester khusus bagi pemilik salon atau profesional yang memenuhi kualifikasi. Hubungi tim kami via WhatsApp untuk berdiskusi lebih lanjut.",
              },
          ]
        : [
              {
                  q: "What brands do you distribute?",
                  a: "We are the official Indonesian distributor for leading professional haircare brands: Alfaparf Milano (Italy), Farmavita (Italy), Montibello (Spain), and Gamma+ Professional (Italy).",
              },
              {
                  q: "Do you supply nationwide?",
                  a: "Yes. We have an established distribution network covering major cities across Indonesia including Jakarta, Surabaya, Bandung, Bali, Medan, and many more.",
              },
              {
                  q: "How do I become a partner?",
                  a: "Visit our Partnership page and fill out the Become Partner form. Our team will review your application and reach out within 2 business days.",
              },
              {
                  q: "Do you offer training for salon professionals?",
                  a: "Absolutely. We run regular technical trainings, workshops, and masterclasses covering color techniques, hair treatments, barbering, and business skills.",
              },
              {
                  q: "What is the minimum order requirement?",
                  a: "Minimum order quantities vary by brand and product line. Contact our sales team for specific details and pricing tailored to your salon's needs.",
              },
              {
                  q: "Do you offer product samples?",
                  a: "We can arrange product demonstrations and samples for qualified salon and barbershop professionals. Reach out to our team via WhatsApp.",
              },
          ];

    return (
        <main id="main-content" className="relative z-10 min-h-screen bg-background pt-[var(--header-height)]">
            {/* ─── §1: Hero ─── */}
            <section className="bg-surface py-14 sm:py-20 lg:py-28">
                <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
                    <div className="mx-auto max-w-2xl text-center">
                        <p className="eyebrow">
                            {dict.contactPage.eyebrow}
                        </p>
                        <h1 className="mt-4 heading-display text-foreground">
                            {dict.contactPage.title}
                        </h1>
                        <p className="mt-7 body-prose">
                            {dict.contactPage.description}
                        </p>
                    </div>
                </div>
            </section>

            {/* ─── §2: Form + Meet Us ─── */}
            <FadeIn>
            <section className="bg-background py-14 sm:py-20 lg:py-28">
                <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
                    <div className="grid grid-cols-1 gap-8 sm:gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-20">
                        {/* Left: Contact Form */}
                        <div className="order-2 lg:order-1">
                            <p className="eyebrow text-text-muted">
                                {dict.contactPage.formEyebrow}
                            </p>
                            <h2 className="mt-3 heading-section text-foreground">
                                {dict.contactPage.formTitle}
                            </h2>
                            <p className="mt-4 text-[13px] leading-[1.85] text-text-muted">
                                {dict.contactPage.formDescription}
                            </p>

                            <div className="mt-8 border border-border-warm/60 bg-background p-5 sm:p-8 lg:p-10">
                                <ContactForm />
                            </div>
                        </div>

                        {/* Right: Meet Us Info Cards */}
                        <div className="order-1 lg:order-2">
                            <p className="eyebrow text-text-muted">
                                {dict.contactPage.infoEyebrow}
                            </p>
                            <h2 className="mt-3 heading-section text-foreground">
                                {dict.contactPage.infoTitle}
                            </h2>

                            <div className="mt-8 space-y-5">
                                {/* Address Card */}
                                <div className="border border-border-warm/60 p-6 transition-all duration-300 hover:shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-foreground/5">
                                            <MapPin className="h-5 w-5 text-foreground/50" />
                                        </div>
                                        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground">
                                            {isId ? "Alamat Kantor" : "Our Address"}
                                        </p>
                                    </div>
                                    <p className="mt-4 body-prose">
                                        {SITE_ADDRESS}
                                    </p>
                                </div>

                                {/* Phone & Email Card */}
                                <div className="border border-border-warm/60 p-6 transition-all duration-300 hover:shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-foreground/5">
                                            <Phone className="h-5 w-5 text-foreground/50" />
                                        </div>
                                        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground">
                                            WhatsApp &amp; Email
                                        </p>
                                    </div>
                                    <div className="mt-4 space-y-3">
                                        <WhatsAppCTA
                                            location="contact_phone"
                                            variant="ghost"
                                            className="flex items-center gap-2 p-0 h-auto text-[14px] font-semibold text-foreground transition-colors duration-300 hover:text-foreground/70 hover:bg-transparent"
                                        >
                                            <MessageCircle className="h-4 w-4" />
                                            {WHATSAPP_DISPLAY}
                                        </WhatsAppCTA>
                                        <a
                                            href={`mailto:${CONTACT_EMAIL}`}
                                            className="flex items-center gap-2 text-[14px] text-charcoal transition-colors hover:text-foreground"
                                        >
                                            <Mail className="h-4 w-4 text-text-muted" />
                                            {CONTACT_EMAIL}
                                        </a>
                                    </div>
                                </div>

                                {/* Operating Times Card */}
                                <div className="border border-border-warm/60 p-6 transition-all duration-300 hover:shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-foreground/5">
                                            <Clock className="h-5 w-5 text-foreground/50" />
                                        </div>
                                        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground">
                                            {isId ? "Jam Operasional" : "Operating Hours"}
                                        </p>
                                    </div>
                                    <div className="mt-4 space-y-2.5">
                                        <div className="flex items-center justify-between text-[13px]">
                                            <span className="text-charcoal">
                                                {isId ? dict.footer.days : OPERATING_HOURS.days}
                                            </span>
                                            <span className="font-semibold text-foreground">
                                                {isId ? dict.footer.hours : OPERATING_HOURS.hours}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-[13px]">
                                            <span className="text-text-muted">
                                                {isId ? dict.footer.note : OPERATING_HOURS.note}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick WhatsApp */}
                                <WhatsAppCTA
                                    location="contact_chat"
                                    className="flex w-full items-center justify-center gap-2.5 bg-foreground px-6 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-all duration-300 hover:bg-foreground/90"
                                >
                                    <MessageCircle className="h-4 w-4" />
                                    {isId ? "Konsultasi via WhatsApp" : "Chat on WhatsApp"}
                                </WhatsAppCTA>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            </FadeIn>

            <Separator className="mx-auto max-w-[1400px] bg-border-warm/40" />

            {/* ─── §3: FAQ ─── */}
            <FadeIn>
            <section className="bg-surface py-14 sm:py-20 lg:py-28">
                <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
                    <div className="grid grid-cols-1 gap-8 sm:gap-12 lg:grid-cols-[1fr_1.5fr] lg:gap-20">
                        {/* Left: heading */}
                        <div>
                            <p className="eyebrow text-text-muted">
                                {dict.contactPage.faqEyebrow}
                            </p>
                            <h2 className="mt-3 heading-section text-foreground">
                                {dict.contactPage.faqTitle}
                            </h2>
                            <p className="mt-5 body-prose text-text-muted">
                                {isId
                                    ? "Tidak menemukan jawaban yang Anda cari? Hubungi tim kami langsung via WhatsApp atau formulir kontak."
                                    : "Can't find what you're looking for? Reach out to our team directly via WhatsApp or the contact form above."}
                            </p>
                        </div>

                        {/* Right: accordion */}
                        <Accordion
                            type="single"
                            collapsible
                            className="w-full"
                        >
                            {faqs.map((faq, i) => (
                                <AccordionItem
                                    key={faq.q}
                                    value={`faq-${i}`}
                                    className="border-b border-border-warm/60"
                                >
                                    <AccordionTrigger className="py-5 text-[14px] font-semibold text-foreground hover:no-underline">
                                        {faq.q}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-[14px] leading-[1.85] text-charcoal">
                                        {faq.a}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </div>
            </section>
            </FadeIn>
        </main>
    );
}

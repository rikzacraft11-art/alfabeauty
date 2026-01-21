"use client";

import { t } from "@/lib/i18n";
import { useLocale } from "@/components/i18n/LocaleProvider";
import WhatsAppLink from "@/components/site/WhatsAppLink";
import ButtonLink from "@/components/ui/ButtonLink";
import { getButtonClassName } from "@/components/ui/Button";
import { IconWhatsApp } from "@/components/ui/icons";

interface ProductCTAProps {
    productName: string;
    variant?: "inline" | "block";
    className?: string;
}

export default function ProductCTA({
    productName,
    variant = "inline",
    className = ""
}: ProductCTAProps) {
    const { locale } = useLocale();
    const tx = t(locale);
    const base = `/${locale}`;

    // Custom prefill message for this product
    const prefill = tx.productDetail.consult.prefill.replace("{{product}}", productName);

    if (variant === "block") {
        // Large full-width block (bottom of page)
        return (
            <section className={`border-t border-border pt-8 lg:pt-12 ${className}`}>
                <div className="ui-section-dark p-6 lg:p-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div className="space-y-2">
                        <h3 className="type-h3">{tx.productDetail.consult.title}</h3>
                        <p className="type-body opacity-80 max-w-lg">
                            {tx.productDetail.consult.body}
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                        <WhatsAppLink
                            className={getButtonClassName({ variant: "inverted", size: "lg" }) + " gap-2"}
                            prefill={prefill}
                        >
                            <IconWhatsApp className="h-5 w-5" />
                            {tx.cta.whatsappConsult}
                        </WhatsAppLink>
                    </div>
                </div>
            </section>
        );
    }

    // Default: Inline (next to product info)
    return (
        <div className={`pt-4 space-y-4 border-t border-border ${className}`}>
            <div className="flex flex-col sm:flex-row gap-3">
                <WhatsAppLink
                    className={getButtonClassName({ variant: "primary", size: "lg" }) + " flex-1 sm:flex-none"}
                    prefill={prefill}
                >
                    {tx.cta.whatsappConsult}
                </WhatsAppLink>
                <ButtonLink
                    href={`${base}/partnership/become-partner`}
                    variant="secondary"
                    size="lg"
                    className="flex-1 sm:flex-none"
                >
                    {tx.cta.becomePartner}
                </ButtonLink>
            </div>
            <p className="type-data text-muted">
                {tx.productDetail.consult.body}
            </p>
        </div>
    );
}

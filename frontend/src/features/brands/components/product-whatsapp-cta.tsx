import { WhatsAppCTA } from "@/shared/components/ui/whatsapp-cta";

/* ─────────────────────────────────────────────────────────────────────
 * ProductWhatsAppCTA — Client sub-component for analytics tracking
 *
 * Thin wrapper around <WhatsAppCTA> that provides product-specific
 * messaging and passes productName for GA4 event metadata.
 * ───────────────────────────────────────────────────────────────────── */

export function ProductWhatsAppCTA({
    productName,
    brandName,
}: {
    productName: string;
    brandName: string;
}): React.JSX.Element {
    return (
        <WhatsAppCTA
            location="product_detail"
            productName={productName}
            message={`Saya tertarik dengan produk ${productName} dari ${brandName}`}
            className="inline-flex w-full items-center justify-center gap-3 bg-foreground px-8 py-4 text-[12px] font-bold uppercase tracking-[0.2em] text-white transition-all hover:bg-foreground/90 sm:w-auto"
        >
            Inquire about this product
        </WhatsAppCTA>
    );
}

"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Package,
  Search,
  FileText,
  ArrowRight,
  ExternalLink,
  MessageSquare,
  Sparkles,
  Building2,
  User,
  ShoppingBag,
  HelpCircle,
  AlertCircle,
  BookOpen,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { SITE_NAME, SITE_SHORT_NAME, WHATSAPP_NUMBER } from "@/shared/lib/config";
import { cn } from "@/shared/lib/utils";

type AccountTab = "orders" | "partnership" | "resources";

interface StoredOrder {
  token: string;
  orderNumber?: string;
  date: string;
  total?: string;
  status?: string;
}

const LOCAL_STORAGE_ORDERS_KEY = "alfa_recent_orders";

export function AccountDashboard(): React.JSX.Element {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState<AccountTab>("orders");
  const [orderInput, setOrderInput] = React.useState("");
  const [lookupError, setLookupError] = React.useState("");
  const [recentOrders, setRecentOrders] = React.useState<StoredOrder[]>([]);

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_ORDERS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as StoredOrder[];
        if (Array.isArray(parsed)) {
          setRecentOrders(parsed);
        }
      }
    } catch {
      // Graceful fallback on storage access error
    }
  }, []);

  const handleOrderLookup = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const cleanToken = orderInput.trim();
    if (!cleanToken) {
      setLookupError("Silakan masukkan token pesanan atau nomor pesanan Anda.");
      return;
    }
    setLookupError("");

    // Order token lookup routes directly to /order/[token]
    router.push(`/order/${encodeURIComponent(cleanToken)}`);
  };

  const whatsappSupportUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Halo Layanan Pelanggan ${SITE_NAME}, saya butuh bantuan terkait akun dan pesanan saya.`
  )}`;

  return (
    <div className="container mx-auto px-4 py-12 sm:py-16 max-w-6xl">
      {/* ─── Profile Overview Card ─── */}
      <div className="bg-surface-elevated border border-border-warm p-6 sm:p-8 rounded-none mb-10 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-brand-crimson/10 border border-brand-crimson/30 flex items-center justify-center shrink-0">
              <User className="h-7 w-7 text-brand-crimson" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-h2 font-bold text-foreground tracking-tight">
                  Akun Pelanggan & Mitra
                </h1>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-brand-crimson/10 text-brand-crimson border border-brand-crimson/20">
                  <Sparkles className="h-3 w-3" />
                  Mode Konsumen & Mitra
                </span>
              </div>
              <p className="text-caption text-muted-foreground">
                Akses pelacakan pesanan ritel, status pendaftaran mitra salon, dan panduan SOP resmi {SITE_SHORT_NAME}.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button asChild variant="outline" size="sm" className="border-border-warm text-caption font-semibold">
              <Link href="/partnership">
                <Building2 className="mr-1.5 h-3.5 w-3.5 text-brand-crimson" />
                Daftar Mitra Salon
              </Link>
            </Button>
            <Button asChild size="sm" className="bg-foreground text-white hover:bg-foreground/90 text-caption font-semibold">
              <Link href="/shop">
                <ShoppingBag className="mr-1.5 h-3.5 w-3.5" />
                Katalog Produk
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* ─── Navigation Tabs ─── */}
      <div className="flex border-b border-border-warm mb-8 overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab("orders")}
          className={cn(
            "flex items-center gap-2 px-5 py-3 text-body font-semibold border-b-2 transition-all shrink-0 cursor-pointer",
            activeTab === "orders"
              ? "border-brand-crimson text-brand-crimson"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <Package className="h-4 w-4" />
          Pesanan Saya
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("partnership")}
          className={cn(
            "flex items-center gap-2 px-5 py-3 text-body font-semibold border-b-2 transition-all shrink-0 cursor-pointer",
            activeTab === "partnership"
              ? "border-brand-crimson text-brand-crimson"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <Building2 className="h-4 w-4" />
          Status Kemitraan Salon
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("resources")}
          className={cn(
            "flex items-center gap-2 px-5 py-3 text-body font-semibold border-b-2 transition-all shrink-0 cursor-pointer",
            activeTab === "resources"
              ? "border-brand-crimson text-brand-crimson"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <BookOpen className="h-4 w-4" />
          SOP & Resources Mitra
        </button>
      </div>

      {/* ─── Tab Content 1: Orders Tracker ─── */}
      {activeTab === "orders" && (
        <div className="space-y-8 animate-in fade-in-50 duration-300">
          <div className="bg-background border border-border-warm p-6 sm:p-8">
            <h2 className="text-h3 font-bold text-foreground mb-2 flex items-center gap-2">
              <Search className="h-5 w-5 text-brand-crimson" />
              Lacak Pesanan Mandiri
            </h2>
            <p className="text-body text-muted-foreground mb-6 max-w-2xl">
              Setiap pesanan di {SITE_SHORT_NAME} dilengkapi token keamanan privat. Masukkan token pesanan Anda yang tercantum pada email konfirmasi atau tautan checkout.
            </p>

            <form onSubmit={handleOrderLookup} className="flex flex-col sm:flex-row gap-3 max-w-xl">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={orderInput}
                  onChange={(e) => {
                    setOrderInput(e.target.value);
                    if (lookupError) setLookupError("");
                  }}
                  placeholder="Contoh token pesanan (order token)..."
                  className={cn(
                    "w-full h-11 border bg-background px-3.5 text-sm outline-none transition-colors placeholder:text-muted-foreground/60",
                    lookupError ? "border-brand-crimson" : "border-border-warm focus:border-foreground"
                  )}
                />
              </div>
              <Button type="submit" className="h-11 px-6 bg-foreground text-white hover:bg-foreground/90 text-sm font-semibold cursor-pointer">
                Lacak Status
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>

            {lookupError && (
              <p className="mt-2 text-caption text-brand-crimson flex items-center gap-1.5" role="alert">
                <AlertCircle className="h-3.5 w-3.5" />
                {lookupError}
              </p>
            )}
          </div>

          {/* Recent Orders Listing */}
          <div>
            <h3 className="text-subtitle font-bold text-foreground mb-4">
              Riwayat Pesanan di Perangkat Ini
            </h3>

            {recentOrders.length > 0 ? (
              <div className="divide-y divide-border-warm border border-border-warm bg-background">
                {recentOrders.map((ord) => (
                  <div key={ord.token} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">
                          {ord.orderNumber ? `Pesanan #${ord.orderNumber}` : "Pesanan Terbaru"}
                        </span>
                        {ord.status && (
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200">
                            {ord.status}
                          </span>
                        )}
                      </div>
                      <p className="text-caption text-muted-foreground mt-1">
                        Dibuat: {ord.date} {ord.total ? `• Total: ${ord.total}` : ""}
                      </p>
                    </div>
                    <Button asChild variant="outline" size="sm" className="border-border-warm text-caption font-semibold">
                      <Link href={`/order/${encodeURIComponent(ord.token)}`}>
                        Lihat Status & Rincian
                        <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border border-dashed border-border-warm p-8 text-center bg-surface-subtle/50">
                <Package className="mx-auto h-8 w-8 text-muted-foreground/60 mb-3" />
                <p className="text-body font-semibold text-foreground">Belum ada pesanan tersimpan di browser ini</p>
                <p className="text-caption text-muted-foreground mt-1 max-w-md mx-auto">
                  Pesanan yang Anda buat melalui checkout akan muncul di sini. Anda juga dapat menggunakan kolom pencarian token di atas kapan saja.
                </p>
                <Button asChild variant="outline" size="sm" className="mt-4 border-border-warm text-caption font-semibold">
                  <Link href="/shop">Mulai Belanja Produk</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── Tab Content 2: Partnership Status ─── */}
      {activeTab === "partnership" && (
        <div className="space-y-8 animate-in fade-in-50 duration-300">
          <div className="bg-background border border-border-warm p-6 sm:p-8">
            <h2 className="text-h3 font-bold text-foreground mb-2 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-brand-crimson" />
              Verifikasi Kemitraan Salon & Barber
            </h2>
            <p className="text-body text-muted-foreground mb-6 max-w-3xl">
              Program kemitraan resmi {SITE_NAME} memberikan akses eksklusif ke daftar harga net salon, fasilitas tempo pembayaran, dan penawaran paket kemitraan perdana untuk salon baru.
            </p>

            <div className="grid gap-6 md:grid-cols-3 mb-8">
              <div className="border border-border-warm p-5 bg-surface-elevated">
                <div className="h-8 w-8 rounded-full bg-brand-crimson/10 text-brand-crimson flex items-center justify-center font-bold text-sm mb-3">
                  1
                </div>
                <h4 className="font-semibold text-foreground text-sm mb-1">Pengajuan Dokumen</h4>
                <p className="text-caption text-muted-foreground">
                  Unggah identitas KTP dan foto fisik salon/barbershop melalui formulir kemitraan.
                </p>
              </div>

              <div className="border border-border-warm p-5 bg-surface-elevated">
                <div className="h-8 w-8 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold text-sm mb-3">
                  2
                </div>
                <h4 className="font-semibold text-foreground text-sm mb-1">Review Tim Kemitraan</h4>
                <p className="text-caption text-muted-foreground">
                  Verifikasi alamat dan legalitas tempat usaha oleh tim kemitraan kami pada hari kerja.
                </p>
              </div>

              <div className="border border-border-warm p-5 bg-surface-elevated">
                <div className="h-8 w-8 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-sm mb-3">
                  3
                </div>
                <h4 className="font-semibold text-foreground text-sm mb-1">Aktivasi Akun Mitra</h4>
                <p className="text-caption text-muted-foreground">
                  Akses harga net distributor, katalog lengkap, dan dukungan teknis edukator.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-border-warm">
              <Button asChild size="lg" className="bg-foreground text-white hover:bg-foreground/90 font-bold text-cta">
                <Link href="/partnership">
                  Ajukan Pendaftaran Salon Baru
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-border-warm font-semibold text-cta">
                <a href={whatsappSupportUrl} target="_blank" rel="noopener noreferrer">
                  <MessageSquare className="mr-2 h-4 w-4 text-emerald-600" />
                  Cek Status Pengajuan via WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Tab Content 3: Technical SOP Resources Hub ─── */}
      {activeTab === "resources" && (
        <div className="space-y-6 animate-in fade-in-50 duration-300">
          <div className="bg-background border border-border-warm p-6 sm:p-8">
            <h2 className="text-h3 font-bold text-foreground mb-2 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-brand-crimson" />
              Resources Hub & SOP Teknis Salon
            </h2>
            <p className="text-body text-muted-foreground mb-6 max-w-3xl">
              Panduan teknis dan bagan warna resmi dari brand prinsipal kami (Farmavita, Gamma+, Kerastase, dsb) untuk menunjang standar kerja profesional stylist salon Anda.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="border border-border-warm p-5 hover:border-foreground/40 transition-colors bg-surface-elevated">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-brand-crimson">SOP Kimia & Pewarnaan</span>
                    <h4 className="font-bold text-foreground text-base mt-1">Farmavita Suprema Color Chart & Mixing Guide</h4>
                    <p className="text-caption text-muted-foreground mt-1.5">
                      Tabel perbandingan developer (10, 20, 30, 40 Vol) dan rasio formulasi untuk uban 100%.
                    </p>
                  </div>
                  <FileText className="h-5 w-5 text-muted-foreground shrink-0 mt-1" />
                </div>
                <div className="mt-4 pt-3 border-t border-border-warm flex items-center justify-between text-caption">
                  <span className="text-muted-foreground">Format Digital</span>
                  <Link href="/education/articles" className="font-semibold text-foreground hover:underline inline-flex items-center gap-1">
                    Baca Panduan
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>

              <div className="border border-border-warm p-5 hover:border-foreground/40 transition-colors bg-surface-elevated">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-brand-crimson">SOP Bleaching</span>
                    <h4 className="font-bold text-foreground text-base mt-1">Protokol Bleaching Level 9+ Bebas Kerusakan</h4>
                    <p className="text-caption text-muted-foreground mt-1.5">
                      Tahapan lift bertahap, proteksi kutikula, dan netralisasi undertone kuning/oranye.
                    </p>
                  </div>
                  <FileText className="h-5 w-5 text-muted-foreground shrink-0 mt-1" />
                </div>
                <div className="mt-4 pt-3 border-t border-border-warm flex items-center justify-between text-caption">
                  <span className="text-muted-foreground">Format Digital</span>
                  <Link href="/education/articles" className="font-semibold text-foreground hover:underline inline-flex items-center gap-1">
                    Baca Panduan
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>

              <div className="border border-border-warm p-5 hover:border-foreground/40 transition-colors bg-surface-elevated">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-brand-crimson">SOP Rebonding</span>
                    <h4 className="font-bold text-foreground text-base mt-1">Masterclass Smoothing & Keratin Treatment</h4>
                    <p className="text-caption text-muted-foreground mt-1.5">
                      Diagnosa elastisitas rambut dan penentuan temperatur flat iron yang tepat.
                    </p>
                  </div>
                  <FileText className="h-5 w-5 text-muted-foreground shrink-0 mt-1" />
                </div>
                <div className="mt-4 pt-3 border-t border-border-warm flex items-center justify-between text-caption">
                  <span className="text-muted-foreground">Format Digital</span>
                  <Link href="/education/articles" className="font-semibold text-foreground hover:underline inline-flex items-center gap-1">
                    Baca Panduan
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>

              <div className="border border-border-warm p-5 hover:border-foreground/40 transition-colors bg-surface-elevated">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-brand-crimson">Barber Tools Care</span>
                    <h4 className="font-bold text-foreground text-base mt-1">Panduan Kalibrasi & Perawatan Clipper Gamma+</h4>
                    <p className="text-caption text-muted-foreground mt-1.5">
                      Sanitasi bilah blade, pelumasan magnetik motor, dan penggantian spare part orisinal.
                    </p>
                  </div>
                  <FileText className="h-5 w-5 text-muted-foreground shrink-0 mt-1" />
                </div>
                <div className="mt-4 pt-3 border-t border-border-warm flex items-center justify-between text-caption">
                  <span className="text-muted-foreground">Format Digital</span>
                  <Link href="/education/articles" className="font-semibold text-foreground hover:underline inline-flex items-center gap-1">
                    Baca Panduan
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Support Footer Callout ─── */}
      <div className="mt-12 p-6 border border-border-warm bg-surface-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <HelpCircle className="h-6 w-6 text-brand-crimson shrink-0" />
          <div>
            <p className="text-body font-semibold text-foreground">Butuh bantuan khusus terkait akun atau pesanan Anda?</p>
            <p className="text-caption text-muted-foreground">Customer support kami siap membantu operasional salon Anda pada hari kerja.</p>
          </div>
        </div>
        <Button asChild variant="outline" className="border-border-warm text-caption font-semibold shrink-0">
          <a href={whatsappSupportUrl} target="_blank" rel="noopener noreferrer">
            <MessageSquare className="mr-2 h-4 w-4 text-emerald-600" />
            Chat WhatsApp CS
          </a>
        </Button>
      </div>
    </div>
  );
}

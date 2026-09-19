"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { fieldClass } from "@/shared/components/ui/form-field";
import { SITE_SHORT_NAME, WHATSAPP_NUMBER } from "@/shared/lib/config";
import { cn } from "@/shared/lib/utils";
import { useUserRole } from "@/shared/components/providers/role-provider";

export function LoginForm(): React.JSX.Element {
  const router = useRouter();
  const { setRole, updateUser } = useUserRole();
  const [identifier, setIdentifier] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const cleanIdentifier = identifier.trim();
    if (!cleanIdentifier) {
      setError("Silakan masukkan email atau nomor WhatsApp Anda.");
      return;
    }

    if (!password) {
      setError("Silakan masukkan kata sandi akun Anda.");
      return;
    }

    if (password.length < 6) {
      setError("Kata sandi minimal terdiri dari 6 karakter.");
      return;
    }

    setLoading(true);

    try {
      // Simulated authentication delay for UX feedback
      await new Promise((resolve) => setTimeout(resolve, 800));

      const isSalonPartner = cleanIdentifier.toLowerCase().includes("salon") || cleanIdentifier.toLowerCase().includes("mitra");
      if (isSalonPartner) {
        setRole("salon_verified");
        updateUser({
          name: "Rian Hidayat",
          email: cleanIdentifier,
          businessName: "Alfa Signature Salon & Spa",
          isVerified: true,
        });
      } else {
        setRole("consumer");
        updateUser({
          name: cleanIdentifier.includes("@") ? cleanIdentifier.split("@")[0] : "Konsumen Alfa",
          email: cleanIdentifier.includes("@") ? cleanIdentifier : "",
          isVerified: true,
        });
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/my-account");
      }, 900);
    } catch {
      setError("Terjadi kesalahan saat masuk. Silakan coba beberapa saat lagi.");
    } finally {
      setLoading(false);
    }
  };

  const whatsappHelpUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Halo Admin ${SITE_SHORT_NAME}, saya butuh bantuan untuk reset kata sandi atau masuk ke akun saya.`
  )}`;

  return (
    <div className="w-full space-y-5">
      {/* ─── Feedback Messages ─── */}
      {success && (
        <div
          role="status"
          className="p-3.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2.5"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>Berhasil masuk. Mengarahkan ke dashboard akun...</span>
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="p-3.5 rounded bg-brand-crimson/10 border border-brand-crimson/30 text-brand-crimson text-xs flex items-center gap-2.5"
        >
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ─── Standard E-Commerce Login Form ─── */}
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="login-identifier" className="mb-1.5 block text-xs font-semibold text-charcoal">
            Email atau Nomor WhatsApp
          </label>
          <div className="relative">
            <input
              id="login-identifier"
              type="text"
              name="identifier"
              autoComplete="username"
              value={identifier}
              onChange={(e) => {
                setIdentifier(e.target.value);
                if (error) setError("");
              }}
              placeholder="nama@domain.com atau 0812xxxx"
              className={fieldClass()}
              disabled={loading || success}
            />
            <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 pointer-events-none" />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="login-password" className="block text-xs font-semibold text-charcoal">
              Kata Sandi
            </label>
            <a
              href={whatsappHelpUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-muted-foreground hover:text-foreground transition-colors"
            >
              Lupa kata sandi?
            </a>
          </div>
          <div className="relative">
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError("");
              }}
              placeholder="••••••••"
              className={cn(fieldClass(), "pr-10")}
              disabled={loading || success}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
              aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <Checkbox
              id="remember-me"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked === true)}
              disabled={loading || success}
            />
            <label
              htmlFor="remember-me"
              className="text-caption text-muted-foreground cursor-pointer select-none"
            >
              Ingat saya di perangkat ini
            </label>
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full bg-foreground text-white hover:bg-foreground/90 font-bold text-cta cursor-pointer h-11 mt-2 rounded"
          disabled={loading || success}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Memverifikasi...
            </>
          ) : (
            <>
              <Lock className="mr-2 h-4 w-4" />
              Masuk ke Akun
            </>
          )}
        </Button>
      </form>

      {/* ─── Standard E-Commerce B2B Partner Notice ─── */}
      <div className="rounded border border-border bg-surface-subtle p-3.5 text-xs">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-semibold text-foreground">Pemilik Salon atau Barbershop?</p>
            <p className="text-muted-foreground text-[11px] mt-0.5">
              Mitra resmi mendapatkan akses harga khusus grosir dan fasilitas kemitraan.
            </p>
          </div>
          <Link
            href="/partnership"
            className="shrink-0 font-semibold text-brand-crimson hover:underline inline-flex items-center gap-1 text-xs"
          >
            <span>Daftar Mitra</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}

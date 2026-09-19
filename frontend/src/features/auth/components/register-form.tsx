"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Phone,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { fieldClass } from "@/shared/components/ui/form-field";
import { SITE_NAME } from "@/shared/lib/config";
import { cn } from "@/shared/lib/utils";
import { useUserRole } from "@/shared/components/providers/role-provider";

export function RegisterForm(): React.JSX.Element {
  const router = useRouter();
  const { setRole, updateUser } = useUserRole();
  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [agreeTerms, setAgreeTerms] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!fullName.trim()) {
      setError("Silakan masukkan nama lengkap Anda.");
      return;
    }

    if (!email.trim() || !email.includes("@")) {
      setError("Silakan masukkan alamat email yang valid.");
      return;
    }

    if (!phone.trim() || phone.length < 9) {
      setError("Silakan masukkan nomor WhatsApp yang aktif.");
      return;
    }

    if (!password || password.length < 8) {
      setError("Kata sandi minimal harus 8 karakter.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Konfirmasi kata sandi tidak cocok dengan kata sandi.");
      return;
    }

    if (!agreeTerms) {
      setError("Anda harus menyetujui Ketentuan Layanan dan Kebijakan Privasi.");
      return;
    }

    setLoading(true);

    try {
      // Authenticate newly registered retail consumer into state
      setRole("consumer");
      updateUser({
        name: fullName.trim(),
        email: email.trim(),
        isVerified: true,
      });

      setSuccess(true);
      setTimeout(() => {
        router.push("/my-account");
      }, 1000);
    } catch {
      setError("Gagal mendaftarkan akun. Silakan periksa koneksi Anda dan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-5">
      {/* ─── Feedback Messages ─── */}
      {success && (
        <div
          role="status"
          className="p-3.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2.5"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>Pendaftaran berhasil! Mengarahkan ke dashboard akun...</span>
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

      {/* ─── Standard E-Commerce Registration Form ─── */}
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="reg-name" className="mb-1.5 block text-xs font-semibold text-charcoal">
            Nama Lengkap
          </label>
          <div className="relative">
            <input
              id="reg-name"
              type="text"
              name="name"
              autoComplete="name"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                if (error) setError("");
              }}
              placeholder="Contoh: Jessica Wijaya"
              className={fieldClass()}
              disabled={loading || success}
            />
            <User className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 pointer-events-none" />
          </div>
        </div>

        <div>
          <label htmlFor="reg-email" className="mb-1.5 block text-xs font-semibold text-charcoal">
            Alamat Email
          </label>
          <div className="relative">
            <input
              id="reg-email"
              type="email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError("");
              }}
              placeholder="nama@domain.com"
              className={fieldClass()}
              disabled={loading || success}
            />
            <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 pointer-events-none" />
          </div>
        </div>

        <div>
          <label htmlFor="reg-phone" className="mb-1.5 block text-xs font-semibold text-charcoal">
            Nomor WhatsApp
          </label>
          <div className="relative">
            <input
              id="reg-phone"
              type="tel"
              name="phone"
              autoComplete="tel"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                if (error) setError("");
              }}
              placeholder="081234567890"
              className={fieldClass()}
              disabled={loading || success}
            />
            <Phone className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 pointer-events-none" />
          </div>
        </div>

        <div>
          <label htmlFor="reg-password" className="mb-1.5 block text-xs font-semibold text-charcoal">
            Kata Sandi (Minimal 8 Karakter)
          </label>
          <div className="relative">
            <input
              id="reg-password"
              type={showPassword ? "text" : "password"}
              name="password"
              autoComplete="new-password"
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

        <div>
          <label htmlFor="reg-confirm-password" className="mb-1.5 block text-xs font-semibold text-charcoal">
            Konfirmasi Kata Sandi
          </label>
          <input
            id="reg-confirm-password"
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (error) setError("");
            }}
            placeholder="••••••••"
            className={fieldClass()}
            disabled={loading || success}
          />
        </div>

        <div className="pt-1">
          <div className="flex items-start gap-2.5">
            <Checkbox
              id="agree-terms"
              checked={agreeTerms}
              onCheckedChange={(checked) => setAgreeTerms(checked === true)}
              disabled={loading || success}
              className="mt-0.5"
            />
            <label
              htmlFor="agree-terms"
              className="text-caption text-muted-foreground cursor-pointer select-none leading-normal"
            >
              Saya menyetujui{" "}
              <Link href="/terms" className="font-semibold text-foreground underline hover:opacity-80">
                Ketentuan Layanan
              </Link>{" "}
              dan{" "}
              <Link href="/privacy" className="font-semibold text-foreground underline hover:opacity-80">
                Kebijakan Privasi
              </Link>{" "}
              {SITE_NAME}.
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
              Mendaftarkan Akun...
            </>
          ) : (
            "Daftar Akun"
          )}
        </Button>
      </form>

      {/* ─── Standard E-Commerce B2B Partner Notice ─── */}
      <div className="rounded border border-border bg-surface-subtle p-3.5 text-xs">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-semibold text-foreground">Pemilik Salon atau Barbershop?</p>
            <p className="text-muted-foreground text-[11px] mt-0.5">
              Daftar program kemitraan resmi untuk harga grosir & pelatihan masterclass.
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

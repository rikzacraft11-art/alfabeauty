"use client";

import * as React from "react";
import { useLanguage } from "@/shared/components/providers/language-provider";
import { cn } from "@/shared/lib/utils";
import { Globe } from "lucide-react";

interface LanguageSwitcherProps {
  isSolid?: boolean;
  className?: string;
  variant?: "header" | "mobile" | "footer";
}

export function LanguageSwitcher({
  isSolid = true,
  className,
  variant = "header",
}: LanguageSwitcherProps): React.JSX.Element {
  const { language, setLanguage } = useLanguage();

  if (variant === "mobile") {
    return (
      <div className={cn("flex items-center gap-2 p-1 rounded-full border border-border-warm/60 bg-surface-elevated", className)}>
        <button
          type="button"
          onClick={() => setLanguage("id")}
          className={cn(
            "flex-1 py-2 px-3 text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-300",
            language === "id"
              ? "bg-brand-crimson text-white shadow-sm"
              : "text-foreground/70 hover:text-foreground"
          )}
          aria-label="ID - Pilih Bahasa Indonesia"
        >
          🇮🇩 ID
        </button>
        <button
          type="button"
          onClick={() => setLanguage("en")}
          className={cn(
            "flex-1 py-2 px-3 text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-300",
            language === "en"
              ? "bg-brand-crimson text-white shadow-sm"
              : "text-foreground/70 hover:text-foreground"
          )}
          aria-label="EN - Select English"
        >
          🇬🇧 EN
        </button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full p-1 border transition-all duration-500 ease-[var(--ease)]",
        isSolid
          ? "border-border-warm/80 bg-surface-elevated/80"
          : "border-white/20 bg-black/20 backdrop-blur-md",
        className
      )}
      role="group"
      aria-label="Language Selector"
    >
      <Globe
        className={cn(
          "ml-1.5 h-3 w-3 transition-colors duration-300",
          isSolid ? "text-foreground/60" : "text-white/70"
        )}
      />
      <button
        type="button"
        onClick={() => setLanguage("id")}
        className={cn(
          "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider transition-all duration-300",
          language === "id"
            ? isSolid
              ? "bg-foreground text-white shadow-xs"
              : "bg-white text-charcoal shadow-xs"
            : isSolid
            ? "text-foreground/80 hover:text-foreground"
            : "text-white/90 hover:text-white"
        )}
        aria-label="ID - Ganti ke Bahasa Indonesia"
      >
        ID
      </button>
      <span
        className={cn(
          "text-[9px] select-none opacity-40",
          isSolid ? "text-foreground" : "text-white"
        )}
      >
        /
      </span>
      <button
        type="button"
        onClick={() => setLanguage("en")}
        className={cn(
          "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider transition-all duration-300",
          language === "en"
            ? isSolid
              ? "bg-foreground text-white shadow-xs"
              : "bg-white text-charcoal shadow-xs"
            : isSolid
            ? "text-foreground/80 hover:text-foreground"
            : "text-white/90 hover:text-white"
        )}
        aria-label="EN - Switch to English"
      >
        EN
      </button>
    </div>
  );
}

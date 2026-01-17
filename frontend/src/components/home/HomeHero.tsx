"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import ButtonLink from "@/components/ui/ButtonLink";
import { useLocale } from "@/components/i18n/LocaleProvider";
import {
  IconArrowRight,
  IconShield,
  IconTruck,
  IconAcademic
} from "@/components/ui/icons";
import { getHeroContent, getTrustIndicators } from "@/content/homepage";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

// =============================================================================
// Types
// =============================================================================

interface TrustItemProps {
  icon: React.ReactNode;
  text: string;
}

// =============================================================================
// Sub-components (Single Responsibility)
// =============================================================================

/**
 * TrustItem - Individual trust indicator with icon and text
 */
function TrustItem({ icon, text }: TrustItemProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 px-2 py-3 sm:px-6 sm:py-5 text-center">
      <span className="text-foreground shrink-0" aria-hidden="true">
        {icon}
      </span>
      <span className="type-data text-muted-strong">{text}</span>
    </div>
  );
}

/**
 * TrustBar - Full trust indicator bar below hero
 * Responsive: stacks on mobile, horizontal on desktop
 */
function TrustBar() {
  const { locale } = useLocale();
  const indicators = getTrustIndicators(locale);

  const icons = {
    authentic: <IconShield className="h-5 w-5" />,
    delivery: <IconTruck className="h-5 w-5" />,
    education: <IconAcademic className="h-5 w-5" />,
  };

  return (
    <div className="border-y border-border bg-background">
      <div className="max-w-[120rem] mx-auto">
        <div
          className="grid grid-cols-3 divide-x divide-border"
          role="list"
          aria-label={locale === "id" ? "Keunggulan kami" : "Our advantages"}
        >
          {indicators.map((item) => (
            <div key={item.key} role="listitem">
              <TrustItem
                icon={icons[item.key as keyof typeof icons]}
                text={item.text}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * HeroVideo - Background video with fallback image
 * Handles autoplay, error states, and poster image
 */
function HeroVideo({
  videoRef,
  videoError,
  prefersReducedMotion,
  onError,
}: {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  videoError: boolean;
  prefersReducedMotion: boolean;
  onError: () => void;
}) {
  if (videoError || prefersReducedMotion) {
    return (
      <Image
        src="/images/hero/hero-salon.jpg"
        alt="Professional salon interior"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
    );
  }

  return (
    <video
      ref={videoRef}
      className="absolute inset-0 w-full h-full object-cover"
      autoPlay
      muted
      loop
      playsInline
      poster="/images/hero/hero-salon.jpg"
      onError={onError}
    >
      <source src="/videos/hero-salon.mp4" type="video/mp4" />
      <source src="/videos/hero-salon.webm" type="video/webm" />
    </video>
  );
}

/**
 * HeroContent - Text overlay content
 * Positioned absolutely over video/image background
 */
function HeroContent() {
  const { locale } = useLocale();
  const base = `/${locale}`;
  const content = getHeroContent(locale);

  return (
    <div className="absolute inset-0 flex items-center">
      <div className="w-full max-w-[120rem] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="max-w-sm sm:max-w-lg lg:max-w-xl space-y-4 sm:space-y-5">
          {/* Kicker */}
          <p className="type-kicker ui-hero-on-media-strong">
            {content.kicker}
          </p>

          {/* Headline - h1 for SEO */}
          <h1 className="type-h1 ui-hero-on-media">
            {content.headline}
          </h1>

          {/* Description */}
          <p className="type-body ui-hero-on-media-muted max-w-md">
            {content.description}
          </p>

          {/* CTA Button */}
          <div className="pt-2 sm:pt-3 space-y-3">
            <div className="flex flex-row gap-3 items-center">
              <ButtonLink
                href={`${base}/products`}
                variant="primary"
                size="lg"
                className="group inline-flex items-center justify-center gap-2 flex-1 sm:flex-none"
              >
                {content.ctaPrimary}
                <IconArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </ButtonLink>

              <ButtonLink
                href={`${base}/partnership/become-partner`}
                variant="secondary"
                size="lg"
                className="inline-flex items-center justify-center flex-1 sm:flex-none"
              >
                {content.ctaSecondary}
              </ButtonLink>
            </div>

            <p className="type-data ui-hero-on-media-subtle max-w-md">
              {content.note}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// Main Component
// =============================================================================

/**
 * HomeHero - Full-bleed hero section with video background
 * 
 * Features:
 * - Video background with image fallback
 * - Gradient overlay for text readability
 * - Responsive layout (mobile-first)
 * - Trust indicator bar
 * 
 * Accessibility:
 * - Proper heading hierarchy (h1)
 * - Video has poster for slow connections
 * - Trust bar has ARIA roles
 */
export default function HomeHero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }
    // Start video at 4 minutes (240 seconds) for visual interest
    if (videoRef.current) {
      videoRef.current.currentTime = 240;
      videoRef.current.play().catch(() => {
        // Video autoplay blocked - poster will be shown
      });
    }
  }, [prefersReducedMotion]);

  return (
    <section
      className="relative w-full overflow-hidden"
      aria-label="Hero"
    >
      {/* Video/Image Background - Full bleed */}
      {/* 
        Smart responsive aspect ratio:
        - Mobile (default): 9/16 portrait - fits phone screens
        - Tablet (sm+): 4/3 - balanced view
        - Desktop (lg+): 16/9 - cinematic widescreen
        This approach ensures video fills container without white space on any device.
      */}
      <div className="relative w-full aspect-[9/16] sm:aspect-[4/3] lg:aspect-[16/9] max-h-[85vh]">
        <HeroVideo
          videoRef={videoRef}
          videoError={videoError}
          prefersReducedMotion={prefersReducedMotion}
          onError={() => setVideoError(true)}
        />

        {/* Gradient Overlays for Text Readability */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/40 to-transparent"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-foreground/30 via-transparent to-foreground/10"
          aria-hidden="true"
        />

        {/* Content Overlay */}
        <HeroContent />
      </div>

      {/* Trust Indicator Bar */}
      <TrustBar />
    </section>
  );
}

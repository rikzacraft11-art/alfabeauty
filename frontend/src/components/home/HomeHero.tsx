"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import TextLink from "@/components/ui/TextLink";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getHeroContent } from "@/content/homepage";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

// =============================================================================
// Sub-components (Single Responsibility)
// =============================================================================

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
    <div className="absolute inset-0 flex items-end pb-12 sm:pb-16 lg:pb-20">
      <div className="w-full max-w-[120rem] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="max-w-sm sm:max-w-lg lg:max-w-xl space-y-4 sm:space-y-5">
          {/* Kicker */}
          <p className="type-hero-kicker ui-hero-on-media-strong animate-fade-in">
            {content.kicker}
          </p>

          {/* Headline - uses dedicated hero typography for larger sizing */}
          <h1 className="type-hero ui-hero-on-media animate-fade-in-delay-1">
            {content.headline}
          </h1>

          {/* Description */}
          <p className="type-hero-body ui-hero-on-media-muted max-w-md animate-fade-in-delay-2">
            {content.description}
          </p>

          {/* CK-style CTAs - Editorial underlined text links (no buttons) */}
          <div className="pt-2 sm:pt-3 space-y-3">
            <div className="flex flex-row gap-6 items-center">
              {/* PRIMARY CTA - Become Partner */}
              <TextLink
                href={`${base}/partnership/become-partner`}
                onDark
              >
                {content.ctaSecondary}
              </TextLink>

              {/* SECONDARY - Explore Brands */}
              <TextLink
                href={`${base}/products`}
                onDark
              >
                {content.ctaPrimary}
              </TextLink>
            </div>

            <p className="type-hero-note ui-hero-on-media-subtle max-w-md">
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
        Simplified responsive approach (Clean Code):
        - Mobile (<640px): Fixed height 70vh for reliable portrait display
        - Tablet+ (≥640px): 16/9 widescreen ratio for all larger screens
        
        This 2-state approach eliminates the jarring 639→640 and 1023→1024 jumps
        by using consistent height on mobile and consistent ratio on desktop.
        The video's object-cover handles natural cropping at all sizes.
      */}
      <div className="relative w-full h-[70vh] sm:h-auto sm:aspect-[16/9] max-h-[85vh]">
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
    </section>
  );
}

"use client";

import Card from "@/components/ui/Card";
import AppLink from "@/components/ui/AppLink";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { t } from "@/lib/i18n";
import {
  IconProducts,
  IconEducation,
  IconPartnership,
  IconArrowRightSmall
} from "@/components/ui/icons";
import { getPillarsContent } from "@/content/homepage";

// =============================================================================
// Types
// =============================================================================

interface PillarCardProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  body: string;
  href: string;
  learnMoreText: string;
  index: number;
}

// =============================================================================
// Constants
// =============================================================================

const PILLAR_CONFIG = [
  { key: "products", icon: IconProducts, href: "/products" },
  { key: "education", icon: IconEducation, href: "/education" },
  { key: "partnership", icon: IconPartnership, href: "/partnership" },
] as const;

// =============================================================================
// Sub-components
// =============================================================================

/**
 * PillarCard - Individual service pillar card
 * 
 * Features:
 * - Numbered badge for visual hierarchy (enterprise pattern)
 * - Icon with hover scale animation
 * - Hidden CTA that reveals on hover
 * - Accessible focus states
 */
function PillarCard({ icon: Icon, title, body, href, learnMoreText, index }: PillarCardProps) {
  const number = String(index + 1).padStart(2, "0");

  return (
    <AppLink
      href={href}
      underline="none"
      className="block focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-foreground ui-radius-tight"
    >
      <Card
        variant="bordered"
        className="group h-full p-5 sm:p-6 lg:p-8 hover:border-foreground 
                           transition-all duration-300 hover:shadow-md relative"
      >
        {/* Number badge - enterprise visual pattern */}
        <span
          className="absolute top-4 right-4 type-data text-muted-soft font-mono"
          aria-hidden="true"
        >
          {number}
        </span>

        <div className="space-y-4 sm:space-y-5">
          {/* Icon */}
          <div
            className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full 
                                   bg-foreground text-background
                                   group-hover:scale-110 transition-transform duration-300"
            aria-hidden="true"
          >
            <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>

          {/* Content */}
          <div className="space-y-2 sm:space-y-3">
            <h3 className="type-h3 text-foreground">{title}</h3>
            <p className="type-body line-clamp-2">{body}</p>
          </div>

          {/* CTA - Hidden until hover */}
          <div
            className="flex items-center gap-1.5 type-data-strong text-foreground
                                   opacity-0 group-hover:opacity-100 
                                   translate-y-2 group-hover:translate-y-0
                                   transition-all duration-300"
            aria-hidden="true"
          >
            <span>{learnMoreText}</span>
            <IconArrowRightSmall className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </Card>
    </AppLink>
  );
}

// =============================================================================
// Main Component
// =============================================================================

/**
 * Pillars - Service offering cards
 * 
 * Features:
 * - 3-column grid on desktop
 * - Single column on mobile (mobile-first)
 * - Animated reveal on hover
 * 
 * Clean Code:
 * - Uses shared icons from @/components/ui/icons
 * - Uses centralized content from homepage.ts
 * - PillarCard extracted for single responsibility
 */
export default function Pillars() {
  const { locale } = useLocale();
  const copy = t(locale);
  const baseUrl = `/${locale}`;
  const content = getPillarsContent(locale);

  const pillarsData = [
    copy.pillars.products,
    copy.pillars.education,
    copy.pillars.partnership,
  ];

  return (
    <section
      className="space-y-6 sm:space-y-8"
      aria-labelledby="pillars-title"
    >
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2 sm:space-y-3 px-4 sm:px-0">
        <p className="type-kicker">
          {content.kicker}
        </p>
        <h2 id="pillars-title" className="type-h2">
          {content.title}
        </h2>
      </div>

      {/* Pillars Grid - Mobile-first: single column */}
      <div
        className="grid gap-4 sm:gap-5 md:grid-cols-3 md:gap-6"
        role="list"
      >
        {PILLAR_CONFIG.map((config, index) => (
          <div key={config.key} role="listitem">
            <PillarCard
              icon={config.icon}
              title={pillarsData[index].title}
              body={pillarsData[index].body}
              href={`${baseUrl}${config.href}`}
              learnMoreText={content.learnMore}
              index={index}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

"use client";

type SkeletonProps = {
  className?: string;
  /** Preset shape variants */
  variant?: "text" | "title" | "avatar" | "button" | "card" | "image";
  /** Number of lines for text variant */
  lines?: number;
};

function cx(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Skeleton placeholder component for loading states.
 * Uses the ui-skeleton animation defined in globals.css.
 */
export default function Skeleton({
  className,
  variant = "text",
  lines = 1,
}: SkeletonProps) {
  const baseClass = "ui-skeleton bg-subtle";

  // Variant-specific styles
  const variants: Record<string, string> = {
    text: "h-4 rounded",
    title: "h-8 rounded w-3/4",
    avatar: "h-12 w-12 rounded-full",
    button: "h-10 w-24 rounded",
    card: "h-48 rounded",
    image: "aspect-square rounded",
  };

  if (variant === "text" && lines > 1) {
    return (
      <div className={cx("space-y-2", className)}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cx(
              baseClass,
              variants.text,
              i === lines - 1 ? "w-4/5" : "w-full"
            )}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cx(
        baseClass,
        variants[variant] || variants.text,
        className
      )}
    />
  );
}

/**
 * Pre-built skeleton for product cards
 */
export function ProductCardSkeleton() {
  return (
    <div className="border border-border bg-background p-6 space-y-4">
      <Skeleton variant="image" className="aspect-video" />
      <Skeleton variant="text" className="w-1/3" />
      <Skeleton variant="title" />
      <Skeleton variant="text" lines={2} />
      <div className="flex gap-2 pt-2">
        <Skeleton variant="button" className="w-16" />
        <Skeleton variant="button" className="w-16" />
      </div>
    </div>
  );
}

/**
 * Pre-built skeleton for article/event cards
 */
export function ArticleCardSkeleton() {
  return (
    <div className="border border-border bg-background overflow-hidden">
      <Skeleton variant="image" className="aspect-video" />
      <div className="p-6 space-y-4">
        <Skeleton variant="text" className="w-24" />
        <Skeleton variant="title" />
        <Skeleton variant="text" lines={3} />
      </div>
    </div>
  );
}

/**
 * Pre-built skeleton for form fields
 */
export function FormFieldSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton variant="text" className="w-24" />
      <Skeleton className="h-10 w-full rounded" />
    </div>
  );
}

/**
 * Pre-built skeleton for testimonial cards
 */
export function TestimonialSkeleton() {
  return (
    <div className="border border-border p-6 ui-radius space-y-4">
      <Skeleton className="h-8 w-8 rounded" />
      <Skeleton variant="text" lines={3} />
      <div className="flex items-center gap-4 pt-4 border-t border-border">
        <Skeleton variant="avatar" />
        <div className="space-y-2 flex-1">
          <Skeleton variant="text" className="w-24" />
          <Skeleton variant="text" className="w-16" />
        </div>
      </div>
    </div>
  );
}

/**
 * Pre-built skeleton for stats bar
 */
export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="text-center space-y-2">
          <Skeleton className="h-12 w-20 mx-auto rounded" />
          <Skeleton variant="text" className="w-24 mx-auto" />
        </div>
      ))}
    </div>
  );
}

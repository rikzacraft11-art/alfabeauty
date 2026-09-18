import * as React from "react";

export interface JsonLdProps {
  /**
   * Structured data payload adhering to Schema.org standards.
   * Accepts a single object or an array of Schema objects.
   */
  data: Record<string, unknown> | Array<Record<string, unknown>>;
  /**
   * Optional CSP nonce string passed down from request headers.
   */
  nonce?: string;
  /**
   * Optional unique script identifier for DOM tracking or debugging.
   */
  id?: string;
}

/**
 * Reusable JSON-LD Schema Script Component.
 *
 * Automatically escapes angle brackets (`<` -> `\u003c`) to prevent script
 * tag breakout / XSS vulnerabilities, supports CSP nonces, and isolates
 * schema presentation across Next.js App Router routes.
 */
export function JsonLd({
  data,
  nonce,
  id,
}: JsonLdProps): React.JSX.Element | null {
  if (!data || (Array.isArray(data) && data.length === 0)) {
    return null;
  }

  const serialized = JSON.stringify(data).replace(/</g, "\\u003c");

  return (
    <script
      id={id}
      type="application/ld+json"
      nonce={nonce}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: serialized }}
    />
  );
}

export interface BreadcrumbItem {
  name: string;
  item: string;
}

/**
 * Creates a Schema.org-compliant BreadcrumbList structured data object with 1-based indexing.
 */
export function createBreadcrumbList(items: BreadcrumbItem[]): {
  "@type": "BreadcrumbList";
  itemListElement: Array<{
    "@type": "ListItem";
    position: number;
    name: string;
    item: string;
  }>;
} {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: crumb.item,
    })),
  };
}

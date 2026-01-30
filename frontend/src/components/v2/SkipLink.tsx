import AppLink from "@/components/ui/AppLink";

/**
 * SkipLink: Accessibility skip navigation for keyboard users.
 * Design V2 WCAG 2.2 AA compliance pattern.
 */
export default function SkipLink() {
    return (
        <AppLink
            href="#main-content"
            className="skip-link sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:px-6 focus:py-3 focus:bg-foreground focus:text-background focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-foreground transition-all"
        >
            Skip to main content
        </AppLink>
    );
}

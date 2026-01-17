import ButtonLink from "@/components/ui/ButtonLink";

/**
 * Global 404 fallback (outside locale routes).
 * Redirects to / so middleware handles locale detection.
 */
export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl space-y-4 text-center">
      <h1 className="type-h2">Page not found</h1>
      <p className="type-body">The page you&apos;re looking for doesn&apos;t exist.</p>
      <ButtonLink href="/" variant="secondary">Back to home</ButtonLink>
    </div>
  );
}

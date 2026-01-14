import ButtonLink from "@/components/ui/ButtonLink";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl space-y-4 text-center">
      <h1 className="type-h2">Page not found</h1>
      <p className="type-body">The page you’re looking for doesn’t exist.</p>
      <ButtonLink href="/en" variant="secondary">Back to home</ButtonLink>
    </div>
  );
}

export default function Loading(): React.JSX.Element {
  return (
    <main id="main-content" className="flex min-h-dvh items-center justify-center bg-background">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-pulse bg-foreground/10" />
        <p className="mt-4 text-eyebrow text-text-muted">
          Loading…
        </p>
      </div>
    </main>
  );
}

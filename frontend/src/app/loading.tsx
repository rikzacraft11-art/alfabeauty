export default function Loading(): React.JSX.Element {
  return (
    <main
      id="main-content"
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="flex min-h-dvh items-center justify-center bg-background"
    >
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-pulse rounded-full bg-brand-crimson/20 border-2 border-brand-crimson/40" />
        <p className="mt-4 text-eyebrow text-text-muted">
          Loading…
        </p>
      </div>
    </main>
  );
}

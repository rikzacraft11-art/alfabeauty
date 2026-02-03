export function initSentryServer() {
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
  if (!dsn) return;

  // Use a runtime require to avoid bundling Sentry (and its optional Prisma/OpenTelemetry deps)
  // into dev builds, which can create noisy webpack warnings.
  let Sentry: any;
  try {
    const req = eval("require") as any;
    Sentry = req("@sentry/nextjs");
  } catch {
    return;
  }

  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV || "development",
    tracesSampleRate: 0.1,
    debug: false,
      beforeSend(event: unknown) {
        return event as any;
    },
  });
}

# Governance & Standards

This document outlines the engineering standards for the **Paket A B2B Platform**. We enforce these rules to maintain a professional, consistent, and maintainable codebase.

## 1. Design System Governance

We adhere to a strict **B2B Professional** aesthetic. This is enforced via automated linting scripts.

### Typography (`lint:typography`)

* **Rule**: No raw Tailwind text classes (e.g., `text-lg`, `font-bold`, `tracking-wide`) are allowed in source code.
* **Solution**: You MUST use semantic tokens defined in `globals.css`.
  * **Headings**: `.type-hero`, `.type-h1`, `.type-h2`, `.type-h3`
  * **Body**: `.type-body`, `.type-body-compact`
  * **UI**: `.type-ui`, `.type-ui-sm`
  * **Special**: `.type-kicker`, `.type-data`, `.type-legal`
* **Rationale**: Ensures consistent hierarchy and readability across the platform.

### Colors & Tokens (`lint:tokens`)

* **Rule**: No hardcoded hex values or arbitrary Tailwind colors (e.g., `bg-zinc-900`) outside of `globals.css`.
* **Solution**: Use semantic variables.
  * `bg-background`, `bg-panel`, `bg-foreground`
  * `text-foreground`, `text-muted`
  * `border-border`, `border-strong`
* **Rationale**: Enables easy theming (Dark Mode) and maintains the "Zinc/Neutral" B2B palette.

## 2. Code Quality Gates

Every Pull Request (and build) must pass the following checks:

| Gate | Command | Description |
| :--- | :--- | :--- |
| **Linting** | `npm run lint` | Runs ESLint and all custom governance scripts (typography, tokens, etc.). |
| **Type Check** | `npm run type-check` | Validates TypeScript types (no `any` leaks). |
| **Unit Tests** | `npm run test:unit` | Runs Vitest for logic (hooks, utils). |
| **E2E Smoke** | `npm run test:e2e` | Runs Playwright smoke tests (critical flows). |

## 3. Incident Management (ITIL 4)

* **Sentry**: All runtime errors are captured in Sentry.
* **Logging**: Use `logger.error()` instead of `console.error()` to ensure structured logging.

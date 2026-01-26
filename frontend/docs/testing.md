# Testing Strategy

We employ a "Pyramid" testing strategy to ensure reliability without slowing down development.

## 1. Unit Testing (Vitest)

Focused on business logic, hooks, and utilities.

* **Scope**: `src/lib/*`, `src/hooks/*`, and complex components.
* **Command**: `npm run test:unit`
* **Example**: Verifying `isPartnerPayload` logic in `submit-lead.ts`.

## 2. End-to-End (Playwright)

Focused on critical user journeys (Smoke Tests).

* **Scope**: Lead Capture, Navigation, Localization.
* **Command**: `npm run test:e2e` (Headless) or `npm run test:e2e:ui` (Interactive).
* **Critical Flows**:
    1. **Lead Form**: Submitting the "Become Partner" form (mocked API).
    2. **Localization**: Switching between English and Indonesian.
    3. **Navigation**: Verifying the Mega Menu structure.

## 3. Manual Verification (UAT)

 performed before staging deployment.

* Check visuals (Spacing, Typography).
* Test responsive behavior (Mobile Drawer).
* Verify "WhatsApp Sticky CTA" visibility.

## 4. Automation Scripts

We consolidated testing into a single command for reliability:

```bash
npm run test:all
```

This runs Linting, Type Checking, Unit Tests, and E2E Smoke Tests in sequence.

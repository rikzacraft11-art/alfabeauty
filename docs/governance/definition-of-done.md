# Definition of Done (DoD)

**Status:** Agreed
**Effective Date:** 2026-01-26

## User Stories

A User Story is considered "Done" when:

1. **Code Complete:** Feature implemented according to acceptance criteria.
2. **Lint & Types:** `npm run lint` and `npm run type-check` pass with no errors.
3. **Tests:**
    - Unit tests added/updated (if applicable).
    - `npm run test:unit` passes.
4. **Security:**
    - No new secrets exposed.
    - Zod schemas used for all inputs.
5. **Accessibility:**
    - Interactive elements have focus states.
    - Alt text provided for images.
6. **Review:**
    - Code reviewed by at least one peer (or Tech Lead).
    - CI checks green.

## Releases (Staging to Prod)

A Release is considered "Done" when:

1. **Changelog:** Updated `CHANGELOG.md` with version and notes.
2. **Tag:** Git tag created (e.g., `v1.0.1`).
3. **Deploy:** Successfully deployed to Vercel Production.
4. **Pipeline:** Deployment Pipeline (Build/Test) passed in Vercel.
5. **Smoke Test:** Critical paths (Lead Form) verify on Production.

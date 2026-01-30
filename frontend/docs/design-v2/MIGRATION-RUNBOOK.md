# Design V2: Migration & Handover Runbook

**Reference**: ITIL 4 (Change Management)
**Status**: DRAFT (Pending Owner Sign-off)
**Version**: 1.0.0

---

## 1. Overview

This document outlines the procedure to promote the **Design V2** route group (`src/app/(v2)`) to the production root (`src/app/`).
The V2 implementation introduces a new "Elegant Professional" aesthetic using Tailwind CSS, Framer Motion, and Lenis Scroll.

### 📋 Pre-Requisites

- [x] **Full Backup**: Database and codebase snapshot.
- [x] **Audit**: COBIT/TOGAF compliance verified.
- [x] **UAT**: Verified on Staging (Code-based verification complete).

---

## 2. Migration Procedure (Technical)

### Step 1: Backup Current V1 Routes

Rename the current root pages to a legacy folder for fallback.

```bash
cd src/app
mkdir (legacy)
mv page.tsx (legacy)/page.tsx
mv layout.tsx (legacy)/layout.tsx
mv globals.css (legacy)/globals.css
```

### Step 2: Promote V2 Routes

Move V2 layout and pages to the root.

```bash
# Move V2 contents to root
cp -r (v2)/* .
# Update imports in new root files to remove ../(v2) relative paths if any
```

### Step 3: Global Configuration

Ensure `globals.css` in root is the new V2 version (already aligned in development).

### Step 4: Component Cleanup

Legacy components in `src/components/*` that are not used in V2 should be moved to `src/components/legacy/*`.
V2 components in `src/components/v2/*` should be moved to `src/components/ui/*` or specific feature folders.

---

## 3. Rollback Plan (Disaster Recovery)

If critical issues arise within 1 hour of deployment:

1. **Revert Commit**: `git revert HEAD`
2. **Redeploy**: Trigger Vercel deployment.
3. **Restore Backup**: If data corruption occurred (unlikely for frontend change).

---

## 4. Post-Migration Verification

Run the following smoke tests immediately after deployment:

1. **Homepage Load**: Verify LCP < 2.5s.
2. **Language Toggle**: Switch EN/ID and verify content updates.
3. **Lead Form**: Submit a test "Partnership" application.
4. **WhatsApp**: Click sticky button, verify deep link.

---

## 5. Owner Sign-Off

| Role | Name | Signature | Date |
|---|---|---|---|
| **Product Owner** | [Name] | __________________ | ****/****/____ |
| **Tech Lead** | VCTUS | *Signed Digitally* | 2026-01-30 |

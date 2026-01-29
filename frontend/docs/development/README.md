# Development Handbook (DevOps)

**Framework**: Jamstack / DevOps
**Scope**: Engineering Standards, Testing, and UI Guidelines for Alfa Beauty B2B.

---

## 1. Quick Start

```bash
# Install
npm ci

# Dev Server (Port 3000)
npm run dev

# Run All Checks (Pre-Push)
npm run test:all
```

---

## 2. Testing Strategy (Pyramid)

| Type | Tool | Scope | Command |
| :--- | :--- | :--- | :--- |
| **Static** | ESLint / TSC | Syntax, Types, Governance | `npm run lint` |
| **Unit** | Vitest | Hooks, Utils, Logic | `npm run test:unit` |
| **E2E** | Playwright | Critical User Flows | `npm run test:e2e` |

### Critical Flows (E2E)

1. **Lead Submission**: Verify Form -> API -> Database (Mocked).
2. **Localization**: Switch EN/ID.
3. **Navigation**: Mega Menu structure.

---

## 3. UI Guide (Design System)

**Styling**: Tailwind CSS v4 + CSS Variables.
**Source**: `src/app/globals.css`.

### Component Rules

1. **Strict Mode**: Use semantic tokens (`bg-background`) NOT primitives (`bg-white`).
2. **Client/Server**:
    * Default to **Server Components**.
    * Add `"use client"` ONLY for interactivity (`onClick`, `useState`).
3. **Icons**: Use `lucide-react`.

### Typography Tokens

* `.type-h1`: 32px/40px (Mobile), 48px/56px (Desktop).
* `.type-body`: 16px/24px (Readable).
* `.type-ui`: 14px/20px (Compact).

---

## 4. Git Workflow (Trunk-Based)

1. **Branch**: `feat/feature-name` or `fix/bug-issue`.
2. **Commit**: Conventional Commits (`feat: add login`).
3. **PR**: Must pass CI (Lint + Test).

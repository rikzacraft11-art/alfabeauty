# Contributing to Alfa Beauty Cosmetica B2B

Welcome! We follow **Enterprise Framework Standards** (ITIL, COBIT, Scrum).
Please review the following documents before contributing:

## 📚 Core Documentation

1. **[Governance Standards](./docs/governance.md)**: Coding style, Token usage, Link safety, and Linting rules (Strictly Enforced).
2. **[Testing Strategy](./docs/testing.md)**: Unit vs E2E pyramids.
3. **[Operational Runbook](./docs/runbook.md)**: Deployment and Observability.

## 🛠 Workflow (Scrum)

We use a **Trunk-Based Development** flow with short-lived feature branches.

### Branching Convention

- `feature/name-of-feature`: New capabilities.
- `fix/name-of-bug`: Remediation.
- `chore/name-of-task`: Maintenance/Config.

### Commit Messages

We follow **Conventional Commits**:

- `feat: ...`
- `fix: ...`
- `docs: ...`
- `chore: ...`

## 🧪 Definition of Done (DoD)

A PR is merged only when:

1. `npm run lint` passes (Governance).
2. `npm run type-check` passes (TS).
3. `npm run test:unit` passes (Logic).
4. `npm run test:e2e` passes (Smoke).

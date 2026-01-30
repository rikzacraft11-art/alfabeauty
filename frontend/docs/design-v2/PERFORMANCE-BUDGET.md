# V2 Performance Budget

**ITIL 4: Service Design — Capacity Management**
**Version**: 1.0 | **Last Updated**: 2026-01-30

---

## Core Web Vitals Targets

| Metric | Good | Needs Improvement | Poor | V2 Target |
|--------|------|-------------------|------|-----------|
| LCP (Largest Contentful Paint) | ≤ 2.5s | 2.5s – 4.0s | > 4.0s | **< 2.5s** |
| FID (First Input Delay) | ≤ 100ms | 100ms – 300ms | > 300ms | **< 100ms** |
| CLS (Cumulative Layout Shift) | ≤ 0.1 | 0.1 – 0.25 | > 0.25 | **< 0.1** |
| INP (Interaction to Next Paint) | ≤ 200ms | 200ms – 500ms | > 500ms | **< 200ms** |

---

## Page-Specific Budgets

### Homepage

| Resource Type | Budget | Actual | Status |
|---------------|--------|--------|--------|
| HTML | < 50 KB | - | ⏸️ |
| CSS | < 100 KB | - | ⏸️ |
| JavaScript | < 200 KB | - | ⏸️ |
| Images | < 500 KB | - | ⏸️ |
| Fonts | < 100 KB | - | ⏸️ |
| **Total** | **< 1 MB** | - | ⏸️ |

### Products Listing

| Resource Type | Budget | Actual | Status |
|---------------|--------|--------|--------|
| HTML | < 50 KB | - | ⏸️ |
| CSS | < 100 KB | - | ⏸️ |
| JavaScript | < 200 KB | - | ⏸️ |
| Images (lazy) | < 200 KB initial | - | ⏸️ |
| **Total Initial** | **< 600 KB** | - | ⏸️ |

### Product Detail

| Resource Type | Budget | Actual | Status |
|---------------|--------|--------|--------|
| HTML | < 50 KB | - | ⏸️ |
| CSS | < 100 KB | - | ⏸️ |
| JavaScript | < 200 KB | - | ⏸️ |
| Images (gallery) | < 300 KB | - | ⏸️ |
| **Total** | **< 700 KB** | - | ⏸️ |

---

## Motion Performance Constraints

| Animation Type | Max Duration | Max Elements | Framerate |
|----------------|--------------|--------------|-----------|
| Page Transition | 600ms | 1 | 60fps |
| Stagger Reveal | 800ms total | 10 items | 60fps |
| Parallax | Continuous | 3 layers | 60fps |
| Hover Effects | 400ms | Unlimited | 60fps |

---

## Lenis Scroll Configuration

```typescript
// Optimal Lenis settings for V2
{
  lerp: 0.1,           // Smooth but responsive
  duration: 1.2,       // Natural scroll feel
  wheelMultiplier: 1,  // Standard wheel speed
}
```

---

## Monitoring Tools

| Tool | Purpose | Frequency |
|------|---------|-----------|
| Lighthouse CI | Automated performance testing | Every PR |
| Vercel Analytics | Real User Monitoring (RUM) | Continuous |
| Sentry | Error tracking + performance | Continuous |

---

## Escalation Thresholds

| Metric | Warning | Critical |
|--------|---------|----------|
| LCP | > 2.0s | > 2.5s |
| CLS | > 0.08 | > 0.1 |
| Error Rate | > 0.5% | > 1.0% |

---

## Review Cadence

- **Daily**: Check Vercel Analytics dashboard
- **Weekly**: Review Lighthouse scores
- **Monthly**: Full performance audit

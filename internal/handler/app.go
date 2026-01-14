package handler

import (
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/limiter"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/gofiber/fiber/v2/middleware/requestid"

	"example.com/alfabeauty-b2b/internal/config"
	"example.com/alfabeauty-b2b/internal/obs"
	"example.com/alfabeauty-b2b/internal/service"
)

func NewApp(cfg config.Config, leadSvc *service.LeadService) *fiber.App {
	trustedProxies := parseTrustedProxies(cfg.TrustedProxies)

	app := fiber.New(fiber.Config{
		DisableStartupMessage: true,
		BodyLimit:             cfg.MaxBodyBytes,
		// Only trust X-Forwarded-For when explicit TRUSTED_PROXIES are configured.
		EnableTrustedProxyCheck: len(trustedProxies) > 0,
		TrustedProxies:          trustedProxies,
		ProxyHeader:             fiber.HeaderXForwardedFor,
	})

	// Minimal observability (Paket A): request-id + trace context + panic recovery + access log.
	app.Use(requestid.New(requestid.Config{Header: fiber.HeaderXRequestID}))
	app.Use(ensureTraceparent())
	app.Use(recover.New())
	app.Use(func(c *fiber.Ctx) error {
		start := time.Now()
		err := c.Next()
		dur := time.Since(start)

		// Avoid logging request bodies to reduce PII risk.
		status := c.Response().StatusCode()
		rid, _ := c.Locals("requestid").(string)
		tp, _ := c.Locals("traceparent").(string)

		obs.Log("http_request", obs.Fields{
			"rid":       rid,
			"trace":     tp,
			"method":    c.Method(),
			"path":      c.Path(),
			"status":    status,
			"dur_ms":    dur.Milliseconds(),
			"ip":        c.IP(),
		})
		return err
	})

	// Baseline security headers (Paket A §15). Keep minimal and low-risk.
	// - Apply to all responses (including errors).
	// - Do not override if a handler already set a specific value.
	app.Use(func(c *fiber.Ctx) error {
		if c.Get("X-Content-Type-Options") == "" {
			c.Set("X-Content-Type-Options", "nosniff")
		}
		// This API serves JSON and does not need referrer data; use the most conservative policy.
		// (Website HTML uses a different policy via Next.js headers.)
		if c.Get("Referrer-Policy") == "" {
			c.Set("Referrer-Policy", "no-referrer")
		}
		return c.Next()
	})

	app.Get("/health", httpMetrics("/health"), healthHandler(cfg))
	app.Get("/metrics", httpMetrics("/metrics"), requireAdminToken(cfg.AdminToken), metricsHandler(leadSvc))

	api := app.Group("/api")
	v1 := api.Group("/v1")

	// Rate limit lead intake endpoints.
	leadLimiter := limiter.New(limiter.Config{
		Max:        cfg.RateLimitRPS,
		Expiration: time.Second,
		KeyGenerator: func(c *fiber.Ctx) string {
			// Prefer client IP; with trusted proxies this can be upgraded later.
			return c.IP()
		},
	})

	// Rate limit telemetry endpoints (best-effort). These endpoints are not auth-protected,
	// so keep sane bounds to reduce abuse risk.
	telemetryLimiter := limiter.New(limiter.Config{
		Max:        30,
		Expiration: time.Second,
		KeyGenerator: func(c *fiber.Ctx) string {
			return c.IP()
		},
	})

	// Website telemetry (Paket A A4): analytics events + CWV RUM.
	v1.Post("/events", httpMetrics("/api/v1/events"), requireJSONContentType(), telemetryLimiter, ingestWebsiteEventHandler())
	v1.Post("/rum", httpMetrics("/api/v1/rum"), requireJSONContentType(), telemetryLimiter, ingestRUMHandler())

	v1.Post("/leads", httpMetrics("/api/v1/leads"), requireJSONContentType(), leadRateLimitMetricsMiddleware(), leadLimiter, createLeadHandler(leadSvc))

	admin := v1.Group("/admin", requireAdminToken(cfg.AdminToken))
	admin.Get("/leads.csv", exportLeadsCSVHandler(leadSvc))
	admin.Get("/lead-notifications", listLeadNotificationsHandler(leadSvc))
	admin.Get("/lead-notifications/stats", leadNotificationsStatsHandler(leadSvc))

	return app
}

func parseTrustedProxies(raw string) []string {
	raw = strings.TrimSpace(raw)
	if raw == "" {
		return nil
	}

	parts := strings.Split(raw, ",")
	out := make([]string, 0, len(parts))
	for _, p := range parts {
		p = strings.TrimSpace(p)
		if p == "" {
			continue
		}
		out = append(out, p)
	}
	if len(out) == 0 {
		return nil
	}
	return out
}

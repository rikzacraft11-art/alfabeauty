package handler

import (
	"log"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/limiter"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/gofiber/fiber/v2/middleware/requestid"

	"example.com/alfabeauty-b2b/internal/config"
	"example.com/alfabeauty-b2b/internal/service"
)

func NewApp(cfg config.Config, leadSvc *service.LeadService) *fiber.App {
	app := fiber.New(fiber.Config{
		DisableStartupMessage: true,
		BodyLimit:            cfg.MaxBodyBytes,
	})

	// Minimal observability: request-id + panic recovery + access log.
	app.Use(requestid.New())
	app.Use(recover.New())
	app.Use(func(c *fiber.Ctx) error {
		start := time.Now()
		err := c.Next()
		dur := time.Since(start)

		// Avoid logging request bodies to reduce PII risk.
		status := c.Response().StatusCode()
		rid, _ := c.Locals("requestid").(string)
		log.Printf("rid=%s method=%s path=%s status=%d dur_ms=%d ip=%s",
			rid,
			c.Method(),
			c.Path(),
			status,
			dur.Milliseconds(),
			c.IP(),
		)
		return err
	})

	app.Get("/health", healthHandler())

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

	v1.Post("/leads", leadLimiter, createLeadHandler(leadSvc))

	admin := v1.Group("/admin", requireAdminToken(cfg.AdminToken))
	admin.Get("/leads.csv", exportLeadsCSVHandler(leadSvc))

	return app
}

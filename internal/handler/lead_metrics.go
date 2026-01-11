package handler

import (
	"github.com/gofiber/fiber/v2"

	"example.com/alfabeauty-b2b/pkg/metrics"
)

// leadRateLimitMetricsMiddleware records rate-limit outcomes (HTTP 429) for the lead intake endpoint.
//
// This must run BEFORE the Fiber limiter middleware, otherwise 429 responses won't reach the handler.
func leadRateLimitMetricsMiddleware() fiber.Handler {
	return func(c *fiber.Ctx) error {
		err := c.Next()
		if c.Response().StatusCode() == fiber.StatusTooManyRequests {
			metrics.IncLeadSubmission("rate_limited")
		}
		return err
	}
}

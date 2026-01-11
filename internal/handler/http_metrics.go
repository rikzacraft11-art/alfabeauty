package handler

import (
	"time"

	"github.com/gofiber/fiber/v2"

	"example.com/alfabeauty-b2b/pkg/metrics"
)

func httpMetrics(routeTemplate string) fiber.Handler {
	return func(c *fiber.Ctx) error {
		start := time.Now()
		err := c.Next()
		metrics.ObserveHTTPRequest(routeTemplate, c.Method(), c.Response().StatusCode(), time.Since(start))
		return err
	}
}

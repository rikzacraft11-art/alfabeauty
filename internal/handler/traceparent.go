package handler

import (
	"crypto/rand"
	"encoding/hex"

	"github.com/gofiber/fiber/v2"
)

// ensureTraceparent guarantees every request has a trace context that can be
// correlated across logs and downstream calls.
//
// Behavior:
// - If client provides "traceparent", we keep it.
// - Otherwise we generate a W3C traceparent and set it on the response.
//
// This is intentionally minimal and does not attempt full distributed tracing.
func ensureTraceparent() fiber.Handler {
	return func(c *fiber.Ctx) error {
		// Fiber's c.Get reads request headers.
		incoming := c.Get("traceparent")
		if incoming != "" {
			// Echo back for easier debugging across proxies.
			c.Set("traceparent", incoming)
			c.Locals("traceparent", incoming)
			return c.Next()
		}

		// Generate: "00-<trace-id 32hex>-<span-id 16hex>-01"
		var tid [16]byte
		var sid [8]byte
		_, _ = rand.Read(tid[:])
		_, _ = rand.Read(sid[:])

		tp := "00-" + hex.EncodeToString(tid[:]) + "-" + hex.EncodeToString(sid[:]) + "-01"
		c.Set("traceparent", tp)
		c.Locals("traceparent", tp)
		return c.Next()
	}
}

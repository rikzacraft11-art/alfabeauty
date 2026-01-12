package handler

import (
	"math"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"

	"example.com/alfabeauty-b2b/pkg/metrics"
)

var rumMetricIDDedupe = newDedupeCache(20000, 10*time.Minute)

type rumPayload struct {
	MetricID        string  `json:"metric_id"`
	MetricName      string  `json:"metric_name"`
	Value           float64 `json:"value"`
	Delta           float64 `json:"delta"`
	Rating          string  `json:"rating"`
	NavigationType  string  `json:"navigation_type"`
	PageURLInitial  string  `json:"page_url_initial"`
	PageURLCurrent  string  `json:"page_url_current"`
	DeviceType      string  `json:"device_type"`
	TimestampISO8601 string `json:"timestamp"`
}

// ingestRUMHandler accepts RUM Web Vitals reports.
//
// Paket A requirements (ADR-0002 / UAT-16):
// - metric_id for dedupe
// - page_url_initial + page_url_current for SPA diagnosis
// - non-blocking transport on client (sendBeacon/fetch keepalive)
func ingestRUMHandler() fiber.Handler {
	return func(c *fiber.Ctx) error {
		var p rumPayload
		if err := c.BodyParser(&p); err != nil {
			return writeJSON(c, fiber.StatusBadRequest, fiber.Map{"error": "invalid_json"})
		}

		metric := strings.ToUpper(strings.TrimSpace(p.MetricName))
		id := strings.TrimSpace(p.MetricID)
		if id == "" {
			return writeJSON(c, fiber.StatusBadRequest, fiber.Map{"error": "metric_id is required"})
		}
		// Defense-in-depth: bound key size to reduce memory pressure under abuse.
		if len(id) > 128 {
			return writeJSON(c, fiber.StatusBadRequest, fiber.Map{"error": "metric_id is too long"})
		}
		switch metric {
		case "LCP", "CLS", "INP":
			// ok
		default:
			return writeJSON(c, fiber.StatusBadRequest, fiber.Map{"error": "metric_name is invalid"})
		}

		if math.IsNaN(p.Value) || math.IsInf(p.Value, 0) || p.Value < 0 {
			return writeJSON(c, fiber.StatusBadRequest, fiber.Map{"error": "value is invalid"})
		}
		// Clamp obviously bogus values (defense-in-depth against abuse).
		// LCP/INP values come in milliseconds; CLS is unitless.
		if metric != "CLS" && p.Value > 600000 {
			return writeJSON(c, fiber.StatusBadRequest, fiber.Map{"error": "value is out of range"})
		}
		if metric == "CLS" && p.Value > 10 {
			return writeJSON(c, fiber.StatusBadRequest, fiber.Map{"error": "value is out of range"})
		}

		// page_url_current is required to make the event usable for diagnosis.
		if strings.TrimSpace(p.PageURLCurrent) == "" {
			return writeJSON(c, fiber.StatusBadRequest, fiber.Map{"error": "page_url_current is required"})
		}

		// Best-effort dedupe by metric_id to avoid double counting when the client
		// retries (sendBeacon fallback, pagehide/visibilitychange flush, etc.).
		if rumMetricIDDedupe.Seen(id, time.Now()) {
			return c.SendStatus(fiber.StatusNoContent)
		}

		metrics.ObserveWebVital(metric, p.Value, p.DeviceType, p.Rating)

		// Intentionally return no content. Client should not block on this.
		return c.SendStatus(fiber.StatusNoContent)
	}
}

package handler

import (
	"bytes"
	"context"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/common/expfmt"

	"example.com/alfabeauty-b2b/pkg/metrics"
	"example.com/alfabeauty-b2b/internal/service"
)

// GET /metrics (admin-protected)
//
// This endpoint is intentionally access-controlled because it exposes operational signals.
func metricsHandler(leadSvc *service.LeadService) fiber.Handler {
	// Ensure registration happens even if this endpoint is never hit.
	metrics.Init()

	return func(c *fiber.Ctx) error {
		// Best-effort refresh gauges on scrape. Keep it bounded.
		ctx, cancel := context.WithTimeout(c.Context(), 2*time.Second)
		defer cancel()
		if leadSvc != nil {
			stats, err := leadSvc.NotificationBacklogStats(ctx)
			if err == nil {
				metrics.SetLeadNotificationBacklog(
					stats.CountsByStatus,
					stats.PendingReadyCount,
					stats.PendingDelayedCount,
					stats.OldestReadyPendingAt,
				)
			}
		}

		mfs, err := prometheus.DefaultGatherer.Gather()
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "internal"})
		}

	var buf bytes.Buffer
	enc := expfmt.NewEncoder(&buf, expfmt.FmtText)
	for _, mf := range mfs {
		_ = enc.Encode(mf)
	}

	// Prevent caching.
	c.Set("Cache-Control", "no-store")
	// Prometheus text format.
	c.Set(fiber.HeaderContentType, string(expfmt.FmtText))
	return c.Send(buf.Bytes())
	}
}

package handler

import (
	"context"
	"time"

	"github.com/gofiber/fiber/v2"

	"example.com/alfabeauty-b2b/internal/obs"
	"example.com/alfabeauty-b2b/internal/service"
)

// GET /api/v1/admin/lead-notifications/stats
//
// Ops-focused backlog summary:
// - counts_by_status: count(*) grouped by status
// - pending_ready_count: pending where next_attempt_at <= now()
// - pending_delayed_count: pending where next_attempt_at > now()
// - oldest_ready_pending_*: age of the oldest ready-to-send pending item
func leadNotificationsStatsHandler(svc *service.LeadService) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var ctx context.Context = c.Context()
		if tp, ok := c.Locals("traceparent").(string); ok {
			ctx = obs.WithTraceparent(ctx, tp)
		}

		start := time.Now()
		stats, err := svc.NotificationBacklogStats(ctx)
		if err != nil {
			obs.Log("admin_lead_notifications_stats_failed", obs.Fields{
				"trace": obs.TraceparentFromContext(ctx),
				"error": err.Error(),
			})
			return writeJSON(c, fiber.StatusInternalServerError, fiber.Map{"error": "internal"})
		}
		obs.Log("admin_lead_notifications_stats", obs.Fields{
			"trace": obs.TraceparentFromContext(ctx),
			"dur_ms": time.Since(start).Milliseconds(),
		})

		// This is an admin-only ops view; prevent caches from storing potentially sensitive operational state.
		c.Set("Cache-Control", "no-store")

		var oldestAgeSeconds *int64
		var oldestAt *time.Time
		if stats.OldestReadyPendingAt != nil {
			oldestAt = stats.OldestReadyPendingAt
			secs := int64(time.Since(*stats.OldestReadyPendingAt).Seconds())
			if secs < 0 {
				secs = 0
			}
			oldestAgeSeconds = &secs
		}

		return writeJSON(c, fiber.StatusOK, fiber.Map{
			"counts_by_status":                stats.CountsByStatus,
			"pending_ready_count":             stats.PendingReadyCount,
			"pending_delayed_count":           stats.PendingDelayedCount,
			"oldest_ready_pending_created_at": oldestAt,
			"oldest_ready_pending_age_seconds": oldestAgeSeconds,
		})
	}
}

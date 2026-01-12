package handler

import (
	"context"
	"strconv"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"

	"example.com/alfabeauty-b2b/internal/domain/notification"
	"example.com/alfabeauty-b2b/internal/obs"
	"example.com/alfabeauty-b2b/internal/repository"
	"example.com/alfabeauty-b2b/internal/service"
)

const (
	defaultNotifLimit = 100
	maxNotifLimit     = 5000
)

// GET /api/v1/admin/lead-notifications
// Query params:
//   - status: pending|processing|sent|failed (optional)
//   - channel: email|webhook (optional)
//   - lead_id: UUID (optional)
//   - limit: 1..5000 (optional)
//   - before: RFC3339 timestamp (optional) -> created_at < before
func listLeadNotificationsHandler(svc *service.LeadService) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var ctx context.Context = c.Context()
		if tp, ok := c.Locals("traceparent").(string); ok {
			ctx = obs.WithTraceparent(ctx, tp)
		}

		status := strings.TrimSpace(strings.ToLower(c.Query("status")))
		channel := strings.TrimSpace(strings.ToLower(c.Query("channel")))

		if status != "" {
			switch status {
			case notification.StatusPending, notification.StatusProcessing, notification.StatusSent, notification.StatusFailed:
				// ok
			default:
				return writeJSON(c, fiber.StatusBadRequest, fiber.Map{"error": "invalid_status"})
			}
		}
		if channel != "" {
			switch channel {
			case notification.ChannelEmail, notification.ChannelWebhook:
				// ok
			default:
				return writeJSON(c, fiber.StatusBadRequest, fiber.Map{"error": "invalid_channel"})
			}
		}

		limit := defaultNotifLimit
		if raw := strings.TrimSpace(c.Query("limit")); raw != "" {
			v, err := strconv.Atoi(raw)
			if err != nil {
				return writeJSON(c, fiber.StatusBadRequest, fiber.Map{"error": "invalid_limit"})
			}
			limit = v
		}
		if limit <= 0 {
			limit = defaultNotifLimit
		}
		if limit > maxNotifLimit {
			limit = maxNotifLimit
		}

		var before time.Time
		if raw := strings.TrimSpace(c.Query("before")); raw != "" {
			t, err := time.Parse(time.RFC3339, raw)
			if err != nil {
				return writeJSON(c, fiber.StatusBadRequest, fiber.Map{"error": "invalid_before"})
			}
			before = t
		}

		var leadID *uuid.UUID
		if raw := strings.TrimSpace(c.Query("lead_id")); raw != "" {
			id, err := uuid.Parse(raw)
			if err != nil {
				return writeJSON(c, fiber.StatusBadRequest, fiber.Map{"error": "invalid_lead_id"})
			}
			leadID = &id
		}

		start := time.Now()
		items, err := svc.ListNotifications(ctx, repository.LeadNotificationListQuery{
			Status:  status,
			Channel: channel,
			LeadID:  leadID,
			Limit:   limit,
			Before:  before,
		})
		if err != nil {
			obs.Log("admin_list_lead_notifications_failed", obs.Fields{
				"trace": obs.TraceparentFromContext(ctx),
				"status": status,
				"channel": channel,
				"has_lead_id": leadID != nil,
				"limit": limit,
				"error": err.Error(),
			})
			return writeJSON(c, fiber.StatusInternalServerError, fiber.Map{"error": "internal"})
		}
		obs.Log("admin_list_lead_notifications", obs.Fields{
			"trace": obs.TraceparentFromContext(ctx),
			"status": status,
			"channel": channel,
			"has_lead_id": leadID != nil,
			"limit": limit,
			"count": len(items),
			"dur_ms": time.Since(start).Milliseconds(),
		})

		// Admin-only operational state; avoid caches.
		c.Set("Cache-Control", "no-store")

		// Response is intentionally minimal: no lead PII, only queue state.
		return writeJSON(c, fiber.StatusOK, fiber.Map{
			"items": items,
		})
	}
}

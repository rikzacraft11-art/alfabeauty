package handler

import (
	"strconv"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"

	"example.com/alfabeauty-b2b/internal/domain/notification"
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
		status := strings.TrimSpace(strings.ToLower(c.Query("status")))
		channel := strings.TrimSpace(strings.ToLower(c.Query("channel")))

		if status != "" {
			switch status {
			case notification.StatusPending, notification.StatusProcessing, notification.StatusSent, notification.StatusFailed:
				// ok
			default:
				return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid_status"})
			}
		}
		if channel != "" {
			switch channel {
			case notification.ChannelEmail, notification.ChannelWebhook:
				// ok
			default:
				return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid_channel"})
			}
		}

		limit := defaultNotifLimit
		if raw := strings.TrimSpace(c.Query("limit")); raw != "" {
			v, err := strconv.Atoi(raw)
			if err != nil {
				return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid_limit"})
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
				return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid_before"})
			}
			before = t
		}

		var leadID *uuid.UUID
		if raw := strings.TrimSpace(c.Query("lead_id")); raw != "" {
			id, err := uuid.Parse(raw)
			if err != nil {
				return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid_lead_id"})
			}
			leadID = &id
		}

		items, err := svc.ListNotifications(c.Context(), repository.LeadNotificationListQuery{
			Status:  status,
			Channel: channel,
			LeadID:  leadID,
			Limit:   limit,
			Before:  before,
		})
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "internal"})
		}

		// Response is intentionally minimal: no lead PII, only queue state.
		return c.JSON(fiber.Map{
			"items": items,
		})
	}
}

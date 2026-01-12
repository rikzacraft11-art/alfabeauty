package handler

import (
	"strings"

	"github.com/gofiber/fiber/v2"

	"example.com/alfabeauty-b2b/pkg/metrics"
)

var allowedWebsiteEvents = map[string]struct{}{
	// Paket A (UAT): conversion events (names must be fixed / low-cardinality)
	"cta_whatsapp_click":  {},
	"cta_email_click":     {},
	"lead_submit_success": {},
	"lead_submit_error":   {},
}

type websiteEventPayload struct {
	EventName      string `json:"event_name"`
	PageURLInitial string `json:"page_url_initial"`
	PageURLCurrent string `json:"page_url_current"`
	DeviceType     string `json:"device_type"`
	// Optional fields for debugging/analysis (do not label metrics by these).
	Target string `json:"target"`
	Href   string `json:"href"`
}

// ingestWebsiteEventHandler accepts low-cardinality website analytics events.
//
// Paket A (DoD):
// - at minimum, record event "cta_whatsapp_click".
func ingestWebsiteEventHandler() fiber.Handler {
	return func(c *fiber.Ctx) error {
		var p websiteEventPayload
		if err := c.BodyParser(&p); err != nil {
			return writeJSON(c, fiber.StatusBadRequest, fiber.Map{"error": "invalid_json"})
		}

		name := strings.ToLower(strings.TrimSpace(p.EventName))
		if name == "" {
			return writeJSON(c, fiber.StatusBadRequest, fiber.Map{"error": "event_name is required"})
		}

		// Event names must be fixed and low-cardinality (Paket A A4-06).
		// Unknown event names are normalized to "unknown" instead of creating new label values.
		if _, ok := allowedWebsiteEvents[name]; !ok {
			name = "unknown"
		}

		metrics.IncWebsiteEvent(name, p.DeviceType)
		return c.SendStatus(fiber.StatusNoContent)
	}
}

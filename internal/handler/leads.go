package handler

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"strings"

	"github.com/gofiber/fiber/v2"

	"example.com/alfabeauty-b2b/internal/domain/lead"
	"example.com/alfabeauty-b2b/internal/obs"
	"example.com/alfabeauty-b2b/internal/service"
	"example.com/alfabeauty-b2b/pkg/metrics"
)

type createLeadRequest struct {
	BusinessName      string `json:"business_name"`
	ContactName       string `json:"contact_name"`
	PhoneWhatsApp     string `json:"phone_whatsapp"`
	City              string `json:"city"`
	SalonType         string `json:"salon_type"`
	Consent           bool   `json:"consent"`
	ChairCount        *int   `json:"chair_count"`
	Specialization    string `json:"specialization"`
	CurrentBrandsUsed string `json:"current_brands_used"`
	MonthlySpendRange string `json:"monthly_spend_range"`

	Email          string `json:"email"`
	Message        string `json:"message"`
	PageURLInitial string `json:"page_url_initial"`
	PageURLCurrent string `json:"page_url_current"`

	// Legacy aliases (pre Partner profiling). Kept to avoid hard breaks during transition.
	Name  string `json:"name"`
	Phone string `json:"phone"`
	// Honeypot is intentionally mapped to the JSON field "company" as an anti-spam measure.
	// IMPORTANT FOR API/FRONTEND CONSUMERS:
	//   - This field must NOT be displayed in any UI.
	//   - This field must NOT be auto-filled or pre-populated.
	//   - It should be kept hidden from real users and is only used for spam detection.
	Honeypot       string `json:"company"`
}

func createLeadHandler(svc *service.LeadService) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var req createLeadRequest
		if err := c.BodyParser(&req); err != nil {
			metrics.IncLeadSubmission("invalid_json")
			return writeJSON(c, fiber.StatusBadRequest, fiber.Map{"error": "invalid_json"})
		}

		idempotencyKeyHash := hashIdempotencyKey(c.Get("Idempotency-Key"))

		contactName := req.ContactName
		if contactName == "" {
			contactName = req.Name
		}
		phoneWhatsApp := req.PhoneWhatsApp
		if phoneWhatsApp == "" {
			phoneWhatsApp = req.Phone
		}

		l := lead.Lead{
			IdempotencyKeyHash: idempotencyKeyHash,
			BusinessName:      req.BusinessName,
			ContactName:       contactName,
			PhoneWhatsApp:     phoneWhatsApp,
			City:              req.City,
			SalonType:         req.SalonType,
			Consent:           req.Consent,
			ChairCount:        req.ChairCount,
			Specialization:    req.Specialization,
			CurrentBrandsUsed: req.CurrentBrandsUsed,
			MonthlySpendRange: req.MonthlySpendRange,

			Email:          req.Email,
			Message:        req.Message,
			PageURLInitial: req.PageURLInitial,
			PageURLCurrent: req.PageURLCurrent,
			UserAgent:      c.Get("User-Agent"),
			IPAddress:      c.IP(),
			Honeypot:       req.Honeypot,
		}

		var ctx context.Context = c.Context()
		if tp, ok := c.Locals("traceparent").(string); ok {
			ctx = obs.WithTraceparent(ctx, tp)
		}

		created, err := svc.Create(ctx, l)
		if err != nil {
			if errors.Is(err, lead.ErrSpam) {
				metrics.IncLeadSubmission("spam")
				// Do not give bots signal.
				return c.SendStatus(fiber.StatusAccepted)
			}
			if lead.IsInvalid(err) {
				metrics.IncLeadSubmission("invalid")
				return writeJSON(c, fiber.StatusBadRequest, fiber.Map{"error": err.Error()})
			}
			metrics.IncLeadSubmission("internal")
			return writeJSON(c, fiber.StatusInternalServerError, fiber.Map{"error": "internal"})
		}

		metrics.IncLeadSubmission("accepted")

		return writeJSON(c, fiber.StatusAccepted, fiber.Map{
			"status": "accepted",
			"id":     created.ID.String(),
		})
	}
}

func hashIdempotencyKey(raw string) string {
	raw = strings.TrimSpace(raw)
	if raw == "" {
		return ""
	}
	sum := sha256.Sum256([]byte(raw))
	return hex.EncodeToString(sum[:])
}

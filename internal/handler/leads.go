package handler

import (
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"strings"

	"github.com/gofiber/fiber/v2"

	"example.com/alfabeauty-b2b/internal/domain/lead"
	"example.com/alfabeauty-b2b/internal/service"
)

type createLeadRequest struct {
	Name           string `json:"name"`
	Email          string `json:"email"`
	Phone          string `json:"phone"`
	Message        string `json:"message"`
	PageURLInitial string `json:"page_url_initial"`
	PageURLCurrent string `json:"page_url_current"`
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
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid_json"})
		}

		idempotencyKeyHash := hashIdempotencyKey(c.Get("Idempotency-Key"))

		l := lead.Lead{
			IdempotencyKeyHash: idempotencyKeyHash,
			Name:           req.Name,
			Email:          req.Email,
			Phone:          req.Phone,
			Message:        req.Message,
			PageURLInitial: req.PageURLInitial,
			PageURLCurrent: req.PageURLCurrent,
			UserAgent:      c.Get("User-Agent"),
			IPAddress:      c.IP(),
			Honeypot:       req.Honeypot,
		}

		created, err := svc.Create(c.Context(), l)
		if err != nil {
			if errors.Is(err, lead.ErrSpam) {
				// Do not give bots signal.
				return c.SendStatus(fiber.StatusAccepted)
			}
			if lead.IsInvalid(err) {
				return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
			}
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "internal"})
		}

		return c.Status(fiber.StatusAccepted).JSON(fiber.Map{
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

package handler

import (
	"encoding/json"
	"strings"

	"github.com/gofiber/fiber/v2"
)

const jsonUTF8 = "application/json; charset=utf-8"

// writeJSON writes a JSON response with an explicit UTF-8 charset.
// Fiber's c.JSON uses "application/json" by default; Paket A §15 expects charset.
func writeJSON(c *fiber.Ctx, status int, v any) error {
	b, err := json.Marshal(v)
	if err != nil {
		// Avoid leaking internal errors.
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	c.Status(status)
	c.Set(fiber.HeaderContentType, jsonUTF8)
	return c.Send(b)
}

// requireJSONContentType enforces Content-Type: application/json for endpoints
// that parse a JSON body. This avoids ambiguous parsing and improves input
// hardening (Paket A security posture).
func requireJSONContentType() fiber.Handler {
	return func(c *fiber.Ctx) error {
		// Fiber's c.Is("json") checks Content-Type for JSON. We keep it strict
		// (no parsing attempts for text/plain, form-encoded, etc.).
		if c.Is("json") {
			return c.Next()
		}

		// Some clients send Content-Type with extra parameters; be tolerant to
		// explicit application/json even if Fiber's Is() changes behavior.
		ct := strings.ToLower(strings.TrimSpace(c.Get(fiber.HeaderContentType)))
		if strings.HasPrefix(ct, "application/json") {
			return c.Next()
		}

		return writeJSON(c, fiber.StatusUnsupportedMediaType, fiber.Map{
			"error": "content_type_must_be_application_json",
		})
	}
}

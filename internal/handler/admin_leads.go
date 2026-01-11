package handler

import (
	"bytes"
	"crypto/subtle"
	"encoding/csv"
	"strconv"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"

	"example.com/alfabeauty-b2b/internal/service"
)

const (
	defaultExportLimit = 500
	maxExportLimit     = 5000
)

func requireAdminToken(expected string) fiber.Handler {
	expected = strings.TrimSpace(expected)

	return func(c *fiber.Ctx) error {
		token := strings.TrimSpace(c.Get("X-Admin-Token"))
		if token == "" {
			auth := strings.TrimSpace(c.Get("Authorization"))
			if strings.HasPrefix(auth, "Bearer ") {
				token = strings.TrimSpace(strings.TrimPrefix(auth, "Bearer "))
			}
		}

		if !secureEquals(token, expected) {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "unauthorized"})
		}

		return c.Next()
	}
}

func exportLeadsCSVHandler(svc *service.LeadService) fiber.Handler {
	return func(c *fiber.Ctx) error {
		limit := defaultExportLimit
		if raw := strings.TrimSpace(c.Query("limit")); raw != "" {
			v, err := strconv.Atoi(raw)
			if err != nil {
				return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid_limit"})
			}
			limit = v
		}
		if limit <= 0 {
			limit = defaultExportLimit
		}
		if limit > maxExportLimit {
			limit = maxExportLimit
		}

		var before time.Time
		if raw := strings.TrimSpace(c.Query("before")); raw != "" {
			t, err := time.Parse(time.RFC3339, raw)
			if err != nil {
				return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid_before"})
			}
			before = t
		}

		leads, err := svc.List(c.Context(), limit, before)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "internal"})
		}

		var buf bytes.Buffer
		w := csv.NewWriter(&buf)

		_ = w.Write([]string{
			"id",
			"created_at",
			"name",
			"email",
			"phone",
			"message",
			"page_url_initial",
			"page_url_current",
		})

		for _, l := range leads {
			_ = w.Write([]string{
				l.ID.String(),
				l.CreatedAt.UTC().Format(time.RFC3339Nano),
				csvSafe(l.Name),
				csvSafe(l.Email),
				csvSafe(l.Phone),
				csvSafe(l.Message),
				csvSafe(l.PageURLInitial),
				csvSafe(l.PageURLCurrent),
			})
		}

		w.Flush()
		if err := w.Error(); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "internal"})
		}

		c.Set(fiber.HeaderContentType, "text/csv; charset=utf-8")
		c.Set(fiber.HeaderContentDisposition, "attachment; filename=leads.csv")
		return c.Send(buf.Bytes())
	}
}

func csvSafe(s string) string {
	// Mitigate CSV formula injection in spreadsheet apps.
	// https://owasp.org/www-community/attacks/CSV_Injection
	s = strings.TrimSpace(s)
	if s == "" {
		return ""
	}

	switch s[0] {
	case '=', '+', '-', '@':
		return "'" + s
	default:
		return s
	}
}

func secureEquals(a, b string) bool {
	// Constant-time-ish compare. Length leaks are acceptable here; token is high-entropy.
	// Still: avoid early-return equality checks.
	ab := []byte(a)
	bb := []byte(b)
	if len(ab) != len(bb) {
		// Compare with itself to keep timing consistent-ish.
		_ = subtle.ConstantTimeCompare(ab, ab)
		return false
	}
	return subtle.ConstantTimeCompare(ab, bb) == 1
}

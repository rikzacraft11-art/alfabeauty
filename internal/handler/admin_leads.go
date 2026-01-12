package handler

import (
	"bytes"
	"context"
	"crypto/subtle"
	"encoding/csv"
	"strconv"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"

	"example.com/alfabeauty-b2b/internal/obs"
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
			return writeJSON(c, fiber.StatusUnauthorized, fiber.Map{"error": "unauthorized"})
		}

		return c.Next()
	}
}

func exportLeadsCSVHandler(svc *service.LeadService) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var ctx context.Context = c.Context()
		if tp, ok := c.Locals("traceparent").(string); ok {
			ctx = obs.WithTraceparent(ctx, tp)
		}

		limit := defaultExportLimit
		if raw := strings.TrimSpace(c.Query("limit")); raw != "" {
			v, err := strconv.Atoi(raw)
			if err != nil {
				return writeJSON(c, fiber.StatusBadRequest, fiber.Map{"error": "invalid_limit"})
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
				return writeJSON(c, fiber.StatusBadRequest, fiber.Map{"error": "invalid_before"})
			}
			before = t
		}

		start := time.Now()
		leads, err := svc.List(ctx, limit, before)
		if err != nil {
			obs.Log("admin_export_leads_failed", obs.Fields{
				"trace": obs.TraceparentFromContext(ctx),
				"limit": limit,
				"error": err.Error(),
			})
			return writeJSON(c, fiber.StatusInternalServerError, fiber.Map{"error": "internal"})
		}
		obs.Log("admin_export_leads", obs.Fields{
			"trace": obs.TraceparentFromContext(ctx),
			"limit": limit,
			"count": len(leads),
			"dur_ms": time.Since(start).Milliseconds(),
		})

		var buf bytes.Buffer
		w := csv.NewWriter(&buf)

		_ = w.Write([]string{
			"id",
			"created_at",
			"business_name",
			"contact_name",
			"phone_whatsapp",
			"city",
			"salon_type",
			"consent",
			"chair_count",
			"specialization",
			"current_brands_used",
			"monthly_spend_range",
			"email",
			"message",
			"page_url_initial",
			"page_url_current",
		})

		for _, l := range leads {
			chair := ""
			if l.ChairCount != nil {
				chair = strconv.Itoa(*l.ChairCount)
			}
			_ = w.Write([]string{
				l.ID.String(),
				l.CreatedAt.UTC().Format(time.RFC3339Nano),
				csvSafe(l.BusinessName),
				csvSafe(l.ContactName),
				csvSafe(l.PhoneWhatsApp),
				csvSafe(l.City),
				csvSafe(l.SalonType),
				strconv.FormatBool(l.Consent),
				chair,
				csvSafe(l.Specialization),
				csvSafe(l.CurrentBrandsUsed),
				csvSafe(l.MonthlySpendRange),
				csvSafe(l.Email),
				csvSafe(l.Message),
				csvSafe(l.PageURLInitial),
				csvSafe(l.PageURLCurrent),
			})
		}

		w.Flush()
		if err := w.Error(); err != nil {
			return writeJSON(c, fiber.StatusInternalServerError, fiber.Map{"error": "internal"})
		}

		c.Set("Cache-Control", "no-store")
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

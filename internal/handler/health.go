package handler

import (
	"github.com/gofiber/fiber/v2"

	"example.com/alfabeauty-b2b/internal/config"
)

func healthHandler(cfg config.Config) fiber.Handler {
	return func(c *fiber.Ctx) error {
		return writeJSON(c, fiber.StatusOK, fiber.Map{
			"status": "ok",
			"env":    cfg.Env,
			"runtime": fiber.Map{
				"host": cfg.Host,
				"port": cfg.Port,
			},
			"features": fiber.Map{
				"notify_email_enabled":   cfg.NotifyEmailEnabled,
				"notify_webhook_enabled": cfg.NotifyWebhookEnabled,
				"awin_enabled":           cfg.AwinEnabled,
			},
		})
	}
}

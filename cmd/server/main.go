package main

import (
	"context"
	"os"
	"os/signal"
	"strings"
	"syscall"

	"github.com/joho/godotenv"

	"example.com/alfabeauty-b2b/internal/config"
	"example.com/alfabeauty-b2b/internal/database"
	"example.com/alfabeauty-b2b/internal/handler"
	"example.com/alfabeauty-b2b/internal/obs"
	"example.com/alfabeauty-b2b/internal/notify"
	"example.com/alfabeauty-b2b/internal/repository"
	"example.com/alfabeauty-b2b/internal/repository/memory"
	"example.com/alfabeauty-b2b/internal/repository/postgres"
	"example.com/alfabeauty-b2b/internal/service"
)

func main() {
	obs.Init()

	// Best-effort local dev convenience. In containers/CI, env should be injected.
	_, _ = os.Stat(".env")
	_ = godotenv.Load()

	cfg, err := config.LoadFromEnv()
	if err != nil {
		obs.Fatal("startup_error", obs.Fields{"stage": "config", "error": err.Error()})
	}

	obs.Log("startup", obs.Fields{
		"env":                        cfg.Env,
		"addr":                       cfg.Addr(),
		"notify_email_enabled":       cfg.NotifyEmailEnabled,
		"notify_webhook_enabled":     cfg.NotifyWebhookEnabled,
		"awin_enabled":               cfg.AwinEnabled,
		"trusted_proxies_configured": strings.TrimSpace(cfg.TrustedProxies) != "",
		"persistence": func() string {
			if strings.TrimSpace(cfg.DatabaseURL) != "" && cfg.DatabaseURL != "__CHANGE_ME__" {
				return "postgres"
			}
			return "memory"
		}(),
	})

	var leadRepo repository.LeadRepository
	var notifRepo repository.LeadNotificationRepository
	var senders []notify.ChannelSender

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	sigCh := make(chan os.Signal, 1)
	signal.Notify(sigCh, os.Interrupt, syscall.SIGTERM)
	go func() {
		<-sigCh
		cancel()
	}()

	if cfg.DatabaseURL != "" && cfg.DatabaseURL != "__CHANGE_ME__" {
		db, err := database.OpenPostgres(cfg.DatabaseURL)
		if err != nil {
			obs.Fatal("startup_error", obs.Fields{"stage": "database", "error": err.Error()})
		}
		defer db.Close()

		leadRepo = postgres.NewLeadRepository(db)
		notifRepo = postgres.NewLeadNotificationRepository(db)
		obs.Log("repo_selected", obs.Fields{"lead_repo": "postgres"})
	} else {
		leadRepo = memory.NewLeadRepository()
		notifRepo = memory.NewLeadNotificationRepository()
		obs.Log("repo_selected", obs.Fields{"lead_repo": "memory"})
	}

	// Notification senders (optional).
	if cfg.NotifyEmailEnabled {
		recipients := splitCSV(cfg.SMTPToCSV)
		senders = append(senders, notify.NewEmailSender(notify.EmailConfig{
			Host:     cfg.SMTPHost,
			Port:     cfg.SMTPPort,
			Username: cfg.SMTPUsername,
			Password: cfg.SMTPPassword,
			From:     cfg.SMTPFrom,
			To:       recipients,
			UseTLS:   cfg.SMTPUseTLS,
		}))
		obs.Log("notify_enabled", obs.Fields{"channel": "email"})
	}
	if cfg.NotifyWebhookEnabled {
		senders = append(senders, notify.NewWebhookSender(notify.WebhookConfig{
			URL:    cfg.WebhookURL,
			Secret: cfg.WebhookSecret,
		}))
		obs.Log("notify_enabled", obs.Fields{"channel": "webhook"})
	}

	leadSvc := service.NewLeadServiceWithNotifications(leadRepo, notifRepo, cfg.NotifyEmailEnabled, cfg.NotifyWebhookEnabled)

	if notifRepo != nil && len(senders) > 0 {
		w := notify.NewWorker(notifRepo, leadRepo, senders)
		go w.Run(ctx)
		obs.Log("worker_started", obs.Fields{"worker": "notification"})
	}

	app := handler.NewApp(cfg, leadSvc)
	go func() {
		<-ctx.Done()
		_ = app.Shutdown()
	}()

	obs.Log("listen", obs.Fields{"addr": cfg.Addr()})
	if err := app.Listen(cfg.Addr()); err != nil {
		obs.Fatal("server_stopped", obs.Fields{"error": err.Error()})
	}
}

func splitCSV(s string) []string {
	parts := strings.Split(s, ",")
	res := make([]string, 0, len(parts))
	for _, p := range parts {
		p = strings.TrimSpace(p)
		if p == "" {
			continue
		}
		res = append(res, p)
	}
	return res
}

package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"strings"
	"syscall"

	"github.com/joho/godotenv"

	"example.com/alfabeauty-b2b/internal/config"
	"example.com/alfabeauty-b2b/internal/database"
	"example.com/alfabeauty-b2b/internal/handler"
	"example.com/alfabeauty-b2b/internal/notify"
	"example.com/alfabeauty-b2b/internal/repository"
	"example.com/alfabeauty-b2b/internal/repository/memory"
	"example.com/alfabeauty-b2b/internal/repository/postgres"
	"example.com/alfabeauty-b2b/internal/service"
)

func main() {
	// Best-effort local dev convenience. In containers/CI, env should be injected.
	_, _ = os.Stat(".env")
	_ = godotenv.Load()

	cfg, err := config.LoadFromEnv()
	if err != nil {
		log.Fatalf("config error: %v", err)
	}

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
			log.Fatalf("database error: %v", err)
		}
		defer db.Close()

		leadRepo = postgres.NewLeadRepository(db)
		notifRepo = postgres.NewLeadNotificationRepository(db)
		log.Printf("lead repository: postgres")
	} else {
		leadRepo = memory.NewLeadRepository()
		notifRepo = memory.NewLeadNotificationRepository()
		log.Printf("lead repository: memory")
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
		log.Printf("lead notifications: email enabled")
	}
	if cfg.NotifyWebhookEnabled {
		senders = append(senders, notify.NewWebhookSender(notify.WebhookConfig{
			URL:    cfg.WebhookURL,
			Secret: cfg.WebhookSecret,
		}))
		log.Printf("lead notifications: webhook enabled")
	}

	leadSvc := service.NewLeadServiceWithNotifications(leadRepo, notifRepo, cfg.NotifyEmailEnabled, cfg.NotifyWebhookEnabled)

	if notifRepo != nil && len(senders) > 0 {
		w := notify.NewWorker(notifRepo, leadRepo, senders)
		go w.Run(ctx)
		log.Printf("notification worker started")
	}

	app := handler.NewApp(cfg, leadSvc)
	go func() {
		<-ctx.Done()
		_ = app.Shutdown()
	}()

	log.Printf("listening on %s", cfg.Addr())
	if err := app.Listen(cfg.Addr()); err != nil {
		log.Fatalf("server stopped: %v", err)
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

package config

import (
	"fmt"
	"os"
	"strconv"
	"strings"
)

type Config struct {
	Env            string
	Host           string
	Port           string
	AdminToken     string
	RateLimitRPS   int
	MaxBodyBytes   int
	AnalyticsURL   string
	SentryDSN      string
	DatabaseURL    string
	TrustedProxies string

	AwinEnabled bool
	AwinToken   string

	NotifyEmailEnabled   bool
	NotifyWebhookEnabled bool

	SMTPHost     string
	SMTPPort     int
	SMTPUsername string
	SMTPPassword string
	SMTPFrom     string
	SMTPToCSV    string
	SMTPUseTLS   bool

	WebhookURL    string
	WebhookSecret string
}

func (c Config) Addr() string {
	host := strings.TrimSpace(c.Host)
	port := strings.TrimSpace(c.Port)
	if port == "" {
		port = "8080"
	}
	if host == "" {
		return ":" + port
	}
	return host + ":" + port
}

func LoadFromEnv() (Config, error) {
	cfg := Config{}

	cfg.Env = strings.TrimSpace(getenvDefault("APP_ENV", "development"))
	cfg.Host = strings.TrimSpace(getenvDefault("HOST", "0.0.0.0"))
	cfg.Port = strings.TrimSpace(getenvDefault("PORT", "8080"))

	cfg.AdminToken = strings.TrimSpace(os.Getenv("LEAD_API_ADMIN_TOKEN"))

	var err error
	cfg.RateLimitRPS, err = intFromEnv("LEAD_API_RATE_LIMIT_RPS", 5)
	if err != nil {
		return Config{}, err
	}
	cfg.MaxBodyBytes, err = intFromEnv("LEAD_API_MAX_BODY_BYTES", 65536)
	if err != nil {
		return Config{}, err
	}

	cfg.AnalyticsURL = strings.TrimSpace(os.Getenv("ANALYTICS_ENDPOINT_URL"))
	cfg.SentryDSN = strings.TrimSpace(os.Getenv("SENTRY_DSN"))

	cfg.DatabaseURL = strings.TrimSpace(os.Getenv("DATABASE_URL"))
	cfg.TrustedProxies = strings.TrimSpace(os.Getenv("TRUSTED_PROXIES"))

	cfg.AwinEnabled = strings.TrimSpace(strings.ToLower(os.Getenv("LEAD_API_AWIN_ENABLED"))) == "true"
	cfg.AwinToken = strings.TrimSpace(os.Getenv("LEAD_API_AWIN_TOKEN"))

	cfg.NotifyEmailEnabled = strings.TrimSpace(strings.ToLower(os.Getenv("LEAD_NOTIFY_EMAIL_ENABLED"))) == "true"
	cfg.NotifyWebhookEnabled = strings.TrimSpace(strings.ToLower(os.Getenv("LEAD_NOTIFY_WEBHOOK_ENABLED"))) == "true"

	cfg.SMTPHost = strings.TrimSpace(os.Getenv("SMTP_HOST"))
	cfg.SMTPPort, err = intFromEnv("SMTP_PORT", 0)
	if err != nil {
		return Config{}, err
	}
	cfg.SMTPUsername = strings.TrimSpace(os.Getenv("SMTP_USERNAME"))
	cfg.SMTPPassword = strings.TrimSpace(os.Getenv("SMTP_PASSWORD"))
	cfg.SMTPFrom = strings.TrimSpace(os.Getenv("SMTP_FROM"))
	cfg.SMTPToCSV = strings.TrimSpace(os.Getenv("SMTP_TO"))
	cfg.SMTPUseTLS = strings.TrimSpace(strings.ToLower(os.Getenv("SMTP_USE_TLS"))) == "true"

	cfg.WebhookURL = strings.TrimSpace(os.Getenv("GOOGLE_SHEETS_WEBHOOK_URL"))
	cfg.WebhookSecret = strings.TrimSpace(os.Getenv("GOOGLE_SHEETS_WEBHOOK_SECRET"))

	// Minimal safety checks.
	if cfg.MaxBodyBytes <= 0 {
		return Config{}, fmt.Errorf("LEAD_API_MAX_BODY_BYTES must be > 0")
	}
	if cfg.RateLimitRPS <= 0 {
		return Config{}, fmt.Errorf("LEAD_API_RATE_LIMIT_RPS must be > 0")
	}
	if cfg.AdminToken == "" {
		return Config{}, fmt.Errorf("LEAD_API_ADMIN_TOKEN is required")
	}
	if isPlaceholder(cfg.AdminToken) {
		// Allow running in dev, but fail fast elsewhere.
		if cfg.Env != "development" {
			return Config{}, fmt.Errorf("LEAD_API_ADMIN_TOKEN must be set to a real secret (got placeholder)")
		}
	}

	// Optional integration guard: fail fast if explicitly enabled but token is missing/placeholder.
	// This prevents non-obvious runtime failures after the service is already running.
	if cfg.AwinEnabled {
		if cfg.AwinToken == "" {
			return Config{}, fmt.Errorf("LEAD_API_AWIN_TOKEN is required when LEAD_API_AWIN_ENABLED=true")
		}
		if isPlaceholder(cfg.AwinToken) {
			return Config{}, fmt.Errorf("LEAD_API_AWIN_TOKEN must be set to a real secret (got placeholder)")
		}
	}

	// Paket A hard gate: lead must be persisted (durable) before acknowledging success.
	// Therefore, non-development environments must not silently fall back to in-memory repositories.
	if cfg.Env != "development" {
		if strings.TrimSpace(cfg.DatabaseURL) == "" {
			return Config{}, fmt.Errorf("DATABASE_URL is required when APP_ENV!=development (durable lead persistence is mandatory)")
		}
		if isPlaceholder(cfg.DatabaseURL) {
			return Config{}, fmt.Errorf("DATABASE_URL must be set to a real database url when APP_ENV!=development (got placeholder)")
		}
	}

	// Notification config validation.
	if cfg.NotifyEmailEnabled {
		if cfg.SMTPHost == "" {
			return Config{}, fmt.Errorf("SMTP_HOST is required when LEAD_NOTIFY_EMAIL_ENABLED=true")
		}
		if cfg.SMTPPort <= 0 {
			return Config{}, fmt.Errorf("SMTP_PORT is required when LEAD_NOTIFY_EMAIL_ENABLED=true")
		}
		if cfg.SMTPFrom == "" {
			return Config{}, fmt.Errorf("SMTP_FROM is required when LEAD_NOTIFY_EMAIL_ENABLED=true")
		}
		if cfg.SMTPToCSV == "" {
			return Config{}, fmt.Errorf("SMTP_TO is required when LEAD_NOTIFY_EMAIL_ENABLED=true")
		}
	}
	if cfg.NotifyWebhookEnabled {
		if cfg.WebhookURL == "" {
			return Config{}, fmt.Errorf("GOOGLE_SHEETS_WEBHOOK_URL is required when LEAD_NOTIFY_WEBHOOK_ENABLED=true")
		}
	}

	return cfg, nil
}

func getenvDefault(key, def string) string {
	v := strings.TrimSpace(os.Getenv(key))
	if v == "" {
		return def
	}
	return v
}

func intFromEnv(key string, def int) (int, error) {
	raw := strings.TrimSpace(os.Getenv(key))
	if raw == "" {
		return def, nil
	}
	v, err := strconv.Atoi(raw)
	if err != nil {
		return 0, fmt.Errorf("invalid %s: %w", key, err)
	}
	return v, nil
}

func isPlaceholder(s string) bool {
	s = strings.TrimSpace(strings.ToUpper(s))
	return s == "__CHANGE_ME__" || strings.Contains(s, "CHANGE_ME")
}

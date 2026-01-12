package config

import (
	"os"
	"strings"
	"testing"
)

func TestLoadFromEnv_Minimum(t *testing.T) {
	t.Setenv("LEAD_API_ADMIN_TOKEN", "dev-secret")
	t.Setenv("LEAD_API_RATE_LIMIT_RPS", "5")
	t.Setenv("LEAD_API_MAX_BODY_BYTES", "123")
	t.Setenv("PORT", "9999")

	cfg, err := LoadFromEnv()
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if cfg.Port != "9999" {
		t.Fatalf("expected port 9999, got %q", cfg.Port)
	}
	if cfg.MaxBodyBytes != 123 {
		t.Fatalf("expected max body 123, got %d", cfg.MaxBodyBytes)
	}
	if cfg.RateLimitRPS != 5 {
		t.Fatalf("expected rps 5, got %d", cfg.RateLimitRPS)
	}
}

func TestLoadFromEnv_MissingAdminToken(t *testing.T) {
	_ = os.Unsetenv("LEAD_API_ADMIN_TOKEN")
	_, err := LoadFromEnv()
	if err == nil {
		t.Fatalf("expected error")
	}
}

func TestLoadFromEnv_NonDevRequiresDatabaseURL(t *testing.T) {
	t.Setenv("APP_ENV", "production")
	t.Setenv("LEAD_API_ADMIN_TOKEN", "super-secret-admin-token")
	t.Setenv("DATABASE_URL", "")

	_, err := LoadFromEnv()
	if err == nil {
		t.Fatalf("expected error")
	}
	if got, want := err.Error(), "DATABASE_URL is required"; !strings.Contains(got, want) {
		t.Fatalf("expected error to contain %q, got %q", want, got)
	}
}

func TestLoadFromEnv_NonDevRejectsPlaceholderDatabaseURL(t *testing.T) {
	t.Setenv("APP_ENV", "staging")
	t.Setenv("LEAD_API_ADMIN_TOKEN", "super-secret-admin-token")
	t.Setenv("DATABASE_URL", "__CHANGE_ME__")

	_, err := LoadFromEnv()
	if err == nil {
		t.Fatalf("expected error")
	}
	if got, want := err.Error(), "DATABASE_URL must be set"; !strings.Contains(got, want) {
		t.Fatalf("expected error to contain %q, got %q", want, got)
	}
}

func TestLoadFromEnv_NonDevRejectsPlaceholderAdminToken(t *testing.T) {
	t.Setenv("APP_ENV", "production")
	t.Setenv("LEAD_API_ADMIN_TOKEN", "__CHANGE_ME__")
	t.Setenv("DATABASE_URL", "postgres://user:pass@localhost:5432/db")

	_, err := LoadFromEnv()
	if err == nil {
		t.Fatalf("expected error")
	}
	if got, want := err.Error(), "LEAD_API_ADMIN_TOKEN must be set"; !strings.Contains(got, want) {
		t.Fatalf("expected error to contain %q, got %q", want, got)
	}
}

func TestLoadFromEnv_DevAllowsPlaceholderAdminToken(t *testing.T) {
	t.Setenv("APP_ENV", "development")
	t.Setenv("LEAD_API_ADMIN_TOKEN", "__CHANGE_ME__")

	_, err := LoadFromEnv()
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
}

func TestLoadFromEnv_AwinEnabledRequiresRealToken(t *testing.T) {
	t.Setenv("LEAD_API_ADMIN_TOKEN", "dev-secret")
	t.Setenv("LEAD_API_AWIN_ENABLED", "true")
	t.Setenv("LEAD_API_AWIN_TOKEN", "")

	_, err := LoadFromEnv()
	if err == nil {
		t.Fatalf("expected error")
	}
	if got, want := err.Error(), "LEAD_API_AWIN_TOKEN is required"; !strings.Contains(got, want) {
		t.Fatalf("expected error to contain %q, got %q", want, got)
	}

	t.Setenv("LEAD_API_AWIN_TOKEN", "__CHANGE_ME__")
	_, err = LoadFromEnv()
	if err == nil {
		t.Fatalf("expected error")
	}
	if got, want := err.Error(), "LEAD_API_AWIN_TOKEN must be set"; !strings.Contains(got, want) {
		t.Fatalf("expected error to contain %q, got %q", want, got)
	}
}

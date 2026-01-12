package handler

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"example.com/alfabeauty-b2b/internal/config"
	"example.com/alfabeauty-b2b/internal/repository/memory"
	"example.com/alfabeauty-b2b/internal/service"
)

func TestTraceparent_GeneratedWhenMissing(t *testing.T) {
	cfg := config.Config{MaxBodyBytes: 1024, RateLimitRPS: 5, AdminToken: "secret"}
	leadSvc := service.NewLeadService(memory.NewLeadRepository())
	app := NewApp(cfg, leadSvc)

	req := httptest.NewRequest(http.MethodGet, "/health", nil)
	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("app.Test: %v", err)
	}

	tp := strings.TrimSpace(resp.Header.Get("traceparent"))
	if tp == "" {
		t.Fatalf("expected traceparent header to be set")
	}
	parts := strings.Split(tp, "-")
	if len(parts) != 4 {
		t.Fatalf("expected 4 traceparent parts, got %d: %q", len(parts), tp)
	}
	if parts[0] == "" || parts[1] == "" || parts[2] == "" || parts[3] == "" {
		t.Fatalf("expected non-empty traceparent parts, got %q", tp)
	}
}

func TestTraceparent_EchoedWhenProvided(t *testing.T) {
	cfg := config.Config{MaxBodyBytes: 1024, RateLimitRPS: 5, AdminToken: "secret"}
	leadSvc := service.NewLeadService(memory.NewLeadRepository())
	app := NewApp(cfg, leadSvc)

	incoming := "00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01"
	req := httptest.NewRequest(http.MethodGet, "/health", nil)
	req.Header.Set("traceparent", incoming)

	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("app.Test: %v", err)
	}
	if got := strings.TrimSpace(resp.Header.Get("traceparent")); got != incoming {
		t.Fatalf("expected traceparent echoed, got %q", got)
	}
}

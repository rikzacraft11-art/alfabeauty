package handler

import (
	"bytes"
	"net/http"
	"net/http/httptest"
	"io"
	"strings"
	"testing"

	"example.com/alfabeauty-b2b/internal/config"
	"example.com/alfabeauty-b2b/internal/repository/memory"
	"example.com/alfabeauty-b2b/internal/service"
)

func TestMetrics_Unauthorized(t *testing.T) {
	cfg := config.Config{MaxBodyBytes: 1024, RateLimitRPS: 5, AdminToken: "secret"}
	leadRepo := memory.NewLeadRepository()
	notifRepo := memory.NewLeadNotificationRepository()
	leadSvc := service.NewLeadServiceWithNotifications(leadRepo, notifRepo, true, true)
	app := NewApp(cfg, leadSvc)

	req := httptest.NewRequest(http.MethodGet, "/metrics", nil)
	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("app.Test: %v", err)
	}
	if resp.StatusCode != http.StatusUnauthorized {
		t.Fatalf("expected 401, got %d", resp.StatusCode)
	}
}

func TestMetrics_ContainsLeadPipelineMetrics(t *testing.T) {
	cfg := config.Config{MaxBodyBytes: 1024, RateLimitRPS: 5, AdminToken: "secret"}
	leadRepo := memory.NewLeadRepository()
	notifRepo := memory.NewLeadNotificationRepository()
	leadSvc := service.NewLeadServiceWithNotifications(leadRepo, notifRepo, true, true)
	app := NewApp(cfg, leadSvc)

	// Drive at least one lead submission through HTTP handler to increment the counter.
	payload := []byte(`{"name":"A","email":"a@example.com","message":"Hello"}`)
	post := httptest.NewRequest(http.MethodPost, "/api/v1/leads", bytes.NewReader(payload))
	post.Header.Set("Content-Type", "application/json")
	postResp, err := app.Test(post)
	if err != nil {
		t.Fatalf("post: %v", err)
	}
	_ = postResp.Body.Close()

	req := httptest.NewRequest(http.MethodGet, "/metrics", nil)
	req.Header.Set("X-Admin-Token", "secret")

	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("app.Test: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		b, _ := io.ReadAll(resp.Body)
		t.Fatalf("expected 200, got %d: %s", resp.StatusCode, string(b))
	}

	b, _ := io.ReadAll(resp.Body)
	body := string(b)

	// Names are stable and intentionally ops-friendly.
	if !strings.Contains(body, "lead_api_lead_submissions_total") {
		t.Fatalf("expected lead submissions metric")
	}
	if !strings.Contains(body, "lead_api_lead_notifications_pending_ready_total") {
		t.Fatalf("expected pending ready backlog metric")
	}
	if !strings.Contains(body, "lead_api_lead_notifications_oldest_ready_pending_age_seconds") {
		t.Fatalf("expected oldest ready pending age metric")
	}
	if !strings.Contains(body, "lead_api_http_requests_total") {
		t.Fatalf("expected http requests total metric")
	}
}

func TestMetrics_LeadRateLimitedIsCounted(t *testing.T) {
	// Configure a tight limiter so we reliably trigger 429.
	cfg := config.Config{MaxBodyBytes: 1024, RateLimitRPS: 1, AdminToken: "secret"}
	leadRepo := memory.NewLeadRepository()
	notifRepo := memory.NewLeadNotificationRepository()
	leadSvc := service.NewLeadServiceWithNotifications(leadRepo, notifRepo, true, true)
	app := NewApp(cfg, leadSvc)

	// Burst a handful of requests within the same second.
	payload := []byte(`{"name":"A","email":"a@example.com","message":"Hello"}`)
	for i := 0; i < 10; i++ {
		req := httptest.NewRequest(http.MethodPost, "/api/v1/leads", bytes.NewReader(payload))
		req.Header.Set("Content-Type", "application/json")
		resp, err := app.Test(req)
		if err != nil {
			t.Fatalf("post %d: %v", i, err)
		}
		_ = resp.Body.Close()
	}

	metricsReq := httptest.NewRequest(http.MethodGet, "/metrics", nil)
	metricsReq.Header.Set("X-Admin-Token", "secret")
	metricsResp, err := app.Test(metricsReq)
	if err != nil {
		t.Fatalf("metrics: %v", err)
	}
	if metricsResp.StatusCode != http.StatusOK {
		b, _ := io.ReadAll(metricsResp.Body)
		t.Fatalf("expected 200, got %d: %s", metricsResp.StatusCode, string(b))
	}

	b, _ := io.ReadAll(metricsResp.Body)
	body := string(b)
	if !strings.Contains(body, `lead_api_lead_submissions_total{result="rate_limited"}`) {
		t.Fatalf("expected rate_limited series to exist")
	}
}

package handler

import (
	"bytes"
	"io"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"example.com/alfabeauty-b2b/internal/config"
	"example.com/alfabeauty-b2b/internal/repository/memory"
	"example.com/alfabeauty-b2b/internal/service"
)

func TestWebsiteEvents_Ingest_OK(t *testing.T) {
	cfg := config.Config{MaxBodyBytes: 1024 * 8, RateLimitRPS: 5, AdminToken: "secret"}
	repo := memory.NewLeadRepository()
	leadSvc := service.NewLeadService(repo)
	app := NewApp(cfg, leadSvc)

	payload := []byte(`{"event_name":"cta_whatsapp_click","page_url_current":"http://localhost:3000/","device_type":"desktop"}`)
	// NOTE: This is a Go raw string literal, so do NOT escape quotes.
	payload = []byte(`{"event_name":"cta_whatsapp_click","page_url_current":"http://localhost:3000/","device_type":"desktop"}`)
	req := httptest.NewRequest(http.MethodPost, "/api/v1/events", bytes.NewReader(payload))
	req.Header.Set("Content-Type", "application/json")

	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("app.Test: %v", err)
	}
	if resp.StatusCode != http.StatusNoContent {
		t.Fatalf("expected 204, got %d", resp.StatusCode)
	}
}

func TestWebsiteEvents_Ingest_RequiresJSONContentType(t *testing.T) {
	cfg := config.Config{MaxBodyBytes: 1024 * 8, RateLimitRPS: 5, AdminToken: "secret"}
	repo := memory.NewLeadRepository()
	leadSvc := service.NewLeadService(repo)
	app := NewApp(cfg, leadSvc)

	payload := []byte(`{"event_name":"cta_whatsapp_click","page_url_current":"http://localhost:3000/","device_type":"desktop"}`)
	req := httptest.NewRequest(http.MethodPost, "/api/v1/events", bytes.NewReader(payload))
	req.Header.Set("Content-Type", "text/plain")

	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("app.Test: %v", err)
	}
	if resp.StatusCode != http.StatusUnsupportedMediaType {
		b, _ := io.ReadAll(resp.Body)
		t.Fatalf("expected 415, got %d: %s", resp.StatusCode, string(b))
	}
}

func TestWebsiteEvents_UnknownEvent_IsNormalized(t *testing.T) {
	cfg := config.Config{MaxBodyBytes: 1024 * 8, RateLimitRPS: 5, AdminToken: "secret"}
	repo := memory.NewLeadRepository()
	leadSvc := service.NewLeadService(repo)
	app := NewApp(cfg, leadSvc)

	// Unknown event names must not create new Prometheus label values.
	// NOTE: This is a Go raw string literal, so do NOT escape quotes.
	payload := []byte(`{"event_name":"evil_event_123","page_url_current":"http://localhost:3000/","device_type":"desktop"}`)
	req := httptest.NewRequest(http.MethodPost, "/api/v1/events", bytes.NewReader(payload))
	req.Header.Set("Content-Type", "application/json")

	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("app.Test: %v", err)
	}
	if resp.StatusCode != http.StatusNoContent {
		t.Fatalf("expected 204, got %d", resp.StatusCode)
	}

	metricsReq := httptest.NewRequest(http.MethodGet, "/metrics", nil)
	metricsReq.Header.Set("X-Admin-Token", "secret")
	metricsResp, err := app.Test(metricsReq)
	if err != nil {
		t.Fatalf("app.Test metrics: %v", err)
	}
	if metricsResp.StatusCode != http.StatusOK {
		t.Fatalf("expected 200, got %d", metricsResp.StatusCode)
	}
	bodyBytes, err := io.ReadAll(metricsResp.Body)
	if err != nil {
		t.Fatalf("read metrics body: %v", err)
	}
	body := string(bodyBytes)

	needle := "lead_api_website_events_total{device_type=\"desktop\",event=\"unknown\"} 1"
	if !strings.Contains(body, needle) {
		t.Fatalf("expected metrics to contain %q", needle)
	}
}

func TestRUM_Ingest_Validates(t *testing.T) {
	cfg := config.Config{MaxBodyBytes: 1024 * 8, RateLimitRPS: 5, AdminToken: "secret"}
	repo := memory.NewLeadRepository()
	leadSvc := service.NewLeadService(repo)
	app := NewApp(cfg, leadSvc)

	bad := []byte(`{"metric_name":"LCP"}`)
	badReq := httptest.NewRequest(http.MethodPost, "/api/v1/rum", bytes.NewReader(bad))
	badReq.Header.Set("Content-Type", "application/json")
	badResp, err := app.Test(badReq)
	if err != nil {
		t.Fatalf("bad app.Test: %v", err)
	}
	if badResp.StatusCode != http.StatusBadRequest {
		t.Fatalf("expected 400, got %d", badResp.StatusCode)
	}

	ok := []byte(`{"metric_id":"m1","metric_name":"LCP","value":1234.0,"rating":"good","page_url_current":"http://localhost:3000/","device_type":"desktop"}`)
	okReq := httptest.NewRequest(http.MethodPost, "/api/v1/rum", bytes.NewReader(ok))
	okReq.Header.Set("Content-Type", "application/json")
	okResp, err := app.Test(okReq)
	if err != nil {
		t.Fatalf("ok app.Test: %v", err)
	}
	if okResp.StatusCode != http.StatusNoContent {
		t.Fatalf("expected 204, got %d", okResp.StatusCode)
	}
}

func TestRUM_Ingest_RequiresJSONContentType(t *testing.T) {
	cfg := config.Config{MaxBodyBytes: 1024 * 8, RateLimitRPS: 5, AdminToken: "secret"}
	repo := memory.NewLeadRepository()
	leadSvc := service.NewLeadService(repo)
	app := NewApp(cfg, leadSvc)

	payload := []byte(`{"metric_id":"m1","metric_name":"LCP","value":1234.0,"rating":"good","page_url_current":"http://localhost:3000/","device_type":"desktop"}`)
	req := httptest.NewRequest(http.MethodPost, "/api/v1/rum", bytes.NewReader(payload))
	req.Header.Set("Content-Type", "text/plain")

	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("app.Test: %v", err)
	}
	if resp.StatusCode != http.StatusUnsupportedMediaType {
		b, _ := io.ReadAll(resp.Body)
		t.Fatalf("expected 415, got %d: %s", resp.StatusCode, string(b))
	}
}

func TestRUM_Ingest_DedupeByMetricID(t *testing.T) {
	cfg := config.Config{MaxBodyBytes: 1024 * 8, RateLimitRPS: 5, AdminToken: "secret"}
	repo := memory.NewLeadRepository()
	leadSvc := service.NewLeadService(repo)
	app := NewApp(cfg, leadSvc)

	// Use a label combination unlikely to collide with other tests.
	// NOTE: This is a Go raw string literal, so do NOT escape quotes.
	payload := []byte(`{"metric_id":"dedupe-1","metric_name":"INP","value":250.0,"rating":"poor","page_url_current":"http://localhost:3000/","device_type":"mobile"}`)

	for i := 0; i < 2; i++ {
		req := httptest.NewRequest(http.MethodPost, "/api/v1/rum", bytes.NewReader(payload))
		req.Header.Set("Content-Type", "application/json")
		resp, err := app.Test(req)
		if err != nil {
			t.Fatalf("app.Test post: %v", err)
		}
		if resp.StatusCode != http.StatusNoContent {
			t.Fatalf("expected 204, got %d", resp.StatusCode)
		}
	}

	metricsReq := httptest.NewRequest(http.MethodGet, "/metrics", nil)
	metricsReq.Header.Set("X-Admin-Token", "secret")
	metricsResp, err := app.Test(metricsReq)
	if err != nil {
		t.Fatalf("app.Test metrics: %v", err)
	}
	if metricsResp.StatusCode != http.StatusOK {
		t.Fatalf("expected 200, got %d", metricsResp.StatusCode)
	}
	bodyBytes, err := io.ReadAll(metricsResp.Body)
	if err != nil {
		t.Fatalf("read metrics body: %v", err)
	}
	body := string(bodyBytes)

	// With dedupe, we should observe only 1 report for the specific labelset.
	needle := "lead_api_web_vitals_reports_total{device_type=\"mobile\",metric=\"INP\",rating=\"poor\"} 1"
	if !strings.Contains(body, needle) {
		t.Fatalf("expected metrics to contain %q", needle)
	}
}

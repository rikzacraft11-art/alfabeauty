package handler

import (
	"bytes"
	"context"
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"example.com/alfabeauty-b2b/internal/config"
	"example.com/alfabeauty-b2b/internal/domain/lead"
	"example.com/alfabeauty-b2b/internal/repository/memory"
	"example.com/alfabeauty-b2b/internal/service"
)

func TestAdminExport_Unauthorized(t *testing.T) {
	cfg := config.Config{MaxBodyBytes: 1024, RateLimitRPS: 5, AdminToken: "secret"}
	repo := memory.NewLeadRepository()
	leadSvc := service.NewLeadService(repo)
	app := NewApp(cfg, leadSvc)

	req := httptest.NewRequest(http.MethodGet, "/api/v1/admin/leads.csv", nil)
	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("app.Test: %v", err)
	}
	if resp.StatusCode != http.StatusUnauthorized {
		t.Fatalf("expected 401, got %d", resp.StatusCode)
	}
}

func TestAdminExport_CSV(t *testing.T) {
	cfg := config.Config{MaxBodyBytes: 1024, RateLimitRPS: 5, AdminToken: "secret"}
	repo := memory.NewLeadRepository()
	leadSvc := service.NewLeadService(repo)
	app := NewApp(cfg, leadSvc)

	_, err := leadSvc.Create(context.Background(), lead.Lead{Name: "A", Email: "a@example.com", Message: "Hello"})
	if err != nil {
		t.Fatalf("seed lead: %v", err)
	}

	req := httptest.NewRequest(http.MethodGet, "/api/v1/admin/leads.csv", nil)
	req.Header.Set("X-Admin-Token", "secret")

	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("app.Test: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		b, _ := io.ReadAll(resp.Body)
		t.Fatalf("expected 200, got %d: %s", resp.StatusCode, string(b))
	}

	ct := resp.Header.Get("Content-Type")
	if !strings.Contains(ct, "text/csv") {
		t.Fatalf("expected text/csv content-type, got %q", ct)
	}

	b, _ := io.ReadAll(resp.Body)
	if !strings.HasPrefix(string(b), "id,created_at,name,email,phone,message,page_url_initial,page_url_current") {
		t.Fatalf("expected CSV header, got: %q", string(b))
	}
}

func TestLeadCreate_IdempotencyKey(t *testing.T) {
	cfg := config.Config{MaxBodyBytes: 1024, RateLimitRPS: 5, AdminToken: "secret"}
	repo := memory.NewLeadRepository()
	leadSvc := service.NewLeadService(repo)
	app := NewApp(cfg, leadSvc)

	payload := []byte(`{"name":"A","email":"a@example.com","message":"Hello"}`)

	req1 := httptest.NewRequest(http.MethodPost, "/api/v1/leads", bytes.NewReader(payload))
	req1.Header.Set("Content-Type", "application/json")
	req1.Header.Set("Idempotency-Key", "same-key")
	resp1, err := app.Test(req1)
	if err != nil {
		t.Fatalf("app.Test 1: %v", err)
	}
	if resp1.StatusCode != http.StatusAccepted {
		b, _ := io.ReadAll(resp1.Body)
		t.Fatalf("expected 202, got %d: %s", resp1.StatusCode, string(b))
	}

	var r1 map[string]any
	_ = json.NewDecoder(resp1.Body).Decode(&r1)
	id1, _ := r1["id"].(string)
	if id1 == "" {
		t.Fatalf("expected id in response")
	}

	req2 := httptest.NewRequest(http.MethodPost, "/api/v1/leads", bytes.NewReader(payload))
	req2.Header.Set("Content-Type", "application/json")
	req2.Header.Set("Idempotency-Key", "same-key")
	resp2, err := app.Test(req2)
	if err != nil {
		t.Fatalf("app.Test 2: %v", err)
	}
	if resp2.StatusCode != http.StatusAccepted {
		b, _ := io.ReadAll(resp2.Body)
		t.Fatalf("expected 202, got %d: %s", resp2.StatusCode, string(b))
	}

	var r2 map[string]any
	_ = json.NewDecoder(resp2.Body).Decode(&r2)
	id2, _ := r2["id"].(string)
	if id2 != id1 {
		t.Fatalf("expected same id for idempotent requests, got %q vs %q", id1, id2)
	}
}

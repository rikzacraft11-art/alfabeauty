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
	"time"

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

	_, err := leadSvc.Create(context.Background(), lead.Lead{
		BusinessName:  "Biz A",
		ContactName:   "A",
		PhoneWhatsApp: "+6281111111111",
		City:          "Jakarta",
		SalonType:     "SALON",
		Consent:       true,
		Email:         "a@example.com",
		Message:       "Hello",
	})
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
	if !strings.HasPrefix(string(b), "id,created_at,business_name,contact_name,phone_whatsapp,city,salon_type,consent,chair_count,specialization,current_brands_used,monthly_spend_range,email,message,page_url_initial,page_url_current") {
		t.Fatalf("expected CSV header, got: %q", string(b))
	}
}

func TestLeadCreate_IdempotencyKey(t *testing.T) {
	cfg := config.Config{MaxBodyBytes: 1024, RateLimitRPS: 5, AdminToken: "secret"}
	repo := memory.NewLeadRepository()
	leadSvc := service.NewLeadService(repo)
	app := NewApp(cfg, leadSvc)

	payload := []byte(`{"business_name":"Biz A","contact_name":"A","phone_whatsapp":"+6281111111111","city":"Jakarta","salon_type":"SALON","consent":true,"email":"a@example.com","message":"Hello"}`)

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

func TestLeadCreate_RequiresJSONContentType(t *testing.T) {
	cfg := config.Config{MaxBodyBytes: 1024, RateLimitRPS: 5, AdminToken: "secret"}
	repo := memory.NewLeadRepository()
	leadSvc := service.NewLeadService(repo)
	app := NewApp(cfg, leadSvc)

	// NOTE: This is a Go raw string literal, so do NOT escape quotes.
	payload := []byte(`{"business_name":"Biz A","contact_name":"A","phone_whatsapp":"+6281111111111","city":"Jakarta","salon_type":"SALON","consent":true}`)
	req := httptest.NewRequest(http.MethodPost, "/api/v1/leads", bytes.NewReader(payload))
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

func TestAdminLeadNotifications_Unauthorized(t *testing.T) {
	cfg := config.Config{MaxBodyBytes: 1024, RateLimitRPS: 5, AdminToken: "secret"}
	leadRepo := memory.NewLeadRepository()
	notifRepo := memory.NewLeadNotificationRepository()
	leadSvc := service.NewLeadServiceWithNotifications(leadRepo, notifRepo, true, true)
	app := NewApp(cfg, leadSvc)

	req := httptest.NewRequest(http.MethodGet, "/api/v1/admin/lead-notifications", nil)
	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("app.Test: %v", err)
	}
	if resp.StatusCode != http.StatusUnauthorized {
		t.Fatalf("expected 401, got %d", resp.StatusCode)
	}
}

func TestAdminLeadNotifications_List(t *testing.T) {
	cfg := config.Config{MaxBodyBytes: 1024, RateLimitRPS: 5, AdminToken: "secret"}
	leadRepo := memory.NewLeadRepository()
	notifRepo := memory.NewLeadNotificationRepository()
	leadSvc := service.NewLeadServiceWithNotifications(leadRepo, notifRepo, true, true)
	app := NewApp(cfg, leadSvc)

	created, err := leadSvc.Create(context.Background(), lead.Lead{
		BusinessName:  "Biz A",
		ContactName:   "A",
		PhoneWhatsApp: "+6281111111111",
		City:          "Jakarta",
		SalonType:     "SALON",
		Consent:       true,
		Email:         "a@example.com",
		Message:       "Hello",
	})
	if err != nil {
		t.Fatalf("seed lead: %v", err)
	}

	req := httptest.NewRequest(http.MethodGet, "/api/v1/admin/lead-notifications?lead_id="+created.ID.String(), nil)
	req.Header.Set("X-Admin-Token", "secret")

	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("app.Test: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		b, _ := io.ReadAll(resp.Body)
		t.Fatalf("expected 200, got %d: %s", resp.StatusCode, string(b))
	}

	var out struct {
		Items []map[string]any `json:"items"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&out); err != nil {
		t.Fatalf("decode: %v", err)
	}
	if len(out.Items) != 2 {
		t.Fatalf("expected 2 notifications, got %d", len(out.Items))
	}

	seen := map[string]bool{}
	for _, it := range out.Items {
		ch, _ := it["Channel"].(string)
		st, _ := it["Status"].(string)
		if ch == "" {
			// json encoding of struct uses lower-case field names by default, so be tolerant
			ch, _ = it["channel"].(string)
		}
		if st == "" {
			st, _ = it["status"].(string)
		}
		seen[ch] = true
		if st == "" {
			t.Fatalf("expected status for channel %q", ch)
		}
	}
	if !seen["email"] {
		t.Fatalf("expected email notification")
	}
	if !seen["webhook"] {
		t.Fatalf("expected webhook notification")
	}
}

func TestAdminLeadNotifications_Stats_Unauthorized(t *testing.T) {
	cfg := config.Config{MaxBodyBytes: 1024, RateLimitRPS: 5, AdminToken: "secret"}
	leadRepo := memory.NewLeadRepository()
	notifRepo := memory.NewLeadNotificationRepository()
	leadSvc := service.NewLeadServiceWithNotifications(leadRepo, notifRepo, true, true)
	app := NewApp(cfg, leadSvc)

	req := httptest.NewRequest(http.MethodGet, "/api/v1/admin/lead-notifications/stats", nil)
	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("app.Test: %v", err)
	}
	if resp.StatusCode != http.StatusUnauthorized {
		t.Fatalf("expected 401, got %d", resp.StatusCode)
	}
}

func TestAdminLeadNotifications_Stats(t *testing.T) {
	cfg := config.Config{MaxBodyBytes: 1024, RateLimitRPS: 5, AdminToken: "secret"}
	leadRepo := memory.NewLeadRepository()
	notifRepo := memory.NewLeadNotificationRepository()
	leadSvc := service.NewLeadServiceWithNotifications(leadRepo, notifRepo, true, true)
	app := NewApp(cfg, leadSvc)

	created, err := leadSvc.Create(context.Background(), lead.Lead{
		BusinessName:  "Biz A",
		ContactName:   "A",
		PhoneWhatsApp: "+6281111111111",
		City:          "Jakarta",
		SalonType:     "SALON",
		Consent:       true,
		Email:         "a@example.com",
		Message:       "Hello",
	})
	if err != nil {
		t.Fatalf("seed lead: %v", err)
	}

	// Create backlog: enqueue creates 2 notifications (email + webhook). Make one delayed.
	ids := notifRepo.IDs()
	if len(ids) != 2 {
		t.Fatalf("expected 2 notifications, got %d", len(ids))
	}

	// Mutate internal state deterministically via GetByID + MarkRetry.
	n0, err := notifRepo.GetByID(ids[0])
	if err != nil {
		t.Fatalf("GetByID: %v", err)
	}
	if n0.LeadID != created.ID {
		t.Fatalf("expected lead_id to match")
	}
	// Delay one item into the future.
	if err := notifRepo.MarkRetry(context.Background(), n0.ID, 1, time.Now().UTC().Add(2*time.Hour), "delayed"); err != nil {
		t.Fatalf("MarkRetry: %v", err)
	}

	req := httptest.NewRequest(http.MethodGet, "/api/v1/admin/lead-notifications/stats", nil)
	req.Header.Set("X-Admin-Token", "secret")

	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("app.Test: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		b, _ := io.ReadAll(resp.Body)
		t.Fatalf("expected 200, got %d: %s", resp.StatusCode, string(b))
	}

	var out map[string]any
	if err := json.NewDecoder(resp.Body).Decode(&out); err != nil {
		t.Fatalf("decode: %v", err)
	}

	// Basic sanity: we have 2 pending total, split between ready and delayed.
	ready, _ := out["pending_ready_count"].(float64)
	delayed, _ := out["pending_delayed_count"].(float64)
	if int(ready)+int(delayed) != 2 {
		t.Fatalf("expected ready+delayed=2, got ready=%v delayed=%v", ready, delayed)
	}
	if int(delayed) != 1 {
		t.Fatalf("expected 1 delayed, got %v", delayed)
	}

	counts, ok := out["counts_by_status"].(map[string]any)
	if !ok {
		t.Fatalf("expected counts_by_status object")
	}
	if v, ok := counts["pending"].(float64); !ok || int(v) != 2 {
		t.Fatalf("expected counts_by_status.pending=2, got %v", counts["pending"])
	}
}

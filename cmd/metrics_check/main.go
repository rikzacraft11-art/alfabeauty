package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"strings"
	"time"

	"github.com/joho/godotenv"

	"example.com/alfabeauty-b2b/internal/obs"
)

type leadHoneypotRequest struct {
	BusinessName  string `json:"business_name"`
	ContactName   string `json:"contact_name"`
	PhoneWhatsApp string `json:"phone_whatsapp"`
	City          string `json:"city"`
	SalonType     string `json:"salon_type"`
	Consent       bool   `json:"consent"`
	Company       string `json:"company"` // honeypot
}

func main() {
	obs.Init()

	// Best-effort local dev convenience. In containers/CI, env should be injected.
	_ = godotenv.Load()

	baseURL := strings.TrimSpace(os.Getenv("SMOKE_BASE_URL"))
	if baseURL == "" || baseURL == "__CHANGE_ME__" {
		// Allow reloading from .env if the shell has a placeholder value.
		_ = godotenv.Overload()
		baseURL = strings.TrimSpace(os.Getenv("SMOKE_BASE_URL"))
	}
	if baseURL == "" || baseURL == "__CHANGE_ME__" {
		obs.Fatal("metrics_check_invalid_config", obs.Fields{"reason": "SMOKE_BASE_URL_required"})
	}
	baseURL = normalizeBaseURL(baseURL)

	adminToken := strings.TrimSpace(os.Getenv("SMOKE_ADMIN_TOKEN"))
	if adminToken == "" || adminToken == "__CHANGE_ME__" {
		adminToken = strings.TrimSpace(os.Getenv("LEAD_API_ADMIN_TOKEN"))
	}
	if adminToken == "" || adminToken == "__CHANGE_ME__" {
		obs.Fatal("metrics_check_invalid_config", obs.Fields{"reason": "SMOKE_ADMIN_TOKEN_or_LEAD_API_ADMIN_TOKEN_required"})
	}

	if strings.HasPrefix(strings.ToLower(baseURL), "http://") {
		allowInsecure := strings.TrimSpace(strings.ToLower(os.Getenv("SMOKE_ALLOW_INSECURE")))
		if allowInsecure != "true" {
			obs.Fatal("metrics_check_guard_blocked", obs.Fields{"reason": "refusing_http_without_SMOKE_ALLOW_INSECURE_true"})
		}
	}

	client := &http.Client{Timeout: 8 * time.Second}

	// Seed a safe, read-only lead submit (honeypot) so lead_submissions_total gets a label series
	// and becomes visible on /metrics. This should not persist any user data.
	{
		payload := leadHoneypotRequest{
			BusinessName:  "METRICS-CHECK",
			ContactName:   "Metrics",
			PhoneWhatsApp: "+6281111111111",
			City:          "Jakarta",
			SalonType:     "OTHER",
			Consent:       true,
			Company:       "bot", // trigger honeypot
		}
		b, _ := json.Marshal(payload)
		req, err := http.NewRequest(http.MethodPost, baseURL+"/api/v1/leads", bytes.NewReader(b))
		if err != nil {
			obs.Fatal("metrics_check_build_seed_request_failed", obs.Fields{"error": err.Error()})
		}
		req.Header.Set("Content-Type", "application/json; charset=utf-8")
		resp, err := client.Do(req)
		if err != nil {
			obs.Fatal("metrics_check_seed_request_failed", obs.Fields{"error": err.Error()})
		}
		_ = resp.Body.Close()
		if resp.StatusCode != http.StatusAccepted {
			obs.Fatal("metrics_check_seed_unexpected_status", obs.Fields{"status": resp.StatusCode})
		}
	}

	req, err := http.NewRequest(http.MethodGet, baseURL+"/metrics", nil)
	if err != nil {
		obs.Fatal("metrics_check_build_request_failed", obs.Fields{"error": err.Error()})
	}
	req.Header.Set("Authorization", "Bearer "+adminToken)
	// Encourage OpenMetrics where supported; Prometheus typically negotiates automatically.
	req.Header.Set("Accept", "application/openmetrics-text; version=1.0.0; charset=utf-8, text/plain; version=0.0.4")

	resp, err := client.Do(req)
	if err != nil {
		obs.Fatal("metrics_check_request_failed", obs.Fields{"error": err.Error()})
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		snippet, _ := io.ReadAll(io.LimitReader(resp.Body, 1024))
		obs.Fatal("metrics_check_unexpected_status", obs.Fields{"status": resp.StatusCode, "body": string(snippet)})
	}

	// Keep bounded: metrics payload should be small.
	b, err := io.ReadAll(io.LimitReader(resp.Body, 2*1024*1024))
	if err != nil {
		obs.Fatal("metrics_check_read_failed", obs.Fields{"error": err.Error()})
	}
	body := string(b)

	required := []string{
		"lead_api_http_requests_total",
		"lead_api_http_request_duration_seconds_bucket",
		"lead_api_lead_submissions_total",
		"lead_api_lead_notifications_pending_ready_total",
		"lead_api_lead_notifications_oldest_ready_pending_age_seconds",
	}

	missing := make([]string, 0)
	for _, m := range required {
		if !strings.Contains(body, m) {
			missing = append(missing, m)
		}
	}

	if len(missing) > 0 {
		obs.Fatal("metrics_check_missing_metrics", obs.Fields{"missing": strings.Join(missing, ",")})
	}

	obs.Log("metrics_check_ok", obs.Fields{"url": baseURL + "/metrics"})
	fmt.Println("METRICS CHECK PASS: required metric names present")
}

func normalizeBaseURL(raw string) string {
	s := strings.TrimSpace(raw)
	s = strings.TrimRight(s, "/")

	u, err := url.Parse(s)
	if err != nil || u.Scheme == "" || u.Host == "" {
		obs.Fatal("metrics_check_invalid_config", obs.Fields{"reason": "SMOKE_BASE_URL_must_be_absolute_url", "value": raw})
		return "" // unreachable
	}

	// On Windows, "localhost" often resolves to IPv6 ::1 first.
	// Prefer IPv4 loopback for localhost URLs for compatibility.
	if strings.EqualFold(u.Hostname(), "localhost") {
		from := s
		host := "127.0.0.1"
		if port := u.Port(); port != "" {
			host = host + ":" + port
		}
		u.Host = host
		s = strings.TrimRight(u.String(), "/")
		obs.Log("metrics_check_base_url_rewritten", obs.Fields{"from": from, "to": s, "reason": "prefer_ipv4_for_localhost"})
	}

	return s
}

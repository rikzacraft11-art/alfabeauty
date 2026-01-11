package notify

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"

	"example.com/alfabeauty-b2b/internal/domain/lead"
	"example.com/alfabeauty-b2b/internal/domain/notification"
)

type WebhookConfig struct {
	URL     string
	Secret  string
	Timeout time.Duration
}

type WebhookSender struct {
	cfg    WebhookConfig
	client *http.Client
}

func NewWebhookSender(cfg WebhookConfig) *WebhookSender {
	if cfg.Timeout == 0 {
		cfg.Timeout = 10 * time.Second
	}
	return &WebhookSender{
		cfg: cfg,
		client: &http.Client{
			Timeout: cfg.Timeout,
		},
	}
}

func (s *WebhookSender) Channel() string { return notification.ChannelWebhook }

func (s *WebhookSender) Send(ctx context.Context, l lead.Lead) error {
	url := strings.TrimSpace(s.cfg.URL)
	if url == "" {
		return fmt.Errorf("webhook url not configured")
	}

	payload := map[string]any{
		"lead_id":          l.ID.String(),
		"created_at":       l.CreatedAt.UTC().Format(time.RFC3339Nano),
		"name":             l.Name,
		"email":            l.Email,
		"phone":            l.Phone,
		"message":          l.Message,
		"page_url_initial": l.PageURLInitial,
		"page_url_current": l.PageURLCurrent,
		"user_agent":       l.UserAgent,
		"ip_address":       l.IPAddress,
	}

	b, err := json.Marshal(payload)
	if err != nil {
		return fmt.Errorf("marshal webhook payload: %w", err)
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, url, bytes.NewReader(b))
	if err != nil {
		return fmt.Errorf("new request: %w", err)
	}
	req.Header.Set("Content-Type", "application/json; charset=utf-8")
	if strings.TrimSpace(s.cfg.Secret) != "" {
		req.Header.Set("X-Webhook-Secret", strings.TrimSpace(s.cfg.Secret))
	}

	resp, err := s.client.Do(req)
	if err != nil {
		return fmt.Errorf("webhook request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return fmt.Errorf("webhook non-2xx: %s", resp.Status)
	}

	return nil
}

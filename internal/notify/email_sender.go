package notify

import (
	"context"
	"crypto/tls"
	"fmt"
	"net"
	"net/smtp"
	"strings"
	"time"

	"example.com/alfabeauty-b2b/internal/domain/lead"
	"example.com/alfabeauty-b2b/internal/domain/notification"
)

type EmailConfig struct {
	Host     string
	Port     int
	Username string
	Password string
	From     string
	To       []string
	UseTLS   bool
	Timeout  time.Duration
}

type EmailSender struct {
	cfg EmailConfig
}

func NewEmailSender(cfg EmailConfig) *EmailSender {
	if cfg.Timeout == 0 {
		cfg.Timeout = 10 * time.Second
	}
	return &EmailSender{cfg: cfg}
}

func (s *EmailSender) Channel() string { return notification.ChannelEmail }

func (s *EmailSender) Send(ctx context.Context, l lead.Lead) error {
	if strings.TrimSpace(s.cfg.Host) == "" {
		return fmt.Errorf("smtp host not configured")
	}
	if s.cfg.Port <= 0 {
		return fmt.Errorf("smtp port not configured")
	}
	if strings.TrimSpace(s.cfg.From) == "" {
		return fmt.Errorf("smtp from not configured")
	}
	if len(s.cfg.To) == 0 {
		return fmt.Errorf("smtp to not configured")
	}

	subject := fmt.Sprintf("New Partner Lead: %s", safeOneLine(l.Name))
	body := buildEmailBody(l)
	msg := buildRFC2822(s.cfg.From, s.cfg.To, subject, body)

	addr := net.JoinHostPort(s.cfg.Host, fmt.Sprintf("%d", s.cfg.Port))

	d := net.Dialer{Timeout: s.cfg.Timeout}
	conn, err := d.DialContext(ctx, "tcp", addr)
	if err != nil {
		return fmt.Errorf("dial smtp: %w", err)
	}
	defer conn.Close()

	client, err := smtp.NewClient(conn, s.cfg.Host)
	if err != nil {
		return fmt.Errorf("smtp client: %w", err)
	}
	defer client.Close()

	if s.cfg.UseTLS {
		cfg := &tls.Config{ServerName: s.cfg.Host, MinVersion: tls.VersionTLS12}
		if err := client.StartTLS(cfg); err != nil {
			return fmt.Errorf("starttls: %w", err)
		}
	}

	if s.cfg.Username != "" {
		auth := smtp.PlainAuth("", s.cfg.Username, s.cfg.Password, s.cfg.Host)
		if err := client.Auth(auth); err != nil {
			return fmt.Errorf("smtp auth: %w", err)
		}
	}

	if err := client.Mail(s.cfg.From); err != nil {
		return fmt.Errorf("smtp mail from: %w", err)
	}
	for _, rcpt := range s.cfg.To {
		rcpt = strings.TrimSpace(rcpt)
		if rcpt == "" {
			continue
		}
		if err := client.Rcpt(rcpt); err != nil {
			return fmt.Errorf("smtp rcpt %s: %w", rcpt, err)
		}
	}

	wc, err := client.Data()
	if err != nil {
		return fmt.Errorf("smtp data: %w", err)
	}
	if _, err := wc.Write([]byte(msg)); err != nil {
		_ = wc.Close()
		return fmt.Errorf("smtp write: %w", err)
	}
	if err := wc.Close(); err != nil {
		return fmt.Errorf("smtp close: %w", err)
	}

	if err := client.Quit(); err != nil {
		return fmt.Errorf("smtp quit: %w", err)
	}

	return nil
}

func buildRFC2822(from string, to []string, subject, body string) string {
	headers := []string{
		"From: " + from,
		"To: " + strings.Join(to, ", "),
		"Subject: " + subject,
		"MIME-Version: 1.0",
		"Content-Type: text/plain; charset=utf-8",
		"Content-Transfer-Encoding: 8bit",
		"",
	}
	return strings.Join(headers, "\r\n") + body + "\r\n"
}

func buildEmailBody(l lead.Lead) string {
	lines := []string{
		"New lead received:",
		"",
		"ID: " + l.ID.String(),
		"CreatedAt: " + l.CreatedAt.UTC().Format(time.RFC3339Nano),
		"Name: " + safeOneLine(l.Name),
		"Email: " + safeOneLine(l.Email),
		"Phone: " + safeOneLine(l.Phone),
		"Message: " + safeOneLine(l.Message),
		"PageURLInitial: " + safeOneLine(l.PageURLInitial),
		"PageURLCurrent: " + safeOneLine(l.PageURLCurrent),
		"UserAgent: " + safeOneLine(l.UserAgent),
		"IPAddress: " + safeOneLine(l.IPAddress),
	}
	return strings.Join(lines, "\n") + "\n"
}

func safeOneLine(s string) string {
	s = strings.ReplaceAll(s, "\r", " ")
	s = strings.ReplaceAll(s, "\n", " ")
	return strings.TrimSpace(s)
}

package main

import (
	"bufio"
	"bytes"
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"net"
	"net/http"
	"net/http/httptest"
	"os"
	"strings"
	"sync"
	"time"

	"example.com/alfabeauty-b2b/internal/database"
	"example.com/alfabeauty-b2b/internal/domain/lead"
	"example.com/alfabeauty-b2b/internal/domain/notification"
	"example.com/alfabeauty-b2b/internal/notify"
	"example.com/alfabeauty-b2b/internal/obs"
	"example.com/alfabeauty-b2b/internal/repository/postgres"
	"example.com/alfabeauty-b2b/internal/service"
)

// This command performs an end-to-end smoke test for the lead notification pipeline:
// Postgres insert -> outbox enqueue -> worker -> (fake SMTP) + (local webhook).
//
// It is intended for operators/devs to quickly validate wiring without relying on external providers.
func main() {
	obs.Init()

	dbURL := strings.TrimSpace(os.Getenv("DATABASE_URL"))
	if dbURL == "" {
		obs.Fatal("smoke_notify_invalid_config", obs.Fields{"reason": "DATABASE_URL_required"})
	}

	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	// --- Local webhook receiver (Google Sheets webhook surrogate) ---
	webhookSecret := "smoke-secret"
	var webhookHits int
	var webhookPayload map[string]any
	var webhookMu sync.Mutex

	webhookSrv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			w.WriteHeader(http.StatusMethodNotAllowed)
			return
		}
		if r.Header.Get("X-Webhook-Secret") != webhookSecret {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}
		defer r.Body.Close()

		var p map[string]any
		if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		webhookMu.Lock()
		webhookHits++
		webhookPayload = p
		webhookMu.Unlock()

		w.WriteHeader(http.StatusNoContent)
	}))
	defer webhookSrv.Close()

	// --- Fake SMTP server ---
	smtp, err := startFakeSMTPServer()
	if err != nil {
		obs.Fatal("smoke_notify_smtp_start_failed", obs.Fields{"error": err.Error()})
	}
	defer smtp.Close()

	db, err := database.OpenPostgres(dbURL)
	if err != nil {
		obs.Fatal("smoke_notify_db_open_failed", obs.Fields{"error": err.Error()})
	}
	defer db.Close()

	leadRepo := postgres.NewLeadRepository(db)
	notifRepo := postgres.NewLeadNotificationRepository(db)

	emailSender := notify.NewEmailSender(notify.EmailConfig{
		Host:   smtp.Host,
		Port:   smtp.Port,
		From:   "no-reply@example.com",
		To:     []string{"ops@example.com"},
		UseTLS: false,
		// No auth against fake SMTP.
	})
	webhookSender := notify.NewWebhookSender(notify.WebhookConfig{
		URL:    webhookSrv.URL,
		Secret: webhookSecret,
	})

	leadSvc := service.NewLeadServiceWithNotifications(leadRepo, notifRepo, true, true)

	created, err := leadSvc.Create(ctx, lead.Lead{
		BusinessName:      "SMOKE TEST - Lead Notifications",
		ContactName:       "Smoke Runner",
		PhoneWhatsApp:     "+6281111111111",
		City:              "Jakarta",
		SalonType:         "OTHER",
		Consent:           true,
		Email:             "smoke@example.com",
		Message:           "smoke test",
		PageURLInitial: "https://example.com/smoke",
		PageURLCurrent: "https://example.com/smoke",
		UserAgent:      "smoke_notify",
		IPAddress:      "127.0.0.1",
	})
	if err != nil {
		obs.Fatal("smoke_notify_create_lead_failed", obs.Fields{"error": err.Error()})
	}
	obs.Log("smoke_notify_created_lead", obs.Fields{"lead_id": created.ID.String()})

	workerCtx, workerCancel := context.WithCancel(context.Background())
	defer workerCancel()

	w := notify.NewWorker(notifRepo, leadRepo, []notify.ChannelSender{emailSender, webhookSender})
	go w.Run(workerCtx)

	deadline := time.Now().Add(15 * time.Second)
	for {
		if time.Now().After(deadline) {
			break
		}

		statuses, err := getNotificationStatuses(ctx, db, created.ID.String())
		if err != nil {
			obs.Fatal("smoke_notify_query_statuses_failed", obs.Fields{"error": err.Error()})
		}

		emailOK := statuses[notification.ChannelEmail] == notification.StatusSent
		webhookOK := statuses[notification.ChannelWebhook] == notification.StatusSent
		if emailOK && webhookOK {
			break
		}
		time.Sleep(250 * time.Millisecond)
	}

	statuses, err := getNotificationStatuses(ctx, db, created.ID.String())
	if err != nil {
		obs.Fatal("smoke_notify_query_statuses_failed", obs.Fields{"phase": "final", "error": err.Error()})
	}

	if statuses[notification.ChannelEmail] != notification.StatusSent {
		obs.Fatal("smoke_notify_email_not_sent", obs.Fields{"status": statuses[notification.ChannelEmail]})
	}
	if statuses[notification.ChannelWebhook] != notification.StatusSent {
		obs.Fatal("smoke_notify_webhook_not_sent", obs.Fields{"status": statuses[notification.ChannelWebhook]})
	}

	webhookMu.Lock()
	hits := webhookHits
	payload := webhookPayload
	webhookMu.Unlock()

	if hits < 1 {
		obs.Fatal("smoke_notify_webhook_not_called", obs.Fields{"hits": hits})
	}
	if got, _ := payload["lead_id"].(string); got != created.ID.String() {
		obs.Fatal("smoke_notify_webhook_payload_mismatch", obs.Fields{"field": "lead_id"})
	}

	smtpData := smtp.LastMessage()
	if !bytes.Contains(smtpData, []byte(created.ID.String())) {
		obs.Fatal("smoke_notify_smtp_payload_missing", obs.Fields{"field": "lead_id"})
	}

	// Cleanup (default). This keeps Supabase tidy.
	if strings.TrimSpace(strings.ToLower(os.Getenv("SMOKE_KEEP"))) != "true" {
		if err := cleanupLead(ctx, db, created.ID.String()); err != nil {
			obs.Log("smoke_notify_cleanup_warning", obs.Fields{"error": err.Error()})
		}
	}

	obs.Log("smoke_notify_pass", obs.Fields{"result": "notifications_delivered"})
	fmt.Println("SMOKE PASS: notifications delivered (email + webhook)")
}

func getNotificationStatuses(ctx context.Context, db *sql.DB, leadID string) (map[string]string, error) {
	rows, err := db.QueryContext(ctx, `
		SELECT channel, status
		FROM public.lead_notifications
		WHERE lead_id = $1
	`, leadID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	m := map[string]string{}
	for rows.Next() {
		var ch, st string
		if err := rows.Scan(&ch, &st); err != nil {
			return nil, err
		}
		m[ch] = st
	}
	return m, rows.Err()
}

func cleanupLead(ctx context.Context, db *sql.DB, leadID string) error {
	_, err := db.ExecContext(ctx, `DELETE FROM public.leads WHERE id = $1`, leadID)
	return err
}

type fakeSMTPServer struct {
	Host string
	Port int

	ln net.Listener

	mu        sync.Mutex
	lastBytes []byte
}

func startFakeSMTPServer() (*fakeSMTPServer, error) {
	ln, err := net.Listen("tcp", "127.0.0.1:0")
	if err != nil {
		return nil, err
	}

	host, portStr, err := net.SplitHostPort(ln.Addr().String())
	if err != nil {
		_ = ln.Close()
		return nil, err
	}
	port, err := parsePort(portStr)
	if err != nil {
		_ = ln.Close()
		return nil, err
	}

	s := &fakeSMTPServer{Host: host, Port: port, ln: ln}
	go s.acceptLoop()
	return s, nil
}

func (s *fakeSMTPServer) Close() {
	_ = s.ln.Close()
}

func (s *fakeSMTPServer) LastMessage() []byte {
	s.mu.Lock()
	defer s.mu.Unlock()
	return append([]byte(nil), s.lastBytes...)
}

func (s *fakeSMTPServer) acceptLoop() {
	for {
		conn, err := s.ln.Accept()
		if err != nil {
			return
		}
		_ = s.handleConn(conn)
		_ = conn.Close()
	}
}

func (s *fakeSMTPServer) handleConn(conn net.Conn) error {
	_ = conn.SetDeadline(time.Now().Add(10 * time.Second))

	r := bufio.NewReader(conn)
	w := bufio.NewWriter(conn)

	writeLine := func(line string) error {
		if _, err := w.WriteString(line + "\r\n"); err != nil {
			return err
		}
		return w.Flush()
	}

	if err := writeLine("220 localhost ESMTP smoke"); err != nil {
		return err
	}

	for {
		line, err := r.ReadString('\n')
		if err != nil {
			return err
		}
		cmd := strings.TrimSpace(line)
		upper := strings.ToUpper(cmd)

		switch {
		case strings.HasPrefix(upper, "EHLO"):
			if err := writeLine("250-localhost"); err != nil {
				return err
			}
			if err := writeLine("250 OK"); err != nil {
				return err
			}
		case strings.HasPrefix(upper, "HELO"):
			if err := writeLine("250 OK"); err != nil {
				return err
			}
		case strings.HasPrefix(upper, "MAIL FROM"):
			if err := writeLine("250 OK"); err != nil {
				return err
			}
		case strings.HasPrefix(upper, "RCPT TO"):
			if err := writeLine("250 OK"); err != nil {
				return err
			}
		case upper == "DATA":
			if err := writeLine("354 End data with <CR><LF>.<CR><LF>"); err != nil {
				return err
			}
			data, err := readSMTPData(r)
			if err != nil {
				return err
			}
			s.mu.Lock()
			s.lastBytes = data
			s.mu.Unlock()
			if err := writeLine("250 OK"); err != nil {
				return err
			}
		case upper == "RSET":
			if err := writeLine("250 OK"); err != nil {
				return err
			}
		case upper == "QUIT":
			_ = writeLine("221 Bye")
			return nil
		default:
			// Unknown command.
			if err := writeLine("250 OK"); err != nil {
				return err
			}
		}
	}
}

func readSMTPData(r *bufio.Reader) ([]byte, error) {
	var buf bytes.Buffer
	for {
		line, err := r.ReadString('\n')
		if err != nil {
			return nil, err
		}
		if line == ".\r\n" || strings.TrimRight(line, "\r\n") == "." {
			return buf.Bytes(), nil
		}
		buf.WriteString(line)
	}
}

func parsePort(s string) (int, error) {
	var p int
	_, err := fmt.Sscanf(s, "%d", &p)
	if err != nil {
		return 0, err
	}
	if p <= 0 {
		return 0, errors.New("invalid port")
	}
	return p, nil
}

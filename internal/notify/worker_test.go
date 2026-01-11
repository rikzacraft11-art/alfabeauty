package notify

import (
	"context"
	"errors"
	"testing"
	"time"

	"example.com/alfabeauty-b2b/internal/domain/lead"
	"example.com/alfabeauty-b2b/internal/domain/notification"
	"example.com/alfabeauty-b2b/internal/repository/memory"
)

type fakeSender struct {
	channel string
	err     error

	calls int
	last  lead.Lead
}

func (s *fakeSender) Channel() string { return s.channel }

func (s *fakeSender) Send(_ context.Context, l lead.Lead) error {
	s.calls++
	s.last = l
	return s.err
}

func TestWorker_SendsAndMarksSent(t *testing.T) {
	ctx := context.Background()

	leadRepo := memory.NewLeadRepository()
	created, err := leadRepo.Create(ctx, lead.Lead{Name: "PT Contoh", Email: "ops@example.com", Message: "hi"})
	if err != nil {
		t.Fatalf("lead create: %v", err)
	}

	notifRepo := memory.NewLeadNotificationRepository()
	if err := notifRepo.Enqueue(ctx, created.ID, notification.ChannelEmail); err != nil {
		t.Fatalf("enqueue: %v", err)
	}

	ids := notifRepo.IDs()
	if len(ids) != 1 {
		t.Fatalf("expected 1 notification, got %d", len(ids))
	}

	sender := &fakeSender{channel: notification.ChannelEmail}
	w := NewWorker(notifRepo, leadRepo, []ChannelSender{sender})

	w.tick(ctx)

	if sender.calls != 1 {
		t.Fatalf("expected sender called once, got %d", sender.calls)
	}
	if sender.last.ID != created.ID {
		t.Fatalf("unexpected lead: got %s want %s", sender.last.ID, created.ID)
	}

	n, err := notifRepo.GetByID(ids[0])
	if err != nil {
		t.Fatalf("GetByID: %v", err)
	}
	if n.Status != notification.StatusSent {
		t.Fatalf("expected status sent, got %s", n.Status)
	}
	if n.Attempts != 0 {
		t.Fatalf("expected attempts 0, got %d", n.Attempts)
	}
	if n.SentAt == nil {
		t.Fatalf("expected sent_at set")
	}
}

func TestWorker_RetriesOnError(t *testing.T) {
	ctx := context.Background()

	leadRepo := memory.NewLeadRepository()
	created, _ := leadRepo.Create(ctx, lead.Lead{Name: "PT Contoh", Phone: "+62", Message: "hi"})

	notifRepo := memory.NewLeadNotificationRepository()
	_ = notifRepo.Enqueue(ctx, created.ID, notification.ChannelWebhook)
	ids := notifRepo.IDs()
	if len(ids) != 1 {
		t.Fatalf("expected 1 notification, got %d", len(ids))
	}

	sender := &fakeSender{channel: notification.ChannelWebhook, err: errors.New("boom")}
	w := NewWorker(notifRepo, leadRepo, []ChannelSender{sender})

	before := time.Now().UTC()
	w.tick(ctx)

	n, err := notifRepo.GetByID(ids[0])
	if err != nil {
		t.Fatalf("GetByID: %v", err)
	}
	if n.Status != notification.StatusPending {
		t.Fatalf("expected status pending, got %s", n.Status)
	}
	if n.Attempts != 1 {
		t.Fatalf("expected attempts 1, got %d", n.Attempts)
	}
	if !n.NextAttemptAt.After(before) {
		t.Fatalf("expected next_attempt_at in the future")
	}
	if n.LastError == "" {
		t.Fatalf("expected last_error set")
	}
}

func TestWorker_FailsAfterMaxAttempts(t *testing.T) {
	ctx := context.Background()

	leadRepo := memory.NewLeadRepository()
	created, _ := leadRepo.Create(ctx, lead.Lead{Name: "PT Contoh", Email: "ops@example.com", Message: "hi"})

	notifRepo := memory.NewLeadNotificationRepository()
	_ = notifRepo.Enqueue(ctx, created.ID, notification.ChannelEmail)
	ids := notifRepo.IDs()
	if len(ids) != 1 {
		t.Fatalf("expected 1 notification, got %d", len(ids))
	}

	// Force the attempt counter to maxAttempts-1 and make it immediately claimable.
	_ = notifRepo.MarkRetry(ctx, ids[0], 9, time.Now().UTC().Add(-1*time.Second), "previous")

	sender := &fakeSender{channel: notification.ChannelEmail, err: errors.New("still failing")}
	w := NewWorker(notifRepo, leadRepo, []ChannelSender{sender})

	w.tick(ctx)

	n, err := notifRepo.GetByID(ids[0])
	if err != nil {
		t.Fatalf("GetByID: %v", err)
	}
	if n.Status != notification.StatusFailed {
		t.Fatalf("expected status failed, got %s", n.Status)
	}
	if n.Attempts != 10 {
		t.Fatalf("expected attempts 10, got %d", n.Attempts)
	}
	if n.LastError == "" {
		t.Fatalf("expected last_error set")
	}
}

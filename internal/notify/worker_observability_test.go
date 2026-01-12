package notify

import (
	"bytes"
	"context"
	"errors"
	"log"
	"strings"
	"testing"
	"time"

	"example.com/alfabeauty-b2b/internal/domain/lead"
	"example.com/alfabeauty-b2b/internal/domain/notification"
	"example.com/alfabeauty-b2b/internal/obs"
	"example.com/alfabeauty-b2b/internal/repository"
	"example.com/alfabeauty-b2b/internal/repository/memory"
	"github.com/google/uuid"
)

type claimBatchErrorOnlyRepo struct {
	err error
}

func (r *claimBatchErrorOnlyRepo) Enqueue(_ context.Context, _ uuid.UUID, _ string) error {
	panic("unexpected")
}

func (r *claimBatchErrorOnlyRepo) ClaimBatch(_ context.Context, _ int) ([]notification.LeadNotification, error) {
	return nil, r.err
}

func (r *claimBatchErrorOnlyRepo) List(_ context.Context, _ repository.LeadNotificationListQuery) ([]notification.LeadNotification, error) {
	panic("unexpected")
}

func (r *claimBatchErrorOnlyRepo) Stats(_ context.Context) (repository.LeadNotificationBacklogStats, error) {
	panic("unexpected")
}

func (r *claimBatchErrorOnlyRepo) MarkSent(_ context.Context, _ uuid.UUID) error { panic("unexpected") }

func (r *claimBatchErrorOnlyRepo) MarkRetry(_ context.Context, _ uuid.UUID, _ int, _ time.Time, _ string) error {
	panic("unexpected")
}

func (r *claimBatchErrorOnlyRepo) MarkFailed(_ context.Context, _ uuid.UUID, _ int, _ string) error { panic("unexpected") }

func TestWorker_ClaimBatchError_IsLogged(t *testing.T) {
	obs.Init()

	// Capture standard logger output used by obs.Log.
	var buf bytes.Buffer
	oldOut := log.Writer()
	log.SetOutput(&buf)
	log.SetFlags(0)
	t.Cleanup(func() {
		log.SetOutput(oldOut)
	})

	repo := &claimBatchErrorOnlyRepo{err: errors.New("db down")}
	leadRepo := memory.NewLeadRepository()
	w := NewWorker(repo, leadRepo, nil)

	w.tick(context.Background())

	out := buf.String()
	if !strings.Contains(out, "\"event\":\"notify_claim_batch_error\"") {
		t.Fatalf("expected notify_claim_batch_error log, got: %s", out)
	}
	if !strings.Contains(out, "db down") {
		t.Fatalf("expected error in log, got: %s", out)
	}
}

func TestWorker_SendError_IsLogged(t *testing.T) {
	obs.Init()

	var buf bytes.Buffer
	oldOut := log.Writer()
	log.SetOutput(&buf)
	log.SetFlags(0)
	t.Cleanup(func() {
		log.SetOutput(oldOut)
	})

	ctx := context.Background()
	leadRepo := memory.NewLeadRepository()
	notifRepo := memory.NewLeadNotificationRepository()

	created, err := leadRepo.Create(ctx, lead.Lead{BusinessName: "X", ContactName: "Y", Consent: true})
	if err != nil {
		t.Fatalf("create lead: %v", err)
	}
	if err := notifRepo.Enqueue(ctx, created.ID, notification.ChannelEmail); err != nil {
		t.Fatalf("enqueue: %v", err)
	}

	sender := &fakeSender{channel: notification.ChannelEmail, err: errors.New("boom")}
	w := NewWorker(notifRepo, leadRepo, []ChannelSender{sender})

	w.tick(ctx)

	out := buf.String()
	if !strings.Contains(out, "\"event\":\"notify_send_failed\"") {
		t.Fatalf("expected notify_send_failed log, got: %s", out)
	}
	if !strings.Contains(out, "boom") {
		t.Fatalf("expected send error in log, got: %s", out)
	}
}

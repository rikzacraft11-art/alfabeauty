package notify

import (
	"context"
	"fmt"
	"log"
	"time"

	"example.com/alfabeauty-b2b/internal/domain/notification"
	"example.com/alfabeauty-b2b/internal/repository"
)

type Worker struct {
	repo      repository.LeadNotificationRepository
	leadRepo  repository.LeadRepository
	senders   map[string]ChannelSender
	pollEvery time.Duration
	batchSize int

	maxAttempts int
}

func NewWorker(repo repository.LeadNotificationRepository, leadRepo repository.LeadRepository, senders []ChannelSender) *Worker {
	m := make(map[string]ChannelSender, len(senders))
	for _, s := range senders {
		m[s.Channel()] = s
	}

	return &Worker{
		repo:        repo,
		leadRepo:    leadRepo,
		senders:     m,
		pollEvery:   3 * time.Second,
		batchSize:   20,
		maxAttempts: 10,
	}
}

func (w *Worker) Run(ctx context.Context) {
	t := time.NewTicker(w.pollEvery)
	defer t.Stop()

	for {
		select {
		case <-ctx.Done():
			return
		case <-t.C:
			w.tick(ctx)
		}
	}
}

func (w *Worker) tick(ctx context.Context) {
	items, err := w.repo.ClaimBatch(ctx, w.batchSize)
	if err != nil {
		log.Printf("notify worker: claim batch error: %v", err)
		return
	}
	if len(items) == 0 {
		return
	}

	for _, n := range items {
		sender, ok := w.senders[n.Channel]
		if !ok {
			_ = w.repo.MarkFailed(ctx, n.ID, n.Attempts+1, fmt.Sprintf("no sender configured for channel=%s", n.Channel))
			continue
		}

		l, err := w.leadRepo.GetByID(ctx, n.LeadID)
		if err != nil {
			w.retryOrFail(ctx, n, fmt.Errorf("load lead: %w", err))
			continue
		}

		if err := sender.Send(ctx, l); err != nil {
			w.retryOrFail(ctx, n, err)
			continue
		}

		if err := w.repo.MarkSent(ctx, n.ID); err != nil {
			log.Printf("notify worker: mark sent error (id=%s): %v", n.ID, err)
		}
	}
}

func (w *Worker) retryOrFail(ctx context.Context, n notification.LeadNotification, sendErr error) {
	attempt := n.Attempts + 1
	msg := truncate(sendErr.Error(), 900)

	if attempt >= w.maxAttempts {
		if err := w.repo.MarkFailed(ctx, n.ID, attempt, msg); err != nil {
			log.Printf("notify worker: mark failed error (id=%s): %v", n.ID, err)
		}
		return
	}

	next := time.Now().UTC().Add(computeBackoff(attempt))
	if err := w.repo.MarkRetry(ctx, n.ID, attempt, next, msg); err != nil {
		log.Printf("notify worker: mark retry error (id=%s): %v", n.ID, err)
	}
}

func truncate(s string, max int) string {
	if max <= 0 {
		return ""
	}
	if len(s) <= max {
		return s
	}
	return s[:max]
}

func computeBackoff(attempt int) time.Duration {
	// attempt is 1-based.
	switch attempt {
	case 1:
		return 1 * time.Minute
	case 2:
		return 5 * time.Minute
	case 3:
		return 15 * time.Minute
	case 4:
		return 1 * time.Hour
	case 5:
		return 6 * time.Hour
	default:
		return 24 * time.Hour
	}
}

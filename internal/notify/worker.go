package notify

import (
	"context"
	"fmt"
	"time"

	"example.com/alfabeauty-b2b/internal/domain/notification"
	"example.com/alfabeauty-b2b/internal/obs"
	"example.com/alfabeauty-b2b/internal/repository"
	"example.com/alfabeauty-b2b/pkg/metrics"
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
		obs.Log("notify_claim_batch_error", obs.Fields{
			"batch_size": w.batchSize,
			"error":      err.Error(),
		})
		return
	}
	if len(items) == 0 {
		return
	}

	for _, n := range items {
		sender, ok := w.senders[n.Channel]
		if !ok {
			msg := fmt.Sprintf("no sender configured for channel=%s", n.Channel)
			obs.Log("notify_sender_missing", obs.Fields{
				"notification_id": n.ID.String(),
				"channel":         n.Channel,
				"lead_id":          n.LeadID.String(),
				"attempt":         n.Attempts + 1,
			})
			if err := w.repo.MarkFailed(ctx, n.ID, n.Attempts+1, msg); err != nil {
				obs.Log("notify_mark_failed_error", obs.Fields{
					"notification_id": n.ID.String(),
					"channel":         n.Channel,
					"lead_id":          n.LeadID.String(),
					"attempt":         n.Attempts + 1,
					"error":           err.Error(),
				})
			}
			metrics.ObserveLeadNotificationSendWithTraceparent(n.Channel, "no_sender", 0, obs.TraceparentFromContext(ctx))
			continue
		}

		l, err := w.leadRepo.GetByID(ctx, n.LeadID)
		if err != nil {
			obs.Log("notify_load_lead_failed", obs.Fields{
				"notification_id": n.ID.String(),
				"channel":         n.Channel,
				"lead_id":          n.LeadID.String(),
				"attempt":         n.Attempts + 1,
				"error":           err.Error(),
			})
			w.retryOrFail(ctx, n, fmt.Errorf("load lead: %w", err))
			metrics.ObserveLeadNotificationSendWithTraceparent(n.Channel, "error", 0, obs.TraceparentFromContext(ctx))
			continue
		}

		sendStart := time.Now()
		if err := sender.Send(ctx, l); err != nil {
			obs.Log("notify_send_failed", obs.Fields{
				"notification_id": n.ID.String(),
				"channel":         n.Channel,
				"lead_id":          n.LeadID.String(),
				"attempt":         n.Attempts + 1,
				"error":           truncate(err.Error(), 900),
			})
			metrics.ObserveLeadNotificationSendWithTraceparent(n.Channel, "error", time.Since(sendStart), obs.TraceparentFromContext(ctx))
			w.retryOrFail(ctx, n, err)
			continue
		}
		metrics.ObserveLeadNotificationSendWithTraceparent(n.Channel, "ok", time.Since(sendStart), obs.TraceparentFromContext(ctx))

		if err := w.repo.MarkSent(ctx, n.ID); err != nil {
			obs.Log("notify_mark_sent_error", obs.Fields{
				"notification_id": n.ID.String(),
				"channel":         n.Channel,
				"lead_id":          n.LeadID.String(),
				"error":           err.Error(),
			})
		}
	}
}

func (w *Worker) retryOrFail(ctx context.Context, n notification.LeadNotification, sendErr error) {
	attempt := n.Attempts + 1
	msg := truncate(sendErr.Error(), 900)

	if attempt >= w.maxAttempts {
		if err := w.repo.MarkFailed(ctx, n.ID, attempt, msg); err != nil {
			obs.Log("notify_mark_failed_error", obs.Fields{
				"notification_id": n.ID.String(),
				"channel":         n.Channel,
				"lead_id":          n.LeadID.String(),
				"attempt":         attempt,
				"error":           err.Error(),
			})
		}
		return
	}

	next := time.Now().UTC().Add(computeBackoff(attempt))
	if err := w.repo.MarkRetry(ctx, n.ID, attempt, next, msg); err != nil {
		obs.Log("notify_mark_retry_error", obs.Fields{
			"notification_id": n.ID.String(),
			"channel":         n.Channel,
			"lead_id":          n.LeadID.String(),
			"attempt":         attempt,
			"error":           err.Error(),
		})
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

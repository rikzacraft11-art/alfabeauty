package repository

import (
	"context"
	"time"

	"github.com/google/uuid"

	"example.com/alfabeauty-b2b/internal/domain/notification"
)

type LeadNotificationRepository interface {
	Enqueue(ctx context.Context, leadID uuid.UUID, channel string) error
	ClaimBatch(ctx context.Context, limit int) ([]notification.LeadNotification, error)
	List(ctx context.Context, q LeadNotificationListQuery) ([]notification.LeadNotification, error)
	Stats(ctx context.Context) (LeadNotificationBacklogStats, error)
	MarkSent(ctx context.Context, id uuid.UUID) error
	MarkRetry(ctx context.Context, id uuid.UUID, attempt int, nextAttemptAt time.Time, lastError string) error
	MarkFailed(ctx context.Context, id uuid.UUID, attempt int, lastError string) error
}

// LeadNotificationBacklogStats is an ops-facing summary of the outbox backlog.
//
// Notes:
// - "pending" includes both ready-to-send (next_attempt_at <= now) and delayed retries.
// - "processing" indicates items currently claimed by a worker; stale ones may be reclaimed.
type LeadNotificationBacklogStats struct {
	CountsByStatus        map[string]int64
	PendingReadyCount     int64
	PendingDelayedCount   int64
	OldestReadyPendingAt  *time.Time
}

type LeadNotificationListQuery struct {
	Status  string
	Channel string
	LeadID  *uuid.UUID
	Limit   int
	Before  time.Time // CreatedAt < Before (optional)
}

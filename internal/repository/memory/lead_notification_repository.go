package memory

import (
	"context"
	"errors"
	"sort"
	"sync"
	"time"

	"github.com/google/uuid"

	"example.com/alfabeauty-b2b/internal/domain/notification"
	"example.com/alfabeauty-b2b/internal/repository"
)

var errNotFound = errors.New("notification not found")

type LeadNotificationRepository struct {
	mu    sync.Mutex
	items map[uuid.UUID]notification.LeadNotification
	uniq  map[string]uuid.UUID // leadID|channel -> id
}

func NewLeadNotificationRepository() *LeadNotificationRepository {
	return &LeadNotificationRepository{
		items: make(map[uuid.UUID]notification.LeadNotification),
		uniq:  make(map[string]uuid.UUID),
	}
}

func (r *LeadNotificationRepository) Enqueue(_ context.Context, leadID uuid.UUID, channel string) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	key := leadID.String() + "|" + channel
	if _, ok := r.uniq[key]; ok {
		return nil
	}

	now := time.Now().UTC()
	id := uuid.New()
	r.items[id] = notification.LeadNotification{
		ID:            id,
		LeadID:        leadID,
		Channel:       channel,
		Status:        notification.StatusPending,
		Attempts:      0,
		NextAttemptAt: now,
		CreatedAt:     now,
		UpdatedAt:     now,
	}
	r.uniq[key] = id
	return nil
}

func (r *LeadNotificationRepository) ClaimBatch(_ context.Context, limit int) ([]notification.LeadNotification, error) {
	r.mu.Lock()
	defer r.mu.Unlock()

	if limit <= 0 {
		limit = 10
	}

	now := time.Now().UTC()
	stuckBefore := now.Add(-10 * time.Minute)
	candidates := make([]notification.LeadNotification, 0, limit)
	for _, n := range r.items {
		switch n.Status {
		case notification.StatusPending:
			if n.NextAttemptAt.After(now) {
				continue
			}
		case notification.StatusProcessing:
			// Reclaim items that appear stuck (e.g., worker crashed) in dev.
			if n.UpdatedAt.After(stuckBefore) {
				continue
			}
		default:
			continue
		}
		candidates = append(candidates, n)
	}

	sort.Slice(candidates, func(i, j int) bool {
		return candidates[i].NextAttemptAt.Before(candidates[j].NextAttemptAt)
	})

	if len(candidates) > limit {
		candidates = candidates[:limit]
	}

	for i := range candidates {
		n := candidates[i]
		n.Status = notification.StatusProcessing
		n.UpdatedAt = now
		r.items[n.ID] = n
		candidates[i] = n
	}

	return candidates, nil
}

func (r *LeadNotificationRepository) MarkSent(_ context.Context, id uuid.UUID) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	n, ok := r.items[id]
	if !ok {
		return errNotFound
	}
	now := time.Now().UTC()
	n.Status = notification.StatusSent
	n.SentAt = &now
	n.UpdatedAt = now
	r.items[id] = n
	return nil
}

func (r *LeadNotificationRepository) MarkRetry(_ context.Context, id uuid.UUID, attempt int, nextAttemptAt time.Time, lastError string) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	n, ok := r.items[id]
	if !ok {
		return errNotFound
	}
	n.Status = notification.StatusPending
	n.Attempts = attempt
	n.NextAttemptAt = nextAttemptAt
	n.LastError = lastError
	n.UpdatedAt = time.Now().UTC()
	r.items[id] = n
	return nil
}

func (r *LeadNotificationRepository) MarkFailed(_ context.Context, id uuid.UUID, attempt int, lastError string) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	n, ok := r.items[id]
	if !ok {
		return errNotFound
	}
	n.Status = notification.StatusFailed
	n.Attempts = attempt
	n.LastError = lastError
	n.UpdatedAt = time.Now().UTC()
	r.items[id] = n
	return nil
}

func (r *LeadNotificationRepository) List(_ context.Context, q repository.LeadNotificationListQuery) ([]notification.LeadNotification, error) {
	r.mu.Lock()
	defer r.mu.Unlock()

	limit := q.Limit
	if limit <= 0 {
		limit = 100
	}
	if limit > 5000 {
		limit = 5000
	}

	res := make([]notification.LeadNotification, 0, min(limit, 128))
	for _, n := range r.items {
		if q.Status != "" && n.Status != q.Status {
			continue
		}
		if q.Channel != "" && n.Channel != q.Channel {
			continue
		}
		if q.LeadID != nil && n.LeadID != *q.LeadID {
			continue
		}
		if !q.Before.IsZero() && !n.CreatedAt.Before(q.Before) {
			continue
		}
		res = append(res, n)
	}

	sort.Slice(res, func(i, j int) bool {
		return res[i].CreatedAt.After(res[j].CreatedAt)
	})

	if len(res) > limit {
		res = res[:limit]
	}
	return res, nil
}

func (r *LeadNotificationRepository) Stats(_ context.Context) (repository.LeadNotificationBacklogStats, error) {
	r.mu.Lock()
	defer r.mu.Unlock()

	now := time.Now().UTC()
	counts := make(map[string]int64, 8)

	var pendingReady int64
	var pendingDelayed int64
	var oldestReady time.Time
	haveOldestReady := false

	for _, n := range r.items {
		counts[n.Status]++

		if n.Status == notification.StatusPending {
			if !n.NextAttemptAt.After(now) {
				pendingReady++
				if !haveOldestReady || n.CreatedAt.Before(oldestReady) {
					haveOldestReady = true
					oldestReady = n.CreatedAt
				}
			} else {
				pendingDelayed++
			}
		}
	}

	var oldestPtr *time.Time
	if haveOldestReady {
		t := oldestReady.UTC()
		oldestPtr = &t
	}

	return repository.LeadNotificationBacklogStats{
		CountsByStatus:       counts,
		PendingReadyCount:    pendingReady,
		PendingDelayedCount:  pendingDelayed,
		OldestReadyPendingAt: oldestPtr,
	}, nil
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}

// GetByID returns a copy of the notification by id.
//
// This is intentionally not part of the repository interface; it exists to
// support deterministic unit tests in the in-memory implementation.
func (r *LeadNotificationRepository) GetByID(id uuid.UUID) (notification.LeadNotification, error) {
	r.mu.Lock()
	defer r.mu.Unlock()

	n, ok := r.items[id]
	if !ok {
		return notification.LeadNotification{}, errNotFound
	}
	return n, nil
}

// IDs returns all notification IDs currently stored.
// Intended for tests.
func (r *LeadNotificationRepository) IDs() []uuid.UUID {
	r.mu.Lock()
	defer r.mu.Unlock()

	res := make([]uuid.UUID, 0, len(r.items))
	for id := range r.items {
		res = append(res, id)
	}
	return res
}

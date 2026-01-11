package postgres

import (
	"context"
	"database/sql"
	"fmt"
	"strings"
	"time"

	"github.com/google/uuid"

	"example.com/alfabeauty-b2b/internal/domain/notification"
	"example.com/alfabeauty-b2b/internal/repository"
)

type LeadNotificationRepository struct {
	db *sql.DB
}

func NewLeadNotificationRepository(db *sql.DB) *LeadNotificationRepository {
	return &LeadNotificationRepository{db: db}
}

func (r *LeadNotificationRepository) Enqueue(ctx context.Context, leadID uuid.UUID, channel string) error {
	q := `
		INSERT INTO public.lead_notifications (lead_id, channel)
		VALUES ($1, $2)
		ON CONFLICT (lead_id, channel) DO NOTHING;
	`
	if _, err := r.db.ExecContext(ctx, q, leadID, channel); err != nil {
		return fmt.Errorf("enqueue notification: %w", err)
	}
	return nil
}

func (r *LeadNotificationRepository) Stats(ctx context.Context) (repository.LeadNotificationBacklogStats, error) {
	// 1) Counts per status.
	counts := make(map[string]int64, 8)
	rows, err := r.db.QueryContext(ctx, `
		SELECT status, COUNT(*)
		FROM public.lead_notifications
		GROUP BY status
	`)
	if err != nil {
		return repository.LeadNotificationBacklogStats{}, fmt.Errorf("stats counts query: %w", err)
	}
	defer rows.Close()
	for rows.Next() {
		var status string
		var count int64
		if err := rows.Scan(&status, &count); err != nil {
			return repository.LeadNotificationBacklogStats{}, fmt.Errorf("stats counts scan: %w", err)
		}
		counts[status] = count
	}
	if err := rows.Err(); err != nil {
		return repository.LeadNotificationBacklogStats{}, fmt.Errorf("stats counts rows: %w", err)
	}

	// 2) Pending breakdown (ready vs delayed) + oldest ready pending.
	var pendingReady, pendingDelayed int64
	var oldestReady sql.NullTime
	err = r.db.QueryRowContext(ctx, `
		SELECT
			COUNT(*) FILTER (WHERE status = 'pending' AND next_attempt_at <= now()) AS pending_ready,
			COUNT(*) FILTER (WHERE status = 'pending' AND next_attempt_at >  now()) AS pending_delayed,
			MIN(created_at) FILTER (WHERE status = 'pending' AND next_attempt_at <= now()) AS oldest_ready_pending
		FROM public.lead_notifications
	`).Scan(&pendingReady, &pendingDelayed, &oldestReady)
	if err != nil {
		return repository.LeadNotificationBacklogStats{}, fmt.Errorf("stats pending query: %w", err)
	}

	var oldest *time.Time
	if oldestReady.Valid {
		t := oldestReady.Time.UTC()
		oldest = &t
	}

	return repository.LeadNotificationBacklogStats{
		CountsByStatus:       counts,
		PendingReadyCount:    pendingReady,
		PendingDelayedCount:  pendingDelayed,
		OldestReadyPendingAt: oldest,
	}, nil
}

func (r *LeadNotificationRepository) ClaimBatch(ctx context.Context, limit int) ([]notification.LeadNotification, error) {
	if limit <= 0 {
		limit = 10
	}
	if limit > 200 {
		limit = 200
	}

	q := `
		WITH cte AS (
			SELECT id
			FROM public.lead_notifications
			WHERE (
					(status = 'pending' AND next_attempt_at <= now())
				 OR (status = 'processing' AND updated_at <= (now() - interval '10 minutes'))
				)
			ORDER BY next_attempt_at ASC, created_at ASC
			FOR UPDATE SKIP LOCKED
			LIMIT $1
		)
		UPDATE public.lead_notifications n
		SET status = 'processing', updated_at = now()
		FROM cte
		WHERE n.id = cte.id
		RETURNING
			n.id,
			n.lead_id,
			n.channel,
			n.status,
			n.attempts,
			n.next_attempt_at,
			n.last_error,
			n.created_at,
			n.updated_at,
			n.sent_at;
	`

	rows, err := r.db.QueryContext(ctx, q, limit)
	if err != nil {
		return nil, fmt.Errorf("claim batch: %w", err)
	}
	defer rows.Close()

	res := make([]notification.LeadNotification, 0, limit)
	for rows.Next() {
		var n notification.LeadNotification
		var sentAt sql.NullTime
		if err := rows.Scan(
			&n.ID,
			&n.LeadID,
			&n.Channel,
			&n.Status,
			&n.Attempts,
			&n.NextAttemptAt,
			&n.LastError,
			&n.CreatedAt,
			&n.UpdatedAt,
			&sentAt,
		); err != nil {
			return nil, fmt.Errorf("scan notification: %w", err)
		}
		if sentAt.Valid {
			t := sentAt.Time
			n.SentAt = &t
		}
		res = append(res, n)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("rows: %w", err)
	}
	return res, nil
}

func (r *LeadNotificationRepository) MarkSent(ctx context.Context, id uuid.UUID) error {
	q := `
		UPDATE public.lead_notifications
		SET status = 'sent', sent_at = now(), updated_at = now()
		WHERE id = $1;
	`
	if _, err := r.db.ExecContext(ctx, q, id); err != nil {
		return fmt.Errorf("mark sent: %w", err)
	}
	return nil
}

func (r *LeadNotificationRepository) MarkRetry(ctx context.Context, id uuid.UUID, attempt int, nextAttemptAt time.Time, lastError string) error {
	q := `
		UPDATE public.lead_notifications
		SET status = 'pending',
			attempts = $2,
			next_attempt_at = $3,
			last_error = $4,
			updated_at = now()
		WHERE id = $1;
	`
	if _, err := r.db.ExecContext(ctx, q, id, attempt, nextAttemptAt, lastError); err != nil {
		return fmt.Errorf("mark retry: %w", err)
	}
	return nil
}

func (r *LeadNotificationRepository) MarkFailed(ctx context.Context, id uuid.UUID, attempt int, lastError string) error {
	q := `
		UPDATE public.lead_notifications
		SET status = 'failed',
			attempts = $2,
			last_error = $3,
			updated_at = now()
		WHERE id = $1;
	`
	if _, err := r.db.ExecContext(ctx, q, id, attempt, lastError); err != nil {
		return fmt.Errorf("mark failed: %w", err)
	}
	return nil
}

func (r *LeadNotificationRepository) List(ctx context.Context, q repository.LeadNotificationListQuery) ([]notification.LeadNotification, error) {
	limit := q.Limit
	if limit <= 0 {
		limit = 100
	}
	if limit > 5000 {
		limit = 5000
	}

	where := make([]string, 0, 4)
	args := make([]any, 0, 6)

	add := func(cond string, arg any) {
		where = append(where, cond)
		args = append(args, arg)
	}

	if strings.TrimSpace(q.Status) != "" {
		add(fmt.Sprintf("status = $%d", len(args)+1), strings.TrimSpace(q.Status))
	}
	if strings.TrimSpace(q.Channel) != "" {
		add(fmt.Sprintf("channel = $%d", len(args)+1), strings.TrimSpace(q.Channel))
	}
	if q.LeadID != nil {
		add(fmt.Sprintf("lead_id = $%d", len(args)+1), *q.LeadID)
	}
	if !q.Before.IsZero() {
		add(fmt.Sprintf("created_at < $%d", len(args)+1), q.Before)
	}

	qBase := `
		SELECT
			id,
			lead_id,
			channel,
			status,
			attempts,
			next_attempt_at,
			last_error,
			created_at,
			updated_at,
			sent_at
		FROM public.lead_notifications
	`
	if len(where) > 0 {
		qBase += " WHERE " + strings.Join(where, " AND ")
	}
	qBase += fmt.Sprintf(" ORDER BY created_at DESC LIMIT $%d", len(args)+1)
	args = append(args, limit)

	rows, err := r.db.QueryContext(ctx, qBase, args...)
	if err != nil {
		return nil, fmt.Errorf("list notifications: %w", err)
	}
	defer rows.Close()

	res := make([]notification.LeadNotification, 0, min(limit, 256))
	for rows.Next() {
		var n notification.LeadNotification
		var sentAt sql.NullTime
		if err := rows.Scan(
			&n.ID,
			&n.LeadID,
			&n.Channel,
			&n.Status,
			&n.Attempts,
			&n.NextAttemptAt,
			&n.LastError,
			&n.CreatedAt,
			&n.UpdatedAt,
			&sentAt,
		); err != nil {
			return nil, fmt.Errorf("scan notification: %w", err)
		}
		if sentAt.Valid {
			t := sentAt.Time
			n.SentAt = &t
		}
		res = append(res, n)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("rows: %w", err)
	}
	return res, nil
}

package postgres

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"

	"example.com/alfabeauty-b2b/internal/domain/lead"
)

type LeadRepository struct {
	db *sql.DB
}

func NewLeadRepository(db *sql.DB) *LeadRepository {
	return &LeadRepository{db: db}
}

func (r *LeadRepository) Create(ctx context.Context, l lead.Lead) (lead.Lead, error) {
	l.Normalize()

	raw, _ := json.Marshal(map[string]any{
		"name":             l.Name,
		"email":            l.Email,
		"phone":            l.Phone,
		"message":          l.Message,
		"page_url_initial": l.PageURLInitial,
		"page_url_current": l.PageURLCurrent,
		"user_agent":       l.UserAgent,
		"ip_address":       l.IPAddress,
	})

	q := `
		INSERT INTO leads (
			name, email, phone, message,
			page_url_initial, page_url_current,
			user_agent, ip_address,
			raw
		)
		VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
		RETURNING id, created_at;
	`

	row := r.db.QueryRowContext(ctx, q,
		l.Name,
		l.Email,
		l.Phone,
		l.Message,
		l.PageURLInitial,
		l.PageURLCurrent,
		l.UserAgent,
		l.IPAddress,
		raw,
	)

	if err := row.Scan(&l.ID, &l.CreatedAt); err != nil {
		return lead.Lead{}, fmt.Errorf("insert lead: %w", err)
	}

	return l, nil
}

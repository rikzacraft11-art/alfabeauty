package repository

import (
	"context"
	"time"

	"example.com/alfabeauty-b2b/internal/domain/lead"
)

type LeadRepository interface {
	Create(ctx context.Context, l lead.Lead) (lead.Lead, error)
	List(ctx context.Context, limit int, before time.Time) ([]lead.Lead, error)
}

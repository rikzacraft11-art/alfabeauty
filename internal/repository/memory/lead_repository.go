package memory

import (
	"context"
	"errors"
	"sync"
	"time"

	"github.com/google/uuid"

	"example.com/alfabeauty-b2b/internal/domain/lead"
)

var errLeadNotFound = errors.New("lead not found")

const defaultLeadCapacity = 64

type LeadRepository struct {
	mu     sync.Mutex
	leads  []lead.Lead
	byKey  map[string]lead.Lead
}

func NewLeadRepository() *LeadRepository {
	return &LeadRepository{
		leads: make([]lead.Lead, 0, defaultLeadCapacity),
		byKey: make(map[string]lead.Lead),
	}
}

func (r *LeadRepository) Create(_ context.Context, l lead.Lead) (lead.Lead, error) {
	r.mu.Lock()
	defer r.mu.Unlock()

	// Idempotency: if caller provided a key hash, return the existing lead.
	if l.IdempotencyKeyHash != "" {
		if existing, ok := r.byKey[l.IdempotencyKeyHash]; ok {
			return existing, nil
		}
	}

	l.ID = uuid.New()
	l.CreatedAt = time.Now().UTC()
	l.Normalize()

	r.leads = append(r.leads, l)
	if l.IdempotencyKeyHash != "" {
		r.byKey[l.IdempotencyKeyHash] = l
	}
	return l, nil
}

func (r *LeadRepository) GetByID(_ context.Context, id uuid.UUID) (lead.Lead, error) {
	r.mu.Lock()
	defer r.mu.Unlock()

	for i := range r.leads {
		if r.leads[i].ID == id {
			return r.leads[i], nil
		}
	}
	return lead.Lead{}, errLeadNotFound
}

func (r *LeadRepository) List(_ context.Context, limit int, before time.Time) ([]lead.Lead, error) {
	r.mu.Lock()
	defer r.mu.Unlock()

	if limit <= 0 {
		limit = 100
	}
	// Keep memory implementation simple: newest-first based on CreatedAt.
	res := make([]lead.Lead, 0, limit)
	for i := len(r.leads) - 1; i >= 0 && len(res) < limit; i-- {
		l := r.leads[i]
		if !before.IsZero() && !l.CreatedAt.Before(before) {
			continue
		}
		res = append(res, l)
	}
	return res, nil
}

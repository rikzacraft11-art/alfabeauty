package service

import (
	"context"
	"time"

	"example.com/alfabeauty-b2b/internal/domain/lead"
	"example.com/alfabeauty-b2b/internal/repository"
)

type LeadService struct {
	repo repository.LeadRepository
}

func NewLeadService(repo repository.LeadRepository) *LeadService {
	return &LeadService{repo: repo}
}

func (s *LeadService) Create(ctx context.Context, l lead.Lead) (lead.Lead, error) {
	l.Normalize()
	if err := l.Validate(); err != nil {
		return lead.Lead{}, err
	}
	return s.repo.Create(ctx, l)
}

func (s *LeadService) List(ctx context.Context, limit int, before time.Time) ([]lead.Lead, error) {
	return s.repo.List(ctx, limit, before)
}

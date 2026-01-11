package service

import (
	"context"
	"log"
	"time"

	"example.com/alfabeauty-b2b/internal/domain/lead"
	"example.com/alfabeauty-b2b/internal/domain/notification"
	"example.com/alfabeauty-b2b/internal/repository"
)

type LeadService struct {
	repo             repository.LeadRepository
	notificationRepo repository.LeadNotificationRepository
	enableEmail      bool
	enableWebhook    bool
}

func NewLeadService(repo repository.LeadRepository) *LeadService {
	return &LeadService{repo: repo}
}

func NewLeadServiceWithNotifications(
	repo repository.LeadRepository,
	notificationRepo repository.LeadNotificationRepository,
	enableEmail bool,
	enableWebhook bool,
) *LeadService {
	return &LeadService{
		repo:             repo,
		notificationRepo: notificationRepo,
		enableEmail:      enableEmail,
		enableWebhook:    enableWebhook,
	}
}

func (s *LeadService) Create(ctx context.Context, l lead.Lead) (lead.Lead, error) {
	l.Normalize()
	if err := l.Validate(); err != nil {
		return lead.Lead{}, err
	}
	created, err := s.repo.Create(ctx, l)
	if err != nil {
		return lead.Lead{}, err
	}

	// Enqueue notifications (non-blocking for intake): a failure here must not lose the lead.
	if s.notificationRepo != nil {
		if s.enableEmail {
			if err := s.notificationRepo.Enqueue(ctx, created.ID, notification.ChannelEmail); err != nil {
				log.Printf("lead notify enqueue email failed (lead_id=%s): %v", created.ID, err)
			}
		}
		if s.enableWebhook {
			if err := s.notificationRepo.Enqueue(ctx, created.ID, notification.ChannelWebhook); err != nil {
				log.Printf("lead notify enqueue webhook failed (lead_id=%s): %v", created.ID, err)
			}
		}
	}

	return created, nil
}

func (s *LeadService) List(ctx context.Context, limit int, before time.Time) ([]lead.Lead, error) {
	return s.repo.List(ctx, limit, before)
}

func (s *LeadService) ListNotifications(ctx context.Context, q repository.LeadNotificationListQuery) ([]notification.LeadNotification, error) {
	if s.notificationRepo == nil {
		return nil, nil
	}
	return s.notificationRepo.List(ctx, q)
}

func (s *LeadService) NotificationBacklogStats(ctx context.Context) (repository.LeadNotificationBacklogStats, error) {
	if s.notificationRepo == nil {
		return repository.LeadNotificationBacklogStats{CountsByStatus: map[string]int64{}}, nil
	}
	return s.notificationRepo.Stats(ctx)
}

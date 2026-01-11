package service

import (
	"context"
	"testing"
	"time"

	"example.com/alfabeauty-b2b/internal/domain/lead"
	"example.com/alfabeauty-b2b/internal/domain/notification"
	"example.com/alfabeauty-b2b/internal/repository/memory"
)

func TestLeadService_Create_EnqueuesNotifications_WhenEnabled(t *testing.T) {
	ctx := context.Background()

	leadRepo := memory.NewLeadRepository()
	notifRepo := memory.NewLeadNotificationRepository()

	svc := NewLeadServiceWithNotifications(leadRepo, notifRepo, true, true)

	created, err := svc.Create(ctx, lead.Lead{
		Name:    "PT Contoh",
		Email:   "ops@example.com",
		Phone:   "",
		Message: "hello",
	})
	if err != nil {
		t.Fatalf("Create: %v", err)
	}

	items, err := notifRepo.ClaimBatch(ctx, 10)
	if err != nil {
		t.Fatalf("ClaimBatch: %v", err)
	}
	if len(items) != 2 {
		t.Fatalf("expected 2 notifications, got %d", len(items))
	}

	seen := map[string]bool{}
	for _, it := range items {
		if it.LeadID != created.ID {
			t.Fatalf("unexpected lead_id: got %s want %s", it.LeadID, created.ID)
		}
		seen[it.Channel] = true
	}
	if !seen[notification.ChannelEmail] {
		t.Fatalf("expected email notification")
	}
	if !seen[notification.ChannelWebhook] {
		t.Fatalf("expected webhook notification")
	}
}

func TestLeadService_Create_DoesNotEnqueueNotifications_WhenDisabled(t *testing.T) {
	ctx := context.Background()

	leadRepo := memory.NewLeadRepository()
	notifRepo := memory.NewLeadNotificationRepository()

	svc := NewLeadServiceWithNotifications(leadRepo, notifRepo, false, false)

	_, err := svc.Create(ctx, lead.Lead{
		Name:    "PT Contoh",
		Phone:   "+62",
		Message: "hello",
	})
	if err != nil {
		t.Fatalf("Create: %v", err)
	}

	// Give a tiny bit of room for the time-based claim filter.
	time.Sleep(5 * time.Millisecond)

	items, err := notifRepo.ClaimBatch(ctx, 10)
	if err != nil {
		t.Fatalf("ClaimBatch: %v", err)
	}
	if len(items) != 0 {
		t.Fatalf("expected 0 notifications, got %d", len(items))
	}
}

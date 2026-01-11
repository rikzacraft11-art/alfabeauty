package notification

import (
	"time"

	"github.com/google/uuid"
)

const (
	ChannelEmail   = "email"
	ChannelWebhook = "webhook"

	StatusPending    = "pending"
	StatusProcessing = "processing"
	StatusSent       = "sent"
	StatusFailed     = "failed"
)

type LeadNotification struct {
	ID            uuid.UUID
	LeadID        uuid.UUID
	Channel       string
	Status        string
	Attempts      int
	NextAttemptAt time.Time
	LastError     string
	CreatedAt     time.Time
	UpdatedAt     time.Time
	SentAt        *time.Time
}

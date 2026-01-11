package notify

import (
	"context"

	"example.com/alfabeauty-b2b/internal/domain/lead"
)

type ChannelSender interface {
	Channel() string
	Send(ctx context.Context, l lead.Lead) error
}

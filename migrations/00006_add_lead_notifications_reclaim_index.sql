-- +goose Up
-- +goose StatementBegin
-- Support reclaiming notifications stuck in 'processing' by updated_at.
CREATE INDEX IF NOT EXISTS lead_notifications_status_updated_at_idx
  ON public.lead_notifications (status, updated_at);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP INDEX IF EXISTS lead_notifications_status_updated_at_idx;
-- +goose StatementEnd

-- +goose Up
-- +goose StatementBegin
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.lead_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,

  channel text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  attempts integer NOT NULL DEFAULT 0,
  next_attempt_at timestamptz NOT NULL DEFAULT now(),
  last_error text NOT NULL DEFAULT '',

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  sent_at timestamptz
);

-- Enforce one notification per channel per lead.
CREATE UNIQUE INDEX IF NOT EXISTS lead_notifications_lead_channel_uidx
  ON public.lead_notifications (lead_id, channel);

CREATE INDEX IF NOT EXISTS lead_notifications_pending_idx
  ON public.lead_notifications (status, next_attempt_at, created_at);

CREATE INDEX IF NOT EXISTS lead_notifications_lead_id_idx
  ON public.lead_notifications (lead_id);

-- Basic guardrails.
ALTER TABLE public.lead_notifications
  ADD CONSTRAINT lead_notifications_channel_chk
  CHECK (channel IN ('email','webhook'));

ALTER TABLE public.lead_notifications
  ADD CONSTRAINT lead_notifications_status_chk
  CHECK (status IN ('pending','processing','sent','failed'));
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS public.lead_notifications;
-- +goose StatementEnd

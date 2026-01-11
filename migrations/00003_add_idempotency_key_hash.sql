-- +goose Up
-- +goose StatementBegin
ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS idempotency_key_hash text;

-- Only enforce uniqueness when the key is provided.
CREATE UNIQUE INDEX IF NOT EXISTS leads_idempotency_key_hash_uidx
  ON public.leads (idempotency_key_hash)
  WHERE idempotency_key_hash IS NOT NULL;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP INDEX IF EXISTS public.leads_idempotency_key_hash_uidx;

ALTER TABLE public.leads
  DROP COLUMN IF EXISTS idempotency_key_hash;
-- +goose StatementEnd

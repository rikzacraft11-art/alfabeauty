-- +goose Up
-- +goose StatementBegin
-- Keep lead_notifications private in Supabase:
-- 1) Enable RLS
-- 2) Do not create policies (default deny)
-- 3) Revoke grants for anon/authenticated roles
ALTER TABLE public.lead_notifications ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.lead_notifications FROM anon;
REVOKE ALL ON TABLE public.lead_notifications FROM authenticated;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
-- Best-effort rollback.
ALTER TABLE public.lead_notifications DISABLE ROW LEVEL SECURITY;

-- Restore minimal read/write (NOT recommended for production); included only for reversibility.
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.lead_notifications TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.lead_notifications TO authenticated;
-- +goose StatementEnd

-- Create beta_signups table
CREATE TABLE IF NOT EXISTS beta_signups (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       TEXT NOT NULL UNIQUE,
  name        TEXT,
  zip_code    TEXT,
  source      TEXT DEFAULT 'landing_page',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE beta_signups ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (signup)
CREATE POLICY "Anyone can sign up for beta"
  ON beta_signups FOR INSERT
  WITH CHECK (true);

-- Admins can view all
CREATE POLICY "Admins can view all beta signups"
  ON beta_signups FOR SELECT
  USING ((select is_admin()));

GRANT INSERT ON beta_signups TO anon;
GRANT INSERT ON beta_signups TO authenticated;
GRANT SELECT ON beta_signups TO authenticated;

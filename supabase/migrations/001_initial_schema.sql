CREATE TABLE calculations (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id          UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name             TEXT,
  city             TEXT NOT NULL,
  global_params    JSONB NOT NULL,
  monthly_data     JSONB NOT NULL,
  enabled_months   JSONB NOT NULL,
  annual_bonus     NUMERIC NOT NULL DEFAULT 0,
  bonus_month      INTEGER NOT NULL DEFAULT 1,
  bonus_tax_method TEXT NOT NULL DEFAULT 'separate',
  special_deduction NUMERIC NOT NULL DEFAULT 0,
  total_gross      NUMERIC,
  total_net        NUMERIC,
  total_tax        NUMERIC,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_calculations_user_id ON calculations(user_id);
CREATE INDEX idx_calculations_updated_at ON calculations(updated_at DESC);

ALTER TABLE calculations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own calculations"
  ON calculations FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own calculations"
  ON calculations FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own calculations"
  ON calculations FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own calculations"
  ON calculations FOR DELETE USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON calculations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

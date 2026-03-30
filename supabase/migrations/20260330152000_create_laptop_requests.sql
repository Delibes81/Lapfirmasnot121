-- Create tracking table for laptop requests
CREATE TABLE IF NOT EXISTS laptop_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    applicant_name TEXT NOT NULL,
    lawyer_name TEXT NOT NULL,
    reason TEXT NOT NULL,
    requested_laptop_id TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pendiente', -- 'pendiente', 'aprobada', 'rechazada'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) but default allow for now
ALTER TABLE laptop_requests ENABLE ROW LEVEL SECURITY;

-- Allow read access for everyone
CREATE POLICY "Allow select on laptop_requests" ON laptop_requests
    FOR SELECT USING (true);

-- Allow insert access for everyone
CREATE POLICY "Allow insert on laptop_requests" ON laptop_requests
    FOR INSERT WITH CHECK (true);

-- Allow update access for everyone
CREATE POLICY "Allow update on laptop_requests" ON laptop_requests
    FOR UPDATE USING (true);

-- Create a generic trigger to auto-update 'updated_at'
CREATE OR REPLACE FUNCTION set_current_timestamp_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_laptop_requests_updated_at
BEFORE UPDATE ON laptop_requests
FOR EACH ROW
EXECUTE FUNCTION set_current_timestamp_updated_at();

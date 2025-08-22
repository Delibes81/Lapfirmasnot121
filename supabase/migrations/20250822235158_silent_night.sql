/*
  # Create assignments table for history tracking

  1. New Tables
    - `assignments`
      - `id` (uuid, primary key)
      - `laptop_id` (text, references laptops)
      - `user_name` (text)
      - `biometric_serial` (text, optional)
      - `assigned_at` (timestamp)
      - `returned_at` (timestamp, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `assignments` table
    - Add policy for all operations for everyone (matching laptops table)

  3. Indexes
    - Index on laptop_id for faster queries
    - Index on assigned_at for chronological sorting
*/

CREATE TABLE IF NOT EXISTS assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  laptop_id text NOT NULL,
  user_name text NOT NULL,
  biometric_serial text,
  assigned_at timestamptz NOT NULL DEFAULT now(),
  returned_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add foreign key constraint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'assignments_laptop_id_fkey'
  ) THEN
    ALTER TABLE assignments ADD CONSTRAINT assignments_laptop_id_fkey 
    FOREIGN KEY (laptop_id) REFERENCES laptops(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_assignments_laptop_id ON assignments(laptop_id);
CREATE INDEX IF NOT EXISTS idx_assignments_assigned_at ON assignments(assigned_at DESC);
CREATE INDEX IF NOT EXISTS idx_assignments_returned_at ON assignments(returned_at);

-- Enable RLS
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;

-- Create policy for all operations
DROP POLICY IF EXISTS "Allow all operations for everyone" ON assignments;
CREATE POLICY "Allow all operations for everyone"
  ON assignments
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION update_assignments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS update_assignments_updated_at ON assignments;
CREATE TRIGGER update_assignments_updated_at
  BEFORE UPDATE ON assignments
  FOR EACH ROW
  EXECUTE FUNCTION update_assignments_updated_at();
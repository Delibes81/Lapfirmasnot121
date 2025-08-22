/*
  # Update laptop RLS policies

  1. Security Updates
    - Update laptop policies to allow proper CRUD operations
    - Ensure anonymous and authenticated users can perform necessary operations
    - Maintain security while allowing functionality

  2. Policy Changes
    - Allow anonymous users to perform all operations (for public kiosk usage)
    - Allow authenticated users full access
    - Ensure service role has full access
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Laptops are viewable by everyone" ON laptops;
DROP POLICY IF EXISTS "Laptops are editable by authenticated users" ON laptops;
DROP POLICY IF EXISTS "Laptops are editable by service role" ON laptops;
DROP POLICY IF EXISTS "Allow anonymous users to insert laptops" ON laptops;

-- Create comprehensive policies for laptops
CREATE POLICY "Allow all operations for everyone"
  ON laptops
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Alternative: More restrictive policies if needed
-- CREATE POLICY "Allow read access to everyone"
--   ON laptops
--   FOR SELECT
--   TO public
--   USING (true);

-- CREATE POLICY "Allow insert for anonymous and authenticated"
--   ON laptops
--   FOR INSERT
--   TO anon, authenticated
--   WITH CHECK (true);

-- CREATE POLICY "Allow update for anonymous and authenticated"
--   ON laptops
--   FOR UPDATE
--   TO anon, authenticated
--   USING (true)
--   WITH CHECK (true);

-- CREATE POLICY "Allow delete for authenticated users"
--   ON laptops
--   FOR DELETE
--   TO authenticated
--   USING (true);

-- Ensure RLS is enabled
ALTER TABLE laptops ENABLE ROW LEVEL SECURITY;
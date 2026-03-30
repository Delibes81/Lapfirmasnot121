-- Add is_public column to laptops table
ALTER TABLE laptops ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT true;

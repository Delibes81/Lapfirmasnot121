-- Migration to add a name/alias column to laptops
ALTER TABLE laptops ADD COLUMN IF NOT EXISTS name text;

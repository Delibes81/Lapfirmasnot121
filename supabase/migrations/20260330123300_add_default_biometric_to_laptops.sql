-- Add default_biometric column to laptops table
ALTER TABLE laptops ADD COLUMN IF NOT EXISTS default_biometric TEXT;

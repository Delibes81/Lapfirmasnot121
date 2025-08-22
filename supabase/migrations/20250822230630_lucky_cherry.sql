/*
  # Add assigned_at column to laptops table

  1. Changes
    - Add `assigned_at` column to `laptops` table
    - Column type: timestamp with time zone
    - Nullable: true (allows null values)
    - Used to track when a laptop was assigned to a user

  2. Notes
    - This column is required for the assignment functionality
    - Will be set when a laptop is assigned to a user
    - Will be null when laptop is available or returned
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'laptops' AND column_name = 'assigned_at'
  ) THEN
    ALTER TABLE laptops ADD COLUMN assigned_at timestamptz;
  END IF;
END $$;
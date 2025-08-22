/*
  # Add missing columns to laptops table

  1. New Columns
    - `assigned_user` (text, nullable) - stores the name of the user assigned to the laptop
    - `assigned_at` (timestamptz, nullable) - stores when the laptop was assigned
    - `status` (laptop_status enum, default 'disponible') - stores the current status of the laptop

  2. Changes
    - Add missing columns that the application expects
    - Set appropriate defaults and constraints
    - Ensure compatibility with existing data
*/

-- Add assigned_user column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'laptops' AND column_name = 'assigned_user'
  ) THEN
    ALTER TABLE public.laptops ADD COLUMN assigned_user TEXT;
  END IF;
END $$;

-- Add assigned_at column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'laptops' AND column_name = 'assigned_at'
  ) THEN
    ALTER TABLE public.laptops ADD COLUMN assigned_at TIMESTAMPTZ;
  END IF;
END $$;

-- Add status column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'laptops' AND column_name = 'status'
  ) THEN
    ALTER TABLE public.laptops ADD COLUMN status laptop_status DEFAULT 'disponible';
  END IF;
END $$;
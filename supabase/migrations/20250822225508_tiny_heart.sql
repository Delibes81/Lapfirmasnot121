/*
  # Agregar campos de asignación a laptops

  1. Nuevos Campos
    - `status` (enum): Estado de la laptop (disponible, en-uso, mantenimiento)
    - `current_user` (text): Usuario actual que tiene asignada la laptop
    - `biometric_serial` (text): Número de serie del biométrico asignado
    - `assigned_at` (timestamp): Fecha y hora de asignación

  2. Enum
    - Crear tipo enum para el estado de las laptops

  3. Índices
    - Agregar índices para mejorar consultas por estado y biométrico
*/

-- Crear enum para el estado de las laptops
DO $$ BEGIN
  CREATE TYPE laptop_status AS ENUM ('disponible', 'en-uso', 'mantenimiento');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Agregar campos de asignación a la tabla laptops
DO $$
BEGIN
  -- Agregar campo status
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'laptops' AND column_name = 'status'
  ) THEN
    ALTER TABLE laptops ADD COLUMN status laptop_status DEFAULT 'disponible';
  END IF;

  -- Agregar campo current_user
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'laptops' AND column_name = 'current_user'
  ) THEN
    ALTER TABLE laptops ADD COLUMN current_user text;
  END IF;

  -- Agregar campo biometric_serial (referencia al dispositivo biométrico)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'laptops' AND column_name = 'biometric_serial'
  ) THEN
    ALTER TABLE laptops ADD COLUMN biometric_serial text;
  END IF;

  -- Agregar campo assigned_at
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'laptops' AND column_name = 'assigned_at'
  ) THEN
    ALTER TABLE laptops ADD COLUMN assigned_at timestamptz;
  END IF;
END $$;

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_laptops_status ON laptops(status);
CREATE INDEX IF NOT EXISTS idx_laptops_current_user ON laptops(current_user);
CREATE INDEX IF NOT EXISTS idx_laptops_biometric_serial ON laptops(biometric_serial);

-- Comentarios para documentar los campos
COMMENT ON COLUMN laptops.status IS 'Estado actual de la laptop: disponible, en-uso, mantenimiento';
COMMENT ON COLUMN laptops.current_user IS 'Nombre del usuario que tiene asignada la laptop actualmente';
COMMENT ON COLUMN laptops.biometric_serial IS 'Número de serie del dispositivo biométrico asignado a esta laptop';
COMMENT ON COLUMN laptops.assigned_at IS 'Fecha y hora cuando se asignó la laptop al usuario actual';
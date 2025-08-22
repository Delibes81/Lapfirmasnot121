/*
  # Agregar columnas faltantes a tabla laptops

  1. Nuevas Columnas
    - `status` (enum: disponible, en-uso, mantenimiento)
    - `current_user` (texto, nullable para usuario asignado)
    - `biometric_reader` (boolean, por defecto false)
    - `biometric_serial` (texto, nullable para número de serie del lector)

  2. Seguridad
    - Mantiene las políticas RLS existentes
    - Actualiza automáticamente updated_at
*/

-- Crear tipo enum para status si no existe
DO $$ BEGIN
    CREATE TYPE laptop_status AS ENUM ('disponible', 'en-uso', 'mantenimiento');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Agregar columnas faltantes
DO $$
BEGIN
  -- Agregar columna status
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'laptops' AND column_name = 'status'
  ) THEN
    ALTER TABLE laptops ADD COLUMN status laptop_status DEFAULT 'disponible';
  END IF;

  -- Agregar columna current_user
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'laptops' AND column_name = 'current_user'
  ) THEN
    ALTER TABLE laptops ADD COLUMN current_user text;
  END IF;

  -- Agregar columna biometric_reader
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'laptops' AND column_name = 'biometric_reader'
  ) THEN
    ALTER TABLE laptops ADD COLUMN biometric_reader boolean DEFAULT false;
  END IF;

  -- Agregar columna biometric_serial
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'laptops' AND column_name = 'biometric_serial'
  ) THEN
    ALTER TABLE laptops ADD COLUMN biometric_serial text;
  END IF;
END $$;
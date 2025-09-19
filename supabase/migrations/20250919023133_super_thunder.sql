/*
  # Initial database schema for laptop management system

  1. New Tables
    - `laptops`
      - `id` (text, primary key)
      - `brand` (text, not null)
      - `model` (text, not null) 
      - `serial_number` (text, unique, not null)
      - `biometric_reader` (boolean, default false)
      - `biometric_serial` (text, nullable)
      - `status` (text, default 'disponible', check constraint)
      - `assigned_user` (text, nullable) - renamed from current_user
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())
    
    - `assignments`
      - `id` (uuid, primary key, auto-generated)
      - `laptop_id` (text, foreign key to laptops.id)
      - `user_name` (text, not null)
      - `purpose` (text, default 'Uso general')
      - `assigned_at` (timestamptz, default now())
      - `returned_at` (timestamptz, nullable)
      - `return_notes` (text, nullable)
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on both tables
    - Public read access for both tables
    - Authenticated user write access for both tables

  3. Performance
    - Indexes on frequently queried columns
    - Automatic updated_at trigger for laptops table
*/

-- Crear tabla de laptops
CREATE TABLE IF NOT EXISTS laptops (
  id text PRIMARY KEY,
  brand text NOT NULL,
  model text NOT NULL,
  serial_number text UNIQUE NOT NULL,
  biometric_reader boolean DEFAULT false,
  biometric_serial text,
  status text NOT NULL DEFAULT 'disponible' CHECK (status IN ('disponible', 'en-uso', 'mantenimiento')),
  assigned_user text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Crear tabla de asignaciones
CREATE TABLE IF NOT EXISTS assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  laptop_id text NOT NULL REFERENCES laptops(id) ON DELETE CASCADE,
  user_name text NOT NULL,
  purpose text NOT NULL DEFAULT 'Uso general',
  assigned_at timestamptz DEFAULT now(),
  returned_at timestamptz,
  return_notes text,
  created_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE laptops ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;

-- Políticas para laptops (lectura pública, escritura autenticada)
CREATE POLICY "Laptops son visibles públicamente"
  ON laptops
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Solo usuarios autenticados pueden modificar laptops"
  ON laptops
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Políticas para asignaciones (lectura pública, escritura autenticada)
CREATE POLICY "Asignaciones son visibles públicamente"
  ON assignments
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Solo usuarios autenticados pueden crear asignaciones"
  ON assignments
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Solo usuarios autenticados pueden actualizar asignaciones"
  ON assignments
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Crear índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_laptops_serial_number ON laptops(serial_number);
CREATE INDEX IF NOT EXISTS idx_laptops_status ON laptops(status);
CREATE INDEX IF NOT EXISTS idx_assignments_laptop_id ON assignments(laptop_id);
CREATE INDEX IF NOT EXISTS idx_assignments_returned_at ON assignments(returned_at);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at en laptops
CREATE TRIGGER update_laptops_updated_at
  BEFORE UPDATE ON laptops
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insertar datos iniciales de laptops
INSERT INTO laptops (id, brand, model, serial_number, biometric_reader, status, assigned_user, created_at, updated_at)
VALUES 
  ('LT-001', 'Dell', 'Vostro 7000', 'HK5ZMKG3', false, 'disponible', null, now(), now()),
  ('LT-002', 'Dell', 'Vostro 7000', 'CNY4KG3', false, 'disponible', null, now(), now()),
  ('LT-003', 'Dell', 'Vostro 7000', '67CZKW2', false, 'disponible', null, now(), now())
ON CONFLICT (id) DO NOTHING;
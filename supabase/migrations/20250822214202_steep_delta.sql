/*
  # Sistema de Gestión de Laptops

  1. Nuevas Tablas
    - `laptops`
      - `id` (text, primary key) - Identificador único de la laptop
      - `brand` (text) - Marca de la laptop
      - `model` (text) - Modelo de la laptop
      - `serial_number` (text, unique) - Número de serie único
      - `biometric_reader` (boolean) - Si tiene lector biométrico
      - `biometric_serial` (text, optional) - Número de serie del biométrico
      - `status` (enum) - Estado: disponible, en-uso, mantenimiento
      - `current_user` (text, optional) - Usuario actual asignado
      - `created_at` (timestamp) - Fecha de creación
      - `updated_at` (timestamp) - Fecha de última actualización

    - `assignments`
      - `id` (uuid, primary key) - Identificador único de la asignación
      - `laptop_id` (text, foreign key) - Referencia a la laptop
      - `user_name` (text) - Nombre del usuario asignado
      - `purpose` (text) - Propósito de la asignación
      - `assigned_at` (timestamp) - Fecha y hora de asignación
      - `returned_at` (timestamp, optional) - Fecha y hora de devolución
      - `return_notes` (text, optional) - Notas de devolución
      - `created_at` (timestamp) - Fecha de creación del registro

  2. Seguridad
    - Enable RLS en ambas tablas
    - Políticas para lectura pública
    - Políticas para escritura autenticada

  3. Datos Iniciales
    - 3 laptops Dell Vostro precargadas
    - Estados configurados correctamente
*/

-- Crear tipo enum para el estado de las laptops
CREATE TYPE laptop_status AS ENUM ('disponible', 'en-uso', 'mantenimiento');

-- Crear tabla de laptops
CREATE TABLE IF NOT EXISTS laptops (
  id text PRIMARY KEY,
  brand text NOT NULL,
  model text NOT NULL,
  serial_number text UNIQUE NOT NULL,
  biometric_reader boolean DEFAULT false,
  biometric_serial text,
  status laptop_status DEFAULT 'disponible',
  current_user text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Crear tabla de asignaciones
CREATE TABLE IF NOT EXISTS assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  laptop_id text NOT NULL REFERENCES laptops(id) ON DELETE CASCADE,
  user_name text NOT NULL,
  purpose text DEFAULT 'Uso general',
  assigned_at timestamptz DEFAULT now(),
  returned_at timestamptz,
  return_notes text,
  created_at timestamptz DEFAULT now()
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_laptops_status ON laptops(status);
CREATE INDEX IF NOT EXISTS idx_laptops_current_user ON laptops(current_user);
CREATE INDEX IF NOT EXISTS idx_assignments_laptop_id ON assignments(laptop_id);
CREATE INDEX IF NOT EXISTS idx_assignments_assigned_at ON assignments(assigned_at);
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
DROP TRIGGER IF EXISTS update_laptops_updated_at ON laptops;
CREATE TRIGGER update_laptops_updated_at
  BEFORE UPDATE ON laptops
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Habilitar Row Level Security
ALTER TABLE laptops ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad para laptops
CREATE POLICY "Permitir lectura pública de laptops"
  ON laptops
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Permitir inserción autenticada de laptops"
  ON laptops
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Permitir actualización autenticada de laptops"
  ON laptops
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Permitir eliminación autenticada de laptops"
  ON laptops
  FOR DELETE
  TO authenticated
  USING (true);

-- Políticas de seguridad para assignments
CREATE POLICY "Permitir lectura pública de asignaciones"
  ON assignments
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Permitir inserción autenticada de asignaciones"
  ON assignments
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Permitir actualización autenticada de asignaciones"
  ON assignments
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insertar datos iniciales de laptops
INSERT INTO laptops (id, brand, model, serial_number, biometric_reader, biometric_serial, status, current_user) VALUES
  ('LT-001', 'Dell', 'Vostro 3510', 'DL3510001', true, 'P320E09638', 'disponible', null),
  ('LT-002', 'Dell', 'Vostro 3510', 'DL3510002', true, 'P320E09639', 'disponible', null),
  ('LT-003', 'Dell', 'Vostro 3510', 'DL3510003', true, 'P320E09640', 'disponible', null)
ON CONFLICT (id) DO NOTHING;
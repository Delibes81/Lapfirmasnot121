/*
  # Sistema de Gestión de Laptops - Esquema de Base de Datos

  1. Nuevas Tablas
    - `laptops`
      - `id` (text, primary key) - Identificador único de la laptop (ej: LT-001)
      - `brand` (text) - Marca de la laptop
      - `model` (text) - Modelo de la laptop
      - `serial_number` (text, unique) - Número de serie único
      - `biometric_reader` (boolean) - Si tiene lector biométrico
      - `biometric_serial` (text, optional) - Número de serie del biométrico
      - `status` (text) - Estado: disponible, en-uso, mantenimiento
      - `current_user` (text, optional) - Usuario actual asignado
      - `created_at` (timestamptz) - Fecha de creación
      - `updated_at` (timestamptz) - Fecha de última actualización

    - `assignments`
      - `id` (uuid, primary key) - Identificador único de la asignación
      - `laptop_id` (text, foreign key) - Referencia a la laptop
      - `user_name` (text) - Nombre del usuario asignado
      - `purpose` (text) - Propósito de la asignación
      - `assigned_at` (timestamptz) - Fecha y hora de asignación
      - `returned_at` (timestamptz, optional) - Fecha y hora de devolución
      - `return_notes` (text, optional) - Notas de devolución
      - `created_at` (timestamptz) - Fecha de creación del registro

  2. Seguridad
    - Habilitar RLS en ambas tablas
    - Políticas para lectura pública (vista pública)
    - Políticas para escritura autenticada (administradores)

  3. Índices
    - Índice en serial_number para búsquedas rápidas
    - Índice en laptop_id para consultas de asignaciones
    - Índice en status para filtros de estado
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
  current_user text,
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
INSERT INTO laptops (id, brand, model, serial_number, biometric_reader, status, current_user, created_at, updated_at)
VALUES 
  ('LT-001', 'Dell', 'Vostro 7000', 'HK5ZMKG3', false, 'disponible', null, now(), now()),
  ('LT-002', 'Dell', 'Vostro 7000', 'CNY4KG3', false, 'disponible', null, now(), now()),
  ('LT-003', 'Dell', 'Vostro 7000', '67CZKW2', false, 'disponible', null, now(), now())
ON CONFLICT (id) DO NOTHING;
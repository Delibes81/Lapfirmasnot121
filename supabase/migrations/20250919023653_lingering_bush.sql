/*
  # Crear esquema inicial del sistema de laptops

  1. Nuevas Tablas
    - `laptops`
      - `id` (text, primary key)
      - `brand` (text, not null)
      - `model` (text, not null)
      - `serial_number` (text, unique, not null)
      - `status` (laptop_status enum, default 'disponible')
      - `assigned_user` (text, nullable)
      - `biometric_serial` (text, nullable)
      - `assigned_at` (timestamptz, nullable)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

    - `assignments`
      - `id` (uuid, primary key)
      - `laptop_id` (text, foreign key to laptops)
      - `user_name` (text, not null)
      - `biometric_serial` (text, nullable)
      - `assigned_at` (timestamptz, default now())
      - `returned_at` (timestamptz, nullable)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

    - `biometric_devices`
      - `id` (uuid, primary key)
      - `serial_number` (text, unique, not null)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

    - `lawyers`
      - `id` (uuid, primary key)
      - `name` (text, unique, not null)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Enums
    - `laptop_status` ('disponible', 'en-uso', 'mantenimiento')

  3. Seguridad
    - Habilitar RLS en todas las tablas
    - Políticas para permitir operaciones públicas y autenticadas

  4. Funciones y Triggers
    - Función para actualizar `updated_at` automáticamente
    - Triggers para todas las tablas que necesiten actualización automática
*/

-- Crear tipo enum para el estado de las laptops
CREATE TYPE laptop_status AS ENUM ('disponible', 'en-uso', 'mantenimiento');

-- Crear tabla de laptops
CREATE TABLE IF NOT EXISTS laptops (
  id text PRIMARY KEY,
  brand text NOT NULL,
  model text NOT NULL,
  serial_number text UNIQUE NOT NULL,
  status laptop_status DEFAULT 'disponible',
  assigned_user text,
  biometric_serial text,
  assigned_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Crear tabla de asignaciones (historial)
CREATE TABLE IF NOT EXISTS assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  laptop_id text NOT NULL REFERENCES laptops(id) ON DELETE CASCADE,
  user_name text NOT NULL,
  biometric_serial text,
  assigned_at timestamptz DEFAULT now(),
  returned_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Crear tabla de dispositivos biométricos
CREATE TABLE IF NOT EXISTS biometric_devices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  serial_number text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Crear tabla de abogados/personas autorizadas
CREATE TABLE IF NOT EXISTS lawyers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Crear índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_laptops_serial_number ON laptops(serial_number);
CREATE INDEX IF NOT EXISTS idx_laptops_biometric_serial ON laptops(biometric_serial);
CREATE INDEX IF NOT EXISTS idx_assignments_laptop_id ON assignments(laptop_id);
CREATE INDEX IF NOT EXISTS idx_assignments_assigned_at ON assignments(assigned_at DESC);
CREATE INDEX IF NOT EXISTS idx_assignments_returned_at ON assignments(returned_at);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Función específica para actualizar updated_at en laptops
CREATE OR REPLACE FUNCTION update_laptops_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Función específica para actualizar updated_at en assignments
CREATE OR REPLACE FUNCTION update_assignments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Función específica para actualizar updated_at en biometric_devices
CREATE OR REPLACE FUNCTION update_biometric_devices_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Función específica para actualizar updated_at en lawyers
CREATE OR REPLACE FUNCTION update_lawyers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at automáticamente
CREATE TRIGGER update_laptops_updated_at
  BEFORE UPDATE ON laptops
  FOR EACH ROW
  EXECUTE FUNCTION update_laptops_updated_at();

CREATE TRIGGER update_assignments_updated_at
  BEFORE UPDATE ON assignments
  FOR EACH ROW
  EXECUTE FUNCTION update_assignments_updated_at();

CREATE TRIGGER update_biometric_devices_updated_at
  BEFORE UPDATE ON biometric_devices
  FOR EACH ROW
  EXECUTE FUNCTION update_biometric_devices_updated_at();

CREATE TRIGGER update_lawyers_updated_at
  BEFORE UPDATE ON lawyers
  FOR EACH ROW
  EXECUTE FUNCTION update_lawyers_updated_at();

-- Habilitar Row Level Security
ALTER TABLE laptops ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE biometric_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE lawyers ENABLE ROW LEVEL SECURITY;

-- Políticas para laptops
CREATE POLICY "Allow all operations for everyone"
  ON laptops
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Políticas para assignments
CREATE POLICY "Allow all operations for everyone"
  ON assignments
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Políticas para biometric_devices
CREATE POLICY "Biometric devices are viewable by everyone"
  ON biometric_devices
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow anonymous users to insert biometric devices"
  ON biometric_devices
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Biometric devices are editable by authenticated users"
  ON biometric_devices
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Biometric devices are editable by service role"
  ON biometric_devices
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Políticas para lawyers
CREATE POLICY "Lawyers are viewable by everyone"
  ON lawyers
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow anonymous users to insert lawyers"
  ON lawyers
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Lawyers are editable by authenticated users"
  ON lawyers
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Lawyers are editable by service role"
  ON lawyers
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
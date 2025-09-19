/*
  # Esquema inicial del sistema de gestión de laptops

  1. Nuevas tablas
    - `laptops` - Inventario de laptops con estado, usuario asignado y dispositivo biométrico
    - `assignments` - Historial de asignaciones y devoluciones
    - `biometric_devices` - Dispositivos biométricos disponibles
    - `lawyers` - Personas autorizadas para usar laptops

  2. Seguridad
    - Habilitar RLS en todas las tablas
    - Políticas para permitir operaciones públicas y autenticadas

  3. Optimizaciones
    - Índices para consultas frecuentes
    - Triggers para actualizar timestamps automáticamente
*/

-- Crear tipo enum para el estado de las laptops
CREATE TYPE IF NOT EXISTS laptop_status AS ENUM ('disponible', 'en-uso', 'mantenimiento');

-- Tabla de laptops
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

-- Tabla de asignaciones (historial)
CREATE TABLE IF NOT EXISTS assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  laptop_id text NOT NULL,
  user_name text NOT NULL,
  biometric_serial text,
  assigned_at timestamptz NOT NULL DEFAULT now(),
  returned_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabla de dispositivos biométricos
CREATE TABLE IF NOT EXISTS biometric_devices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  serial_number text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabla de abogados/personas autorizadas
CREATE TABLE IF NOT EXISTS lawyers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Agregar foreign key constraint para assignments
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'assignments_laptop_id_fkey'
  ) THEN
    ALTER TABLE assignments ADD CONSTRAINT assignments_laptop_id_fkey 
    FOREIGN KEY (laptop_id) REFERENCES laptops(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Crear índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_laptops_serial_number ON laptops(serial_number);
CREATE INDEX IF NOT EXISTS idx_laptops_biometric_serial ON laptops(biometric_serial);
CREATE INDEX IF NOT EXISTS idx_assignments_laptop_id ON assignments(laptop_id);
CREATE INDEX IF NOT EXISTS idx_assignments_assigned_at ON assignments(assigned_at DESC);
CREATE INDEX IF NOT EXISTS idx_assignments_returned_at ON assignments(returned_at);

-- Funciones para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE FUNCTION update_laptops_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE FUNCTION update_assignments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE FUNCTION update_biometric_devices_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE FUNCTION update_lawyers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear triggers para actualizar updated_at
DROP TRIGGER IF EXISTS update_laptops_updated_at ON laptops;
CREATE TRIGGER update_laptops_updated_at
  BEFORE UPDATE ON laptops
  FOR EACH ROW
  EXECUTE FUNCTION update_laptops_updated_at();

DROP TRIGGER IF EXISTS update_assignments_updated_at ON assignments;
CREATE TRIGGER update_assignments_updated_at
  BEFORE UPDATE ON assignments
  FOR EACH ROW
  EXECUTE FUNCTION update_assignments_updated_at();

DROP TRIGGER IF EXISTS update_biometric_devices_updated_at ON biometric_devices;
CREATE TRIGGER update_biometric_devices_updated_at
  BEFORE UPDATE ON biometric_devices
  FOR EACH ROW
  EXECUTE FUNCTION update_biometric_devices_updated_at();

DROP TRIGGER IF EXISTS update_lawyers_updated_at ON lawyers;
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
DROP POLICY IF EXISTS "Allow all operations for everyone" ON laptops;
CREATE POLICY "Allow all operations for everyone"
  ON laptops
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Políticas para assignments
DROP POLICY IF EXISTS "Allow all operations for everyone" ON assignments;
CREATE POLICY "Allow all operations for everyone"
  ON assignments
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Políticas para biometric_devices
DROP POLICY IF EXISTS "Biometric devices are viewable by everyone" ON biometric_devices;
CREATE POLICY "Biometric devices are viewable by everyone"
  ON biometric_devices
  FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Allow anonymous users to insert biometric devices" ON biometric_devices;
CREATE POLICY "Allow anonymous users to insert biometric devices"
  ON biometric_devices
  FOR INSERT
  TO anon
  WITH CHECK (true);

DROP POLICY IF EXISTS "Biometric devices are editable by authenticated users" ON biometric_devices;
CREATE POLICY "Biometric devices are editable by authenticated users"
  ON biometric_devices
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Biometric devices are editable by service role" ON biometric_devices;
CREATE POLICY "Biometric devices are editable by service role"
  ON biometric_devices
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Políticas para lawyers
DROP POLICY IF EXISTS "Lawyers are viewable by everyone" ON lawyers;
CREATE POLICY "Lawyers are viewable by everyone"
  ON lawyers
  FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Allow anonymous users to insert lawyers" ON lawyers;
CREATE POLICY "Allow anonymous users to insert lawyers"
  ON lawyers
  FOR INSERT
  TO anon
  WITH CHECK (true);

DROP POLICY IF EXISTS "Lawyers are editable by authenticated users" ON lawyers;
CREATE POLICY "Lawyers are editable by authenticated users"
  ON lawyers
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Lawyers are editable by service role" ON lawyers;
CREATE POLICY "Lawyers are editable by service role"
  ON lawyers
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
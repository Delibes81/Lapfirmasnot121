/*
  # Sistema de Gestión de Laptops

  1. Nuevas Tablas
    - `laptops`
      - `id` (text, primary key)
      - `brand` (text, marca de la laptop)
      - `model` (text, modelo)
      - `serial_number` (text, número de serie único)
      - `biometric_reader` (boolean, tiene lector biométrico)
      - `biometric_serial` (text, serial del biométrico)
      - `status` (text, estado: disponible/en-uso/mantenimiento)
      - `current_user` (text, usuario actual)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `assignments`
      - `id` (uuid, primary key)
      - `laptop_id` (text, referencia a laptops)
      - `user_name` (text, nombre del usuario)
      - `purpose` (text, propósito de la asignación)
      - `assigned_at` (timestamp, fecha de asignación)
      - `returned_at` (timestamp, fecha de devolución)
      - `return_notes` (text, notas de devolución)
      - `created_at` (timestamp)

  2. Seguridad
    - Habilitar RLS en ambas tablas
    - Políticas de lectura pública
    - Políticas de escritura para usuarios autenticados

  3. Datos Iniciales
    - 3 laptops Dell Vostro con biométricos
*/

-- Crear tabla de laptops
CREATE TABLE IF NOT EXISTS public.laptops (
  id text PRIMARY KEY,
  brand text NOT NULL,
  model text NOT NULL,
  serial_number text NOT NULL UNIQUE,
  biometric_reader boolean DEFAULT false NOT NULL,
  biometric_serial text,
  status text DEFAULT 'disponible' NOT NULL CHECK (status IN ('disponible', 'en-uso', 'mantenimiento')),
  current_user text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Crear tabla de asignaciones
CREATE TABLE IF NOT EXISTS public.assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  laptop_id text NOT NULL REFERENCES public.laptops(id) ON DELETE CASCADE,
  user_name text NOT NULL,
  purpose text DEFAULT 'Uso general' NOT NULL,
  assigned_at timestamptz DEFAULT now() NOT NULL,
  returned_at timestamptz,
  return_notes text,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_laptops_status ON public.laptops(status);
CREATE INDEX IF NOT EXISTS idx_laptops_serial ON public.laptops(serial_number);
CREATE INDEX IF NOT EXISTS idx_assignments_laptop_id ON public.assignments(laptop_id);
CREATE INDEX IF NOT EXISTS idx_assignments_assigned_at ON public.assignments(assigned_at);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at en laptops
DROP TRIGGER IF EXISTS laptops_updated_at_trigger ON public.laptops;
CREATE TRIGGER laptops_updated_at_trigger
    BEFORE UPDATE ON public.laptops
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Habilitar Row Level Security
ALTER TABLE public.laptops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad para laptops
DROP POLICY IF EXISTS "Permitir lectura pública de laptops" ON public.laptops;
CREATE POLICY "Permitir lectura pública de laptops"
  ON public.laptops
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Permitir escritura autenticada de laptops" ON public.laptops;
CREATE POLICY "Permitir escritura autenticada de laptops"
  ON public.laptops
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Políticas de seguridad para asignaciones
DROP POLICY IF EXISTS "Permitir lectura pública de asignaciones" ON public.assignments;
CREATE POLICY "Permitir lectura pública de asignaciones"
  ON public.assignments
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Permitir escritura autenticada de asignaciones" ON public.assignments;
CREATE POLICY "Permitir escritura autenticada de asignaciones"
  ON public.assignments
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insertar datos iniciales de laptops
INSERT INTO public.laptops (id, brand, model, serial_number, biometric_reader, biometric_serial, status, current_user) VALUES
  ('LT-001', 'Dell', 'Vostro 3510', 'DV3510001', true, 'P320E09638', 'disponible', null),
  ('LT-002', 'Dell', 'Vostro 3510', 'DV3510002', true, 'P320E09639', 'disponible', null),
  ('LT-003', 'Dell', 'Vostro 3510', 'DV3510003', true, 'P320E09640', 'disponible', null)
ON CONFLICT (id) DO NOTHING;
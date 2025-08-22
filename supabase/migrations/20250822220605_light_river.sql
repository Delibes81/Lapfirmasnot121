/*
  # Crear tablas para el sistema de gestión de laptops

  1. Nuevas Tablas
    - `laptops`
      - `id` (text, primary key) - Identificador único de la laptop
      - `brand` (text) - Marca de la laptop
      - `model` (text) - Modelo de la laptop
      - `serial_number` (text, unique) - Número de serie único
      - `biometric_reader` (boolean) - Si tiene lector biométrico
      - `biometric_serial` (text, nullable) - Número de serie del biométrico
      - `status` (enum) - Estado: disponible, en-uso, mantenimiento
      - `current_user` (text, nullable) - Usuario actual asignado
      - `created_at` (timestamptz) - Fecha de creación
      - `updated_at` (timestamptz) - Fecha de última actualización

    - `assignments`
      - `id` (uuid, primary key) - Identificador único de la asignación
      - `laptop_id` (text, foreign key) - Referencia a la laptop
      - `user_name` (text) - Nombre del usuario asignado
      - `purpose` (text) - Propósito de la asignación
      - `assigned_at` (timestamptz) - Fecha de asignación
      - `returned_at` (timestamptz, nullable) - Fecha de devolución
      - `return_notes` (text, nullable) - Notas de devolución
      - `created_at` (timestamptz) - Fecha de creación del registro

  2. Seguridad
    - Habilitar RLS en ambas tablas
    - Políticas de lectura pública para vista pública
    - Políticas de escritura para usuarios autenticados y service role

  3. Datos Iniciales
    - 3 laptops Dell Vostro con configuración inicial
*/

-- Crear tipo enum para el estado de las laptops
CREATE TYPE laptop_status AS ENUM ('disponible', 'en-uso', 'mantenimiento');

-- Crear tabla laptops
CREATE TABLE IF NOT EXISTS public.laptops (
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

-- Crear tabla assignments
CREATE TABLE IF NOT EXISTS public.assignments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    laptop_id text NOT NULL REFERENCES public.laptops(id) ON DELETE CASCADE,
    user_name text NOT NULL,
    purpose text DEFAULT 'Uso general',
    assigned_at timestamptz DEFAULT now(),
    returned_at timestamptz,
    return_notes text,
    created_at timestamptz DEFAULT now()
);

-- Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_laptops_status ON public.laptops(status);
CREATE INDEX IF NOT EXISTS idx_laptops_current_user ON public.laptops(current_user);
CREATE INDEX IF NOT EXISTS idx_assignments_laptop_id ON public.assignments(laptop_id);
CREATE INDEX IF NOT EXISTS idx_assignments_assigned_at ON public.assignments(assigned_at);
CREATE INDEX IF NOT EXISTS idx_assignments_returned_at ON public.assignments(returned_at);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at en laptops
DROP TRIGGER IF EXISTS update_laptops_updated_at ON public.laptops;
CREATE TRIGGER update_laptops_updated_at
    BEFORE UPDATE ON public.laptops
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Habilitar Row Level Security
ALTER TABLE public.laptops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad para laptops
DROP POLICY IF EXISTS "Allow public read access to laptops" ON public.laptops;
CREATE POLICY "Allow public read access to laptops"
    ON public.laptops FOR SELECT
    TO public
    USING (true);

DROP POLICY IF EXISTS "Allow authenticated users to manage laptops" ON public.laptops;
CREATE POLICY "Allow authenticated users to manage laptops"
    ON public.laptops FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Allow service role full access to laptops" ON public.laptops;
CREATE POLICY "Allow service role full access to laptops"
    ON public.laptops FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Políticas de seguridad para assignments
DROP POLICY IF EXISTS "Allow public read access to assignments" ON public.assignments;
CREATE POLICY "Allow public read access to assignments"
    ON public.assignments FOR SELECT
    TO public
    USING (true);

DROP POLICY IF EXISTS "Allow authenticated users to manage assignments" ON public.assignments;
CREATE POLICY "Allow authenticated users to manage assignments"
    ON public.assignments FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Allow service role full access to assignments" ON public.assignments;
CREATE POLICY "Allow service role full access to assignments"
    ON public.assignments FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Insertar datos iniciales de laptops
INSERT INTO public.laptops (id, brand, model, serial_number, biometric_reader, biometric_serial, status, current_user) VALUES
    ('LT-001', 'Dell', 'Vostro 3520', 'DL3520001', true, 'P320E09638', 'disponible', null),
    ('LT-002', 'Dell', 'Vostro 3520', 'DL3520002', true, 'P320E09639', 'disponible', null),
    ('LT-003', 'Dell', 'Vostro 3520', 'DL3520003', true, 'P320E09640', 'disponible', null)
ON CONFLICT (id) DO NOTHING;
-- Crear tabla laptops
CREATE TABLE IF NOT EXISTS public.laptops (
  id text PRIMARY KEY,
  brand text NOT NULL,
  model text NOT NULL,
  serial_number text NOT NULL UNIQUE,
  biometric_reader boolean DEFAULT false NOT NULL,
  biometric_serial text,
  status text DEFAULT 'disponible' NOT NULL CHECK (status IN ('disponible', 'en-uso', 'mantenimiento')),
  current_user text,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger para laptops
DROP TRIGGER IF EXISTS laptops_updated_at_trigger ON public.laptops;
CREATE TRIGGER laptops_updated_at_trigger
    BEFORE UPDATE ON public.laptops
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Crear tabla assignments
CREATE TABLE IF NOT EXISTS public.assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  laptop_id text NOT NULL REFERENCES public.laptops(id) ON DELETE CASCADE,
  user_name text NOT NULL,
  purpose text DEFAULT 'Uso general' NOT NULL,
  assigned_at timestamp with time zone DEFAULT now() NOT NULL,
  returned_at timestamp with time zone,
  return_notes text,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_laptops_status ON public.laptops(status);
CREATE INDEX IF NOT EXISTS idx_laptops_serial ON public.laptops(serial_number);
CREATE INDEX IF NOT EXISTS idx_assignments_laptop_id ON public.assignments(laptop_id);
CREATE INDEX IF NOT EXISTS idx_assignments_assigned_at ON public.assignments(assigned_at);

-- Habilitar Row Level Security
ALTER TABLE public.laptops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;

-- Crear políticas de seguridad para laptops
DROP POLICY IF EXISTS "Allow public read access to laptops" ON public.laptops;
CREATE POLICY "Allow public read access to laptops"
  ON public.laptops
  FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Allow authenticated users to manage laptops" ON public.laptops;
CREATE POLICY "Allow authenticated users to manage laptops"
  ON public.laptops
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Crear políticas de seguridad para assignments
DROP POLICY IF EXISTS "Allow public read access to assignments" ON public.assignments;
CREATE POLICY "Allow public read access to assignments"
  ON public.assignments
  FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Allow authenticated users to manage assignments" ON public.assignments;
CREATE POLICY "Allow authenticated users to manage assignments"
  ON public.assignments
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insertar datos iniciales de laptops
INSERT INTO public.laptops (id, brand, model, serial_number, biometric_reader, biometric_serial, status, current_user)
VALUES 
  ('LT-001', 'Dell', 'Vostro 3510', 'DV3510001', true, 'P320E09638', 'disponible', null),
  ('LT-002', 'Dell', 'Vostro 3510', 'DV3510002', true, 'P320E09639', 'disponible', null),
  ('LT-003', 'Dell', 'Vostro 3510', 'DV3510003', true, 'P320E09640', 'disponible', null)
ON CONFLICT (id) DO NOTHING;
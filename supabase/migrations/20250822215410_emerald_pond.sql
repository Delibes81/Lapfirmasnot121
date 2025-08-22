-- Crear tablas para el sistema de laptops
-- Basado en src/lib/database.types.ts

-- Crear tabla laptops
CREATE TABLE IF NOT EXISTS public.laptops (
    id text PRIMARY KEY,
    brand text NOT NULL,
    model text NOT NULL,
    serial_number text NOT NULL UNIQUE,
    biometric_reader boolean DEFAULT false,
    biometric_serial text,
    status text DEFAULT 'disponible' CHECK (status IN ('disponible', 'en-uso', 'mantenimiento')),
    current_user text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Crear tabla assignments
CREATE TABLE IF NOT EXISTS public.assignments (
    id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
    laptop_id text NOT NULL REFERENCES public.laptops(id) ON DELETE CASCADE,
    user_name text NOT NULL,
    purpose text DEFAULT '',
    assigned_at timestamptz DEFAULT now(),
    returned_at timestamptz,
    return_notes text,
    created_at timestamptz DEFAULT now()
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
DROP TRIGGER IF EXISTS update_laptops_updated_at ON public.laptops;
CREATE TRIGGER update_laptops_updated_at
    BEFORE UPDATE ON public.laptops
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Habilitar Row Level Security
ALTER TABLE public.laptops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad para lectura pública
CREATE POLICY "Allow public read access on laptops" ON public.laptops
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access on assignments" ON public.assignments
    FOR SELECT USING (true);

-- Políticas para escritura (service role y usuarios autenticados)
CREATE POLICY "Allow service role full access on laptops" ON public.laptops
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Allow service role full access on assignments" ON public.assignments
    FOR ALL USING (auth.role() = 'service_role');

-- Insertar datos iniciales
INSERT INTO public.laptops (id, brand, model, serial_number, biometric_reader, biometric_serial, status, current_user) VALUES
('LT-001', 'Dell', 'Vostro 3510', 'DV3510001', true, 'P320E09638', 'disponible', null),
('LT-002', 'Dell', 'Vostro 3510', 'DV3510002', true, 'P320E09639', 'disponible', null),
('LT-003', 'Dell', 'Vostro 3510', 'DV3510003', true, 'P320E09640', 'disponible', null)
ON CONFLICT (id) DO NOTHING;
/*
  # Crear tabla laptops simplificada

  1. Nueva Tabla
    - `laptops`
      - `id` (text, primary key) - Identificador único de la laptop
      - `brand` (text, not null) - Marca/nombre de la laptop
      - `model` (text, not null) - Modelo de la laptop  
      - `serial_number` (text, unique, not null) - Número de serie único
      - `created_at` (timestamp) - Fecha de creación
      - `updated_at` (timestamp) - Fecha de última actualización

  2. Seguridad
    - Habilitar RLS en tabla `laptops`
    - Política de lectura pública
    - Política de escritura para usuarios autenticados

  3. Características
    - Trigger automático para actualizar `updated_at`
    - Índice en `serial_number` para búsquedas rápidas
*/

-- Eliminar tabla existente si existe
DROP TABLE IF EXISTS public.laptops CASCADE;

-- Crear función para actualizar updated_at si no existe
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear tabla laptops
CREATE TABLE public.laptops (
    id text PRIMARY KEY,
    brand text NOT NULL,
    model text NOT NULL,
    serial_number text UNIQUE NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Crear índice para número de serie
CREATE INDEX idx_laptops_serial_number ON public.laptops(serial_number);

-- Crear trigger para updated_at
CREATE TRIGGER update_laptops_updated_at
    BEFORE UPDATE ON public.laptops
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Habilitar RLS
ALTER TABLE public.laptops ENABLE ROW LEVEL SECURITY;

-- Política de lectura pública
CREATE POLICY "Laptops are viewable by everyone"
    ON public.laptops
    FOR SELECT
    TO public
    USING (true);

-- Política de escritura para usuarios autenticados
CREATE POLICY "Laptops are editable by authenticated users"
    ON public.laptops
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Política de escritura para service role
CREATE POLICY "Laptops are editable by service role"
    ON public.laptops
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Insertar datos de ejemplo
INSERT INTO public.laptops (id, brand, model, serial_number) VALUES
('LT-001', 'Dell', 'Vostro 3520', 'DL3520001'),
('LT-002', 'Dell', 'Vostro 3520', 'DL3520002'),
('LT-003', 'Dell', 'Vostro 3520', 'DL3520003');
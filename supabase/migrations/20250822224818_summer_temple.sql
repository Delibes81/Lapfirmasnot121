/*
  # Crear tabla de abogados/personas

  1. Nueva Tabla
    - `lawyers`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Seguridad
    - Habilitar RLS en la tabla `lawyers`
    - Agregar políticas para operaciones CRUD

  3. Datos Iniciales
    - Insertar lista de abogados proporcionada
*/

-- Crear tabla de abogados/personas
CREATE TABLE IF NOT EXISTS lawyers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE lawyers ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad
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

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_lawyers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_lawyers_updated_at
  BEFORE UPDATE ON lawyers
  FOR EACH ROW
  EXECUTE FUNCTION update_lawyers_updated_at();

-- Insertar datos iniciales
INSERT INTO lawyers (name) VALUES
  ('Lic. Victor Medina'),
  ('Lic. Edgar Magallan'),
  ('Lic. Cesar Rocha'),
  ('Lic. Guadalupe Cruz'),
  ('Lic. Arturo Aguilar'),
  ('Lic. Rafael Angeles'),
  ('Lic. Ivan Ramirez'),
  ('Lic. Amando Mastachi'),
  ('Lic. Jorge Ramirez'),
  ('Lic. Humberto Montes'),
  ('Lic. Andrea Suarez'),
  ('Lic. Juan Moran'),
  ('Lic. Neftali Gracida'),
  ('Lic. Dulce Gomez'),
  ('Lic. Luis Meneses'),
  ('Lic. Adan Moctezuma'),
  ('Lic. Renato Toledo'),
  ('Lic. Armando Gomez'),
  ('Lic. Jannet Delgado'),
  ('Lic. Brayan Lara'),
  ('Lic. Luis Manjarrez')
ON CONFLICT (name) DO NOTHING;
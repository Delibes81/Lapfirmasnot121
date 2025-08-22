/*
  # Crear tabla de dispositivos biométricos

  1. Nueva Tabla
    - `biometric_devices`
      - `id` (uuid, primary key)
      - `serial_number` (text, unique, not null)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Seguridad
    - Habilitar RLS en la tabla `biometric_devices`
    - Agregar políticas para usuarios anónimos y autenticados
*/

-- Crear tabla de dispositivos biométricos
CREATE TABLE IF NOT EXISTS biometric_devices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  serial_number text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE biometric_devices ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad
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

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_biometric_devices_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_biometric_devices_updated_at
  BEFORE UPDATE ON biometric_devices
  FOR EACH ROW
  EXECUTE FUNCTION update_biometric_devices_updated_at();
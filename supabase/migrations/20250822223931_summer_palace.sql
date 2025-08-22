/*
  # Agregar campo biométrico a laptops

  1. Cambios en tabla laptops
    - Agregar columna `biometric_serial` (texto, opcional)
    - Agregar índice para búsquedas eficientes
  
  2. Relación con biometric_devices
    - Referencia al número de serie del dispositivo biométrico
    - Permite que una laptop tenga un biométrico asignado opcionalmente
*/

-- Agregar columna para el número de serie del biométrico asignado
ALTER TABLE laptops 
ADD COLUMN IF NOT EXISTS biometric_serial text;

-- Crear índice para búsquedas eficientes
CREATE INDEX IF NOT EXISTS idx_laptops_biometric_serial 
ON laptops(biometric_serial);

-- Agregar comentario para documentación
COMMENT ON COLUMN laptops.biometric_serial IS 'Número de serie del dispositivo biométrico asignado a esta laptop';
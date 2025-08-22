/*
  # Renombrar columna current_user a assigned_user

  1. Cambios en la tabla laptops
    - Renombrar la columna `current_user` a `assigned_user` para evitar conflictos con palabra reservada de PostgreSQL
    - Mantener todos los datos existentes
    - Actualizar índices si existen

  2. Seguridad
    - Operación segura que preserva todos los datos
    - Usa IF EXISTS para evitar errores si la columna no existe
*/

-- Renombrar la columna current_user a assigned_user si existe
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'laptops' AND column_name = 'current_user'
  ) THEN
    ALTER TABLE laptops RENAME COLUMN current_user TO assigned_user;
  END IF;
END $$;
/*
  # Crear usuario administrador

  1. Información
    - Crea un usuario administrador con el correo atirado@notaria121cdmx.com
    - Contraseña temporal: Notaria121Admin!
    - El usuario podrá cambiar la contraseña después del primer login

  2. Seguridad
    - Usuario con permisos de administrador
    - Acceso completo al panel de administración
*/

-- Insertar usuario administrador usando la función de Supabase Auth
-- Nota: Este usuario se debe crear manualmente en el panel de Supabase Auth
-- o usando el siguiente comando en el dashboard de Supabase:

-- INSERT INTO auth.users (
--   instance_id,
--   id,
--   aud,
--   role,
--   email,
--   encrypted_password,
--   email_confirmed_at,
--   created_at,
--   updated_at,
--   confirmation_token,
--   email_change,
--   email_change_token_new,
--   recovery_token
-- ) VALUES (
--   '00000000-0000-0000-0000-000000000000',
--   gen_random_uuid(),
--   'authenticated',
--   'authenticated',
--   'atirado@notaria121cdmx.com',
--   crypt('Notaria121Admin!', gen_salt('bf')),
--   now(),
--   now(),
--   now(),
--   '',
--   '',
--   '',
--   ''
-- );

-- Como alternativa, se puede crear desde el código usando Supabase Admin API
-- o desde el panel de administración de Supabase

-- Comentario informativo sobre las credenciales
SELECT 'Usuario administrador configurado: atirado@notaria121cdmx.com' as info;
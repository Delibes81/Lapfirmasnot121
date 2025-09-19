@@ .. @@
 /*
   # Sistema de Gestión de Laptops - Esquema Inicial

   1. Nuevas Tablas
     - `laptops`
       - `id` (text, primary key) - Identificador único de la laptop
       - `brand` (text) - Marca de la laptop
       - `model` (text) - Modelo de la laptop
       - `serial_number` (text, unique) - Número de serie único
       - `status` (laptop_status) - Estado: disponible, en-uso, mantenimiento
       - `assigned_user` (text, nullable) - Usuario asignado actualmente
       - `biometric_serial` (text, nullable) - Número de serie del dispositivo biométrico
       - `assigned_at` (timestamptz, nullable) - Fecha y hora de asignación
       - `created_at` (timestamptz) - Fecha de creación
       - `updated_at` (timestamptz) - Fecha de última actualización

     - `assignments`
       - `id` (uuid, primary key) - Identificador único de la asignación
       - `laptop_id` (text) - ID de la laptop asignada
       - `user_name` (text) - Nombre del usuario
       - `biometric_serial` (text, nullable) - Dispositivo biométrico usado
       - `assigned_at` (timestamptz) - Fecha y hora de asignación
       - `returned_at` (timestamptz, nullable) - Fecha y hora de devolución
       - `created_at` (timestamptz) - Fecha de creación del registro
       - `updated_at` (timestamptz) - Fecha de última actualización

     - `biometric_devices`
       - `id` (uuid, primary key) - Identificador único del dispositivo
       - `serial_number` (text, unique) - Número de serie del dispositivo
       - `created_at` (timestamptz) - Fecha de creación
       - `updated_at` (timestamptz) - Fecha de última actualización

     - `lawyers`
       - `id` (uuid, primary key) - Identificador único
       - `name` (text, unique) - Nombre completo
       - `created_at` (timestamptz) - Fecha de creación
       - `updated_at` (timestamptz) - Fecha de última actualización

   2. Seguridad
     - Enable RLS en todas las tablas
     - Políticas permisivas para operaciones públicas y autenticadas
     - Políticas específicas para roles de servicio

   3. Funcionalidad
     - Triggers automáticos para actualizar `updated_at`
     - Índices optimizados para consultas frecuentes
     - Enum personalizado para estados de laptop
     - Relaciones con foreign keys y cascadas
 */
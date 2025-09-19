@@ .. @@
 /*
   # Sistema de Gestión de Laptops - Esquema Inicial

   1. Nuevas Tablas
     - `laptops` - Inventario de laptops con ID, marca, modelo, número de serie, estado y asignación
     - `assignments` - Historial completo de asignaciones y devoluciones
     - `biometric_devices` - Dispositivos biométricos disponibles
     - `lawyers` - Personas autorizadas para usar laptops

   2. Seguridad
     - RLS habilitado en todas las tablas
     - Políticas configuradas para acceso público y autenticado
     - Triggers para actualización automática de timestamps

   3. Características
     - Enum para estados de laptop (disponible, en-uso, mantenimiento)
     - Índices optimizados para consultas frecuentes
     - Foreign keys para integridad referencial
-
-  4. Datos de Ejemplo
-    - 8 laptops de diferentes marcas
-    - 8 dispositivos biométricos
-    - 8 personas autorizadas
 */
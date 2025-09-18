# Sistema de Gestión de Laptops

Sistema completo para la gestión y control de inventario de laptops con asignación de usuarios y dispositivos biométricos.

## Características

- **Vista Pública**: Consulta en tiempo real del estado de las laptops
- **Panel de Administración**: Gestión completa del inventario
- **Gestión de Biométricos**: Control de dispositivos de huella digital
- **Gestión de Usuarios**: Administración de personas autorizadas
- **Historial de Asignaciones**: Seguimiento completo de préstamos y devoluciones

## Tecnologías

- React 18 + TypeScript
- Tailwind CSS
- Supabase (Base de datos y autenticación)
- Vite (Build tool)
- Lucide React (Iconos)

## Configuración

1. Clona el repositorio
2. Instala las dependencias: `npm install`
3. Configura las variables de entorno en `.env`:
   ```
   VITE_SUPABASE_URL=tu_url_de_supabase
   VITE_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
   ```
4. Ejecuta el proyecto: `npm run dev`

## Deployment en Netlify

1. Conecta tu repositorio a Netlify
2. Configura las variables de entorno en Netlify:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. El build se ejecutará automáticamente usando `npm run build`

## Estructura de la Base de Datos

- **laptops**: Inventario principal con estado y asignaciones
- **assignments**: Historial de todas las asignaciones
- **biometric_devices**: Dispositivos biométricos disponibles
- **lawyers**: Usuarios autorizados para usar laptops

## Estados de Laptops

- **Disponible**: Lista para ser asignada
- **En Uso**: Actualmente asignada a un usuario
- **Mantenimiento**: Fuera de servicio temporal

## Uso

### Vista Pública
- Consulta el estado actual de todas las laptops
- Visualización en tarjetas, lista o estadísticas
- Información en tiempo real

### Panel de Administración
- Agregar/editar/eliminar laptops
- Asignar laptops a usuarios
- Gestionar dispositivos biométricos
- Administrar usuarios autorizados
- Consultar historial completo

## Licencia

Proyecto privado para uso interno.

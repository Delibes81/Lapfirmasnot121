/*
  # Agregar datos de ejemplo

  1. Datos de ejemplo
    - Laptops de muestra con diferentes marcas y modelos
    - Dispositivos biométricos de ejemplo
    - Personas autorizadas de ejemplo

  2. Notas
    - Los datos se insertan solo si no existen (ON CONFLICT DO NOTHING)
    - Incluye variedad de marcas y modelos para testing
*/

-- Insertar laptops de ejemplo
INSERT INTO laptops (id, brand, model, serial_number, status) VALUES
  ('LT-001', 'Dell', 'Vostro 3510', 'DL3510001', 'disponible'),
  ('LT-002', 'Dell', 'Vostro 3510', 'DL3510002', 'disponible'),
  ('LT-003', 'Dell', 'Vostro 3510', 'DL3510003', 'disponible'),
  ('LT-004', 'HP', 'EliteBook 840', 'HP840001', 'disponible'),
  ('LT-005', 'HP', 'EliteBook 840', 'HP840002', 'disponible'),
  ('LT-006', 'Lenovo', 'ThinkPad E14', 'LN-E14001', 'disponible'),
  ('LT-007', 'Lenovo', 'ThinkPad E14', 'LN-E14002', 'disponible'),
  ('LT-008', 'ASUS', 'VivoBook 15', 'AS-VB15001', 'disponible')
ON CONFLICT (id) DO NOTHING;

-- Insertar dispositivos biométricos de ejemplo
INSERT INTO biometric_devices (serial_number) VALUES
  ('P320E09638'),
  ('P320E09639'),
  ('P320E09640'),
  ('P320E09641'),
  ('P320E09642'),
  ('P320E09643'),
  ('P320E09644'),
  ('P320E09645')
ON CONFLICT (serial_number) DO NOTHING;

-- Insertar personas autorizadas de ejemplo
INSERT INTO lawyers (name) VALUES
  ('Lic. Juan Pérez'),
  ('Lic. María González'),
  ('Lic. Carlos Rodríguez'),
  ('Lic. Ana Martínez'),
  ('Lic. Luis Hernández'),
  ('Lic. Carmen López'),
  ('Lic. Roberto Silva'),
  ('Lic. Patricia Morales')
ON CONFLICT (name) DO NOTHING;
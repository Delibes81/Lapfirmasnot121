@@ .. @@
 CREATE POLICY "Lawyers are viewable by everyone"
   ON lawyers
   FOR SELECT
   TO public
   USING (true);
-
-/*
-  # Sample Data
-
-  1. Sample Laptops
-    - 8 laptops from different brands
-  2. Sample Biometric Devices
-    - 8 biometric devices with unique serial numbers
-  3. Sample Lawyers
-    - 8 authorized persons
-*/
-
--- Sample laptops
-INSERT INTO laptops (id, brand, model, serial_number, status) VALUES
-  ('LAP001', 'Dell', 'Latitude 5520', 'DL5520001', 'disponible'),
-  ('LAP002', 'HP', 'EliteBook 840', 'HP840002', 'disponible'),
-  ('LAP003', 'Lenovo', 'ThinkPad T14', 'LT14003', 'disponible'),
-  ('LAP004', 'Dell', 'Inspiron 15', 'DI15004', 'disponible'),
-  ('LAP005', 'ASUS', 'ZenBook 14', 'AZ14005', 'disponible'),
-  ('LAP006', 'HP', 'Pavilion 15', 'HP15006', 'disponible'),
-  ('LAP007', 'Lenovo', 'IdeaPad 5', 'LI5007', 'disponible'),
-  ('LAP008', 'Dell', 'XPS 13', 'DX13008', 'disponible')
-ON CONFLICT (id) DO NOTHING;
-
--- Sample biometric devices
-INSERT INTO biometric_devices (serial_number) VALUES
-  ('P320E09638'),
-  ('P320E09639'),
-  ('P320E09640'),
-  ('P320E09641'),
-  ('P320E09642'),
-  ('P320E09643'),
-  ('P320E09644'),
-  ('P320E09645')
-ON CONFLICT (serial_number) DO NOTHING;
-
--- Sample lawyers/authorized persons
-INSERT INTO lawyers (name) VALUES
-  ('Lic. María González'),
-  ('Lic. Juan Pérez'),
-  ('Lic. Ana Rodríguez'),
-  ('Lic. Carlos López'),
-  ('Lic. Laura Martínez'),
-  ('Lic. Roberto Silva'),
-  ('Lic. Carmen Jiménez'),
-  ('Lic. Diego Morales')
-ON CONFLICT (name) DO NOTHING;
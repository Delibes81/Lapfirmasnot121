@@ .. @@
   id text PRIMARY KEY,
   brand text NOT NULL,
   model text NOT NULL,
   serial_number text UNIQUE NOT NULL,
   status laptop_status DEFAULT 'disponible',
-  current_user text,
+  assigned_user text,
   biometric_serial text,
   assigned_at timestamptz,
   created_at timestamptz DEFAULT now(),
   updated_at timestamptz DEFAULT now()
@@ .. @@

-- Crear índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_laptops_serial_number ON laptops(serial_number);
CREATE INDEX IF NOT EXISTS idx_laptops_status ON laptops(status);
-CREATE INDEX IF NOT EXISTS idx_laptops_current_user ON laptops(current_user);
+CREATE INDEX IF NOT EXISTS idx_laptops_assigned_user ON laptops(assigned_user);
CREATE INDEX IF NOT EXISTS idx_laptops_biometric_serial ON laptops(biometric_serial);
CREATE INDEX IF NOT EXISTS idx_assignments_laptop_id ON assignments(laptop_id);
CREATE INDEX IF NOT EXISTS idx_assignments_assigned_at ON assignments(assigned_at DESC);
CREATE INDEX IF NOT EXISTS idx_assignments_returned_at ON assignments(returned_at);
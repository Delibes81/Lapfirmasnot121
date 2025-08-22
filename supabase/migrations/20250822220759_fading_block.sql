@@ .. @@
     biometric_reader boolean default false,
     biometric_serial text,
     status laptop_status default 'disponible',
-    current_user text,
+    assigned_user text,
     created_at timestamptz default now(),
     updated_at timestamptz default now()
 );
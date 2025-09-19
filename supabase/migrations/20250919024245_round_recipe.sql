@@ .. @@
 END $$;
 
-DO $$
-BEGIN
-    ALTER TABLE laptops RENAME COLUMN current_user TO assigned_user;
-EXCEPTION
-    WHEN undefined_column THEN
-        NULL; -- La columna no existe, no hacer nada
-END $$;
-
 -- Crear índices para mejorar el rendimiento
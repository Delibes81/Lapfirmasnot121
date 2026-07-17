-- Añadir campos para registro de módem en laptops
ALTER TABLE laptops ADD COLUMN IF NOT EXISTS includes_modem boolean DEFAULT false;
ALTER TABLE laptops ADD COLUMN IF NOT EXISTS includes_modem_cable boolean DEFAULT false;

-- Añadir campos para registro de módem en el historial de asignaciones
ALTER TABLE assignments ADD COLUMN IF NOT EXISTS includes_modem boolean DEFAULT false;
ALTER TABLE assignments ADD COLUMN IF NOT EXISTS includes_modem_cable boolean DEFAULT false;

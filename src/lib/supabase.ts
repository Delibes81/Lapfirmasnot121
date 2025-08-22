import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Tipos para las operaciones de base de datos
export type LaptopRow = Database['public']['Tables']['laptops']['Row'];
export type LaptopInsert = Database['public']['Tables']['laptops']['Insert'];
export type LaptopUpdate = Database['public']['Tables']['laptops']['Update'];

export type AssignmentRow = Database['public']['Tables']['assignments']['Row'];
export type AssignmentInsert = Database['public']['Tables']['assignments']['Insert'];
export type AssignmentUpdate = Database['public']['Tables']['assignments']['Update'];
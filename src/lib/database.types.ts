export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      laptops: {
        Row: {
          id: string
          brand: string
          model: string
          serial_number: string
          biometric_reader: boolean
          biometric_serial: string | null
          status: 'disponible' | 'en-uso' | 'mantenimiento'
          current_user: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          brand: string
          model: string
          serial_number: string
          biometric_reader?: boolean
          biometric_serial?: string | null
          status?: 'disponible' | 'en-uso' | 'mantenimiento'
          current_user?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          brand?: string
          model?: string
          serial_number?: string
          biometric_reader?: boolean
          biometric_serial?: string | null
          status?: 'disponible' | 'en-uso' | 'mantenimiento'
          current_user?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      assignments: {
        Row: {
          id: string
          laptop_id: string
          user_name: string
          purpose: string
          assigned_at: string
          returned_at: string | null
          return_notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          laptop_id: string
          user_name: string
          purpose?: string
          assigned_at?: string
          returned_at?: string | null
          return_notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          laptop_id?: string
          user_name?: string
          purpose?: string
          assigned_at?: string
          returned_at?: string | null
          return_notes?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
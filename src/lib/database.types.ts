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
          status: 'disponible' | 'en-uso' | 'mantenimiento'
          assigned_user: string | null
          biometric_reader: boolean
          biometric_serial: string | null
          assigned_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          brand: string
          model: string
          serial_number: string
          status?: 'disponible' | 'en-uso' | 'mantenimiento'
          assigned_user?: string | null
          biometric_reader?: boolean
          biometric_serial?: string | null
          assigned_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          brand?: string
          model?: string
          serial_number?: string
          status?: 'disponible' | 'en-uso' | 'mantenimiento'
          assigned_user?: string | null
          biometric_reader?: boolean
          biometric_serial?: string | null
          assigned_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      biometric_devices: {
        Row: {
          id: string
          serial_number: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          serial_number: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          serial_number?: string
          created_at?: string
          updated_at?: string
        }
      }
      lawyers: {
        Row: {
          id: string
          name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
          updated_at?: string
        }
      }
      assignments: {
        Row: {
          id: string
          laptop_id: string
          user_name: string
          biometric_serial: string | null
          assigned_at: string
          returned_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          laptop_id: string
          user_name: string
          biometric_serial?: string | null
          assigned_at?: string
          returned_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          laptop_id?: string
          user_name?: string
          biometric_serial?: string | null
          assigned_at?: string
          returned_at?: string | null
          created_at?: string
          updated_at?: string
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
      laptop_status: 'disponible' | 'en-uso' | 'mantenimiento'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
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
          name: string | null
          brand: string
          model: string
          serial_number: string
          status: 'disponible' | 'en-uso' | 'mantenimiento'
          assigned_user: string | null
          assigned_intern: string | null
          biometric_serial: string | null
          default_biometric: string | null
          includes_modem: boolean | null
          includes_modem_cable: boolean | null
          assigned_at: string | null
          is_public: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name?: string | null
          brand: string
          model: string
          serial_number: string
          status?: 'disponible' | 'en-uso' | 'mantenimiento'
          assigned_user?: string | null
          assigned_intern?: string | null
          biometric_serial?: string | null
          default_biometric?: string | null
          includes_modem?: boolean | null
          includes_modem_cable?: boolean | null
          assigned_at?: string | null
          is_public?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string | null
          brand?: string
          model?: string
          serial_number?: string
          status?: 'disponible' | 'en-uso' | 'mantenimiento'
          assigned_user?: string | null
          assigned_intern?: string | null
          biometric_serial?: string | null
          default_biometric?: string | null
          includes_modem?: boolean | null
          includes_modem_cable?: boolean | null
          assigned_at?: string | null
          is_public?: boolean | null
          created_at?: string
          updated_at?: string
        }
      }
      assignments: {
        Row: {
          id: string
          laptop_id: string
          user_name: string
          assigned_intern: string | null
          biometric_serial: string | null
          includes_modem: boolean | null
          includes_modem_cable: boolean | null
          assigned_at: string
          returned_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          laptop_id: string
          user_name: string
          assigned_intern?: string | null
          biometric_serial?: string | null
          includes_modem?: boolean | null
          includes_modem_cable?: boolean | null
          assigned_at?: string
          returned_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          laptop_id?: string
          user_name?: string
          assigned_intern?: string | null
          biometric_serial?: string | null
          includes_modem?: boolean | null
          includes_modem_cable?: boolean | null
          assigned_at?: string
          returned_at?: string | null
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
      laptop_requests: {
        Row: {
          id: string
          applicant_name: string
          lawyer_name: string
          reason: string
          requested_laptop_id: string
          status: 'pendiente' | 'aprobada' | 'rechazada'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          applicant_name: string
          lawyer_name: string
          reason: string
          requested_laptop_id: string
          status?: 'pendiente' | 'aprobada' | 'rechazada'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          applicant_name?: string
          lawyer_name?: string
          reason?: string
          requested_laptop_id?: string
          status?: 'pendiente' | 'aprobada' | 'rechazada'
          created_at?: string
          updated_at?: string
        }
      }
      pasantes: {
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
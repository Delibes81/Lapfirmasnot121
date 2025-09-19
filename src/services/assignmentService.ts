import { supabase } from '../lib/supabase';
import { Assignment } from '../types';

// Convertir datos de Supabase a tipos de la aplicación
const mapAssignmentFromDB = (dbAssignment: any): Assignment => ({
  id: dbAssignment.id,
  laptopId: dbAssignment.laptop_id,
  userName: dbAssignment.user_name,
  purpose: dbAssignment.purpose || undefined,
  biometricSerial: dbAssignment.biometric_serial,
  assignedAt: dbAssignment.assigned_at,
  returnedAt: dbAssignment.returned_at,
  returnNotes: dbAssignment.return_notes || undefined,
  createdAt: dbAssignment.created_at,
  updatedAt: dbAssignment.updated_at
});

// Servicios para asignaciones
export const assignmentService = {
  // Obtener todas las asignaciones
  async getAllAssignments(): Promise<Assignment[]> {
    const { data, error } = await supabase
      .from('assignments')
      .select('*')
      .order('assigned_at', { ascending: false });

    if (error) {
      console.error('Error fetching assignments:', error);
      throw error;
    }

    return data.map(mapAssignmentFromDB);
  },

  // Crear nueva asignación
  async createAssignment(assignment: {
    laptopId: string;
    userName: string;
    biometricSerial?: string;
  }): Promise<Assignment> {
    const { data, error } = await supabase
      .from('assignments')
      .insert({
        laptop_id: assignment.laptopId,
        user_name: assignment.userName,
        biometric_serial: assignment.biometricSerial || null
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating assignment:', error);
      throw error;
    }

    return mapAssignmentFromDB(data);
  },

  // Marcar asignación como devuelta
  async returnAssignment(laptopId: string): Promise<Assignment | null> {
    // Buscar la asignación activa (sin returned_at)
    const { data: activeAssignments, error: findError } = await supabase
      .from('assignments')
      .select('*')
      .eq('laptop_id', laptopId)
      .is('returned_at', null)
      .order('assigned_at', { ascending: false })
      .limit(1);

    if (findError) {
      console.error('Error finding active assignment:', findError);
      throw findError;
    }

    if (!activeAssignments || activeAssignments.length === 0) {
      return null; // No hay asignación activa
    }

    // Marcar como devuelta
    const { data, error } = await supabase
      .from('assignments')
      .update({
        returned_at: new Date().toISOString()
      })
      .eq('id', activeAssignments[0].id)
      .select()
      .single();

    if (error) {
      console.error('Error returning assignment:', error);
      throw error;
    }

    return mapAssignmentFromDB(data);
  },

  // Obtener asignaciones por laptop
  async getAssignmentsByLaptop(laptopId: string): Promise<Assignment[]> {
    const { data, error } = await supabase
      .from('assignments')
      .select('*')
      .eq('laptop_id', laptopId)
      .order('assigned_at', { ascending: false });

    if (error) {
      console.error('Error fetching assignments by laptop:', error);
      throw error;
    }

    return data.map(mapAssignmentFromDB);
  },

  // Obtener asignación activa por laptop
  async getActiveAssignment(laptopId: string): Promise<Assignment | null> {
    const { data, error } = await supabase
      .from('assignments')
      .select('*')
      .eq('laptop_id', laptopId)
      .is('returned_at', null)
      .order('assigned_at', { ascending: false })
      .limit(1);

    if (error) {
      console.error('Error fetching active assignment:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      return null;
    }

    return mapAssignmentFromDB(data[0]);
  }
};
import { supabase } from '../lib/supabase';
import { Laptop, Assignment, LaptopStatus } from '../types';

// Convertir datos de Supabase a tipos de la aplicación
const mapLaptopFromDB = (dbLaptop: any): Laptop => ({
  id: dbLaptop.id,
  brand: dbLaptop.brand,
  model: dbLaptop.model,
  serialNumber: dbLaptop.serial_number,
  biometricReader: dbLaptop.biometric_reader,
  biometricSerial: dbLaptop.biometric_serial,
  status: dbLaptop.status,
  currentUser: dbLaptop.assigned_user,
  createdAt: dbLaptop.created_at,
  updatedAt: dbLaptop.updated_at
});

const mapAssignmentFromDB = (dbAssignment: any): Assignment => ({
  id: dbAssignment.id,
  laptopId: dbAssignment.laptop_id,
  userName: dbAssignment.user_name,
  purpose: dbAssignment.purpose,
  assignedAt: dbAssignment.assigned_at,
  returnedAt: dbAssignment.returned_at,
  returnNotes: dbAssignment.return_notes
});

// Servicios para laptops
export const laptopService = {
  // Obtener todas las laptops
  async getAllLaptops(): Promise<Laptop[]> {
    const { data, error } = await supabase
      .from('laptops')
      .select('*')
      .order('id');

    if (error) {
      console.error('Error fetching laptops:', error);
      throw error;
    }

    return data.map(mapLaptopFromDB);
  },

  // Crear nueva laptop
  async createLaptop(laptop: Omit<Laptop, 'createdAt' | 'updatedAt'>): Promise<Laptop> {
    const { data, error } = await supabase
      .from('laptops')
      .insert({
        id: laptop.id,
        brand: laptop.brand,
        model: laptop.model,
        serial_number: laptop.serialNumber,
        biometric_reader: laptop.biometricReader,
        biometric_serial: laptop.biometricSerial,
        status: laptop.status,
        assigned_user: laptop.currentUser
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating laptop:', error);
      throw error;
    }

    return mapLaptopFromDB(data);
  },

  // Actualizar laptop
  async updateLaptop(id: string, updates: Partial<Laptop>): Promise<Laptop> {
    const dbUpdates: any = {};
    
    if (updates.brand !== undefined) dbUpdates.brand = updates.brand;
    if (updates.model !== undefined) dbUpdates.model = updates.model;
    if (updates.serialNumber !== undefined) dbUpdates.serial_number = updates.serialNumber;
    if (updates.biometricReader !== undefined) dbUpdates.biometric_reader = updates.biometricReader;
    if (updates.biometricSerial !== undefined) dbUpdates.biometric_serial = updates.biometricSerial;
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.currentUser !== undefined) dbUpdates.assigned_user = updates.currentUser;

    const { data, error } = await supabase
      .from('laptops')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating laptop:', error);
      throw error;
    }

    return mapLaptopFromDB(data);
  },

  // Eliminar laptop
  async deleteLaptop(id: string): Promise<void> {
    const { error } = await supabase
      .from('laptops')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting laptop:', error);
      throw error;
    }
  }
};

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
  async createAssignment(assignment: Omit<Assignment, 'id'>): Promise<Assignment> {
    const { data, error } = await supabase
      .from('assignments')
      .insert({
        laptop_id: assignment.laptopId,
        user_name: assignment.userName,
        purpose: assignment.purpose,
        assigned_at: assignment.assignedAt,
        returned_at: assignment.returnedAt,
        return_notes: assignment.returnNotes
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating assignment:', error);
      throw error;
    }

    return mapAssignmentFromDB(data);
  },

  // Actualizar asignación (principalmente para devoluciones)
  async updateAssignment(id: string, updates: Partial<Assignment>): Promise<Assignment> {
    const dbUpdates: any = {};
    
    if (updates.returnedAt !== undefined) dbUpdates.returned_at = updates.returnedAt;
    if (updates.returnNotes !== undefined) dbUpdates.return_notes = updates.returnNotes;

    const { data, error } = await supabase
      .from('assignments')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating assignment:', error);
      throw error;
    }

    return mapAssignmentFromDB(data);
  }
};
import { supabase } from '../lib/supabase';
import { Laptop } from '../types';

// Convertir datos de Supabase a tipos de la aplicación
const mapLaptopFromDB = (dbLaptop: any): Laptop => ({
  id: dbLaptop.id,
  brand: dbLaptop.brand,
  model: dbLaptop.model,
  serialNumber: dbLaptop.serial_number,
  status: dbLaptop.status,
  currentUser: dbLaptop.assigned_user,
  biometricSerial: dbLaptop.biometric_serial,
  assignedAt: dbLaptop.assigned_at,
  createdAt: dbLaptop.created_at,
  updatedAt: dbLaptop.updated_at
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
  async createLaptop(laptop: { 
    id: string; 
    brand: string; 
    model: string; 
    serialNumber: string;
  }): Promise<Laptop> {
    const { data, error } = await supabase
      .from('laptops')
      .insert({
        id: laptop.id,
        brand: laptop.brand,
        model: laptop.model,
        serial_number: laptop.serialNumber,
        status: 'disponible'
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
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.currentUser !== undefined) dbUpdates.assigned_user = updates.currentUser;
    if (updates.biometricSerial !== undefined) dbUpdates.biometric_serial = updates.biometricSerial;
    if (updates.assignedAt !== undefined) dbUpdates.assigned_at = updates.assignedAt;

    const { data, error } = await supabase
      .from('laptops')
      .update(dbUpdates)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error updating laptop:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      throw new Error(`Laptop with id ${id} not found`);
    }

    return mapLaptopFromDB(data[0]);
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
  },
  // Asignar laptop a usuario
  async assignLaptop(id: string, userName: string, biometricSerial?: string): Promise<Laptop> {
    const { data, error } = await supabase
      .from('laptops')
      .update({
        status: 'en-uso',
        assigned_user: userName,
        biometric_serial: biometricSerial || null,
        assigned_at: new Date().toISOString()
      })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error assigning laptop:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      throw new Error(`Laptop with id ${id} not found`);
    }

    return mapLaptopFromDB(data[0]);
  },

  // Devolver laptop (liberar asignación)
  async returnLaptop(id: string): Promise<Laptop> {
    const { data, error } = await supabase
      .from('laptops')
      .update({
        status: 'disponible',
        assigned_user: null,
        biometric_serial: null,
        assigned_at: null
      })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error returning laptop:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      throw new Error(`Laptop with id ${id} not found`);
    }

    return mapLaptopFromDB(data[0]);
  }
};

import { supabase } from '../lib/supabase';
import { Laptop } from '../types';

// Convertir datos de Supabase a tipos de la aplicación
const mapLaptopFromDB = (dbLaptop: any): Laptop => ({
  id: dbLaptop.id,
  brand: dbLaptop.brand,
  model: dbLaptop.model,
  serialNumber: dbLaptop.serial_number,
  biometricSerial: dbLaptop.biometric_serial,
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
    biometricSerial?: string | null;
  }): Promise<Laptop> {
    const { data, error } = await supabase
      .from('laptops')
      .insert({
        id: laptop.id,
        brand: laptop.brand,
        model: laptop.model,
        serial_number: laptop.serialNumber,
        biometric_serial: laptop.biometricSerial || null
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
    if (updates.biometricSerial !== undefined) dbUpdates.biometric_serial = updates.biometricSerial;

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

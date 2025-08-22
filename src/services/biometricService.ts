import { supabase } from '../lib/supabase';
import { BiometricDevice } from '../types';

// Convertir datos de Supabase a tipos de la aplicación
const mapBiometricDeviceFromDB = (dbDevice: any): BiometricDevice => ({
  id: dbDevice.id,
  serialNumber: dbDevice.serial_number,
  createdAt: dbDevice.created_at,
  updatedAt: dbDevice.updated_at
});

// Servicios para dispositivos biométricos
export const biometricService = {
  // Obtener todos los dispositivos biométricos
  async getAllBiometricDevices(): Promise<BiometricDevice[]> {
    const { data, error } = await supabase
      .from('biometric_devices')
      .select('*')
      .order('serial_number');

    if (error) {
      console.error('Error fetching biometric devices:', error);
      throw error;
    }

    return data.map(mapBiometricDeviceFromDB);
  },

  // Crear nuevo dispositivo biométrico
  async createBiometricDevice(device: { 
    serialNumber: string;
  }): Promise<BiometricDevice> {
    const { data, error } = await supabase
      .from('biometric_devices')
      .insert({
        serial_number: device.serialNumber
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating biometric device:', error);
      throw error;
    }

    return mapBiometricDeviceFromDB(data);
  },

  // Actualizar dispositivo biométrico
  async updateBiometricDevice(id: string, updates: Partial<BiometricDevice>): Promise<BiometricDevice> {
    const dbUpdates: any = {};
    
    if (updates.serialNumber !== undefined) dbUpdates.serial_number = updates.serialNumber;

    const { data, error } = await supabase
      .from('biometric_devices')
      .update(dbUpdates)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error updating biometric device:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      throw new Error(`Biometric device with id ${id} not found`);
    }

    return mapBiometricDeviceFromDB(data[0]);
  },

  // Eliminar dispositivo biométrico
  async deleteBiometricDevice(id: string): Promise<void> {
    const { error } = await supabase
      .from('biometric_devices')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting biometric device:', error);
      throw error;
    }
  }
};
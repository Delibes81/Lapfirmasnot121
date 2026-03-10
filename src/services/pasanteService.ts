import { supabase } from '../lib/supabase';
import { Pasante } from '../types';

// Convertir datos de Supabase a tipos de la aplicación
const mapPasanteFromDB = (dbPasante: any): Pasante => ({
  id: dbPasante.id,
  name: dbPasante.name,
  createdAt: dbPasante.created_at,
  updatedAt: dbPasante.updated_at
});

// Servicios para pasantes
export const pasanteService = {
  // Obtener todos los pasantes
  async getAllPasantes(): Promise<Pasante[]> {
    const { data, error } = await supabase
      .from('pasantes')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching pasantes:', error);
      throw error;
    }

    return data.map(mapPasanteFromDB);
  },

  // Crear nuevo pasante
  async createPasante(pasante: { 
    name: string;
  }): Promise<Pasante> {
    const { data, error } = await supabase
      .from('pasantes')
      .insert({
        name: pasante.name
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating pasante:', error);
      throw error;
    }

    return mapPasanteFromDB(data);
  },

  // Actualizar pasante
  async updatePasante(id: string, updates: Partial<Pasante>): Promise<Pasante> {
    const dbUpdates: any = {};
    
    if (updates.name !== undefined) dbUpdates.name = updates.name;

    const { data, error } = await supabase
      .from('pasantes')
      .update(dbUpdates)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error updating pasante:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      throw new Error(`Pasante with id ${id} not found`);
    }

    return mapPasanteFromDB(data[0]);
  },

  // Eliminar pasante
  async deletePasante(id: string): Promise<void> {
    const { error } = await supabase
      .from('pasantes')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting pasante:', error);
      throw error;
    }
  }
};

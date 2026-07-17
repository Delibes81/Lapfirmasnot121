import { supabase, LawyerRow } from '../lib/supabase';
import { Lawyer } from '../types';

// Convertir datos de Supabase a tipos de la aplicación
const mapLawyerFromDB = (dbLawyer: LawyerRow): Lawyer => ({
  id: dbLawyer.id,
  name: dbLawyer.name,
  createdAt: dbLawyer.created_at,
  updatedAt: dbLawyer.updated_at
});

// Servicios para abogados/personas
export const lawyerService = {
  // Obtener todos los abogados
  async getAllLawyers(): Promise<Lawyer[]> {
    const { data, error } = await supabase
      .from('lawyers')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching lawyers:', error);
      throw error;
    }

    return (data as LawyerRow[]).map(mapLawyerFromDB);
  },

  // Crear nuevo abogado
  async createLawyer(lawyer: { 
    name: string;
  }): Promise<Lawyer> {
    const { data, error } = await supabase
      .from('lawyers')
      .insert({
        name: lawyer.name
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating lawyer:', error);
      throw error;
    }

    return mapLawyerFromDB(data as LawyerRow);
  },

  // Actualizar abogado
  async updateLawyer(id: string, updates: Partial<Lawyer>): Promise<Lawyer> {
    const dbUpdates: Record<string, unknown> = {};
    
    if (updates.name !== undefined) dbUpdates.name = updates.name;

    const { data, error } = await supabase
      .from('lawyers')
      .update(dbUpdates)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error updating lawyer:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      throw new Error(`Lawyer with id ${id} not found`);
    }

    return mapLawyerFromDB(data[0] as LawyerRow);
  },

  // Eliminar abogado
  async deleteLawyer(id: string): Promise<void> {
    const { error } = await supabase
      .from('lawyers')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting lawyer:', error);
      throw error;
    }
  }
};
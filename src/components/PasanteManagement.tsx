import { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, User, UserCheck } from 'lucide-react';
import { Pasante } from '../types';
import { pasanteService } from '../services/pasanteService';
import AddPasanteModal from './AddPasanteModal';
import EditPasanteModal from './EditPasanteModal';

export default function PasanteManagement() {
  const [pasantes, setPasantes] = useState<Pasante[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPasante, setEditingPasante] = useState<Pasante | null>(null);

  useEffect(() => {
    loadPasantes();
  }, []);

  const loadPasantes = async () => {
    try {
      setLoading(true);
      const pasantesData = await pasanteService.getAllPasantes();
      setPasantes(pasantesData);
    } catch (error) {
      console.error('Error loading pasantes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPasante = (newPasante: Pasante) => {
    setPasantes(prev => [...prev, newPasante]);
    setShowAddModal(false);
  };

  const handleUpdatePasante = (updatedPasante: Pasante) => {
    setPasantes(prev => prev.map(pasante => 
      pasante.id === updatedPasante.id ? updatedPasante : pasante
    ));
    setEditingPasante(null);
  };

  const handleDeletePasante = async (pasanteId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este pasante?')) {
      return;
    }

    try {
      await pasanteService.deletePasante(pasanteId);
      setPasantes(prev => prev.filter(p => p.id !== pasanteId));
    } catch (error) {
      console.error('Error deleting pasante:', error);
      alert('Error al eliminar el pasante. Por favor, inténtalo de nuevo.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <User className="h-8 w-8 text-white animate-pulse" />
          </div>
          <p className="text-gray-600">Cargando pasantes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Pasantes</h3>
          <p className="text-gray-600 mt-1">Gestión de pasantes asignados a equipos</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all shadow-sm hover:shadow-md"
        >
          <Plus className="h-4 w-4 mr-2" />
          Agregar Pasante
        </button>
      </div>

      {/* Stats */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-purple-200/50 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-purple-600">Total Pasantes</p>
            <p className="text-3xl font-bold text-purple-700">{pasantes.length}</p>
          </div>
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
            <UserCheck className="h-6 w-6 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Pasantes Grid */}
      {pasantes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {pasantes.map((pasante) => (
            <div
              key={pasante.id}
              className="group bg-white/80 backdrop-blur-md rounded-3xl shadow-lg border border-gray-200/50 p-6 hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 relative overflow-hidden"
            >
              {/* Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative flex items-start justify-between mb-6">
                <div className="flex items-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 via-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                    <User className="h-7 w-7 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-purple-700 transition-colors duration-300">
                      Pasante
                    </h3>
                    <p className="text-sm text-gray-600 font-medium">Asignación Temporal</p>
                  </div>
                </div>
                
                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <button
                    onClick={() => setEditingPasante(pasante)}
                    className="p-2 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl hover:bg-purple-50 hover:text-purple-600 text-gray-600 transition-all"
                    title="Editar pasante"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeletePasante(pasante.id)}
                    className="p-2 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl hover:bg-red-50 hover:text-red-600 text-gray-600 transition-all"
                    title="Eliminar pasante"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="relative space-y-3">
                <div className="bg-gray-50/80 rounded-xl p-3 border border-purple-50/50 shadow-inner">
                  <p className="font-semibold text-gray-800 text-center">{pasante.name}</p>
                </div>
                <div className="text-xs text-gray-500 text-center">
                  Agregado: {new Date(pasante.createdAt).toLocaleDateString('es-ES')}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-12 border border-gray-200/50 shadow-sm text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <User className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay pasantes registrados</h3>
          <p className="text-gray-600 mb-6">Agrega el primer pasante a la plataforma.</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all shadow-sm hover:shadow-md"
          >
            <Plus className="h-4 w-4 mr-2" />
            Agregar Primer Pasante
          </button>
        </div>
      )}

      {/* Modals */}
      {showAddModal && (
        <AddPasanteModal
          onAdd={handleAddPasante}
          onClose={() => setShowAddModal(false)}
          existingPasantes={pasantes}
        />
      )}

      {editingPasante && (
        <EditPasanteModal
          pasante={editingPasante}
          onUpdate={handleUpdatePasante}
          onClose={() => setEditingPasante(null)}
          existingPasantes={pasantes}
        />
      )}
    </div>
  );
}

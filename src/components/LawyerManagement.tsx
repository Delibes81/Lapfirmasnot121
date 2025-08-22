import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, User, UserCheck } from 'lucide-react';
import { Lawyer } from '../types';
import { lawyerService } from '../services/lawyerService';
import AddLawyerModal from './AddLawyerModal';
import EditLawyerModal from './EditLawyerModal';

export default function LawyerManagement() {
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLawyer, setEditingLawyer] = useState<Lawyer | null>(null);

  useEffect(() => {
    loadLawyers();
  }, []);

  const loadLawyers = async () => {
    try {
      setLoading(true);
      const lawyersData = await lawyerService.getAllLawyers();
      setLawyers(lawyersData);
    } catch (error) {
      console.error('Error loading lawyers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLawyer = (newLawyer: Lawyer) => {
    setLawyers(prev => [...prev, newLawyer]);
    setShowAddModal(false);
  };

  const handleUpdateLawyer = (updatedLawyer: Lawyer) => {
    setLawyers(prev => prev.map(lawyer => 
      lawyer.id === updatedLawyer.id ? updatedLawyer : lawyer
    ));
    setEditingLawyer(null);
  };

  const handleDeleteLawyer = async (lawyerId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este abogado/persona?')) {
      return;
    }

    try {
      await lawyerService.deleteLawyer(lawyerId);
      setLawyers(prev => prev.filter(lawyer => lawyer.id !== lawyerId));
    } catch (error) {
      console.error('Error deleting lawyer:', error);
      alert('Error al eliminar el abogado. Por favor, inténtalo de nuevo.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-emerald-600 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <User className="h-8 w-8 text-white animate-pulse" />
          </div>
          <p className="text-gray-600">Cargando abogados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Abogados y Personas</h3>
          <p className="text-gray-600 mt-1">Gestión de personas autorizadas para usar laptops</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl hover:from-emerald-700 hover:to-green-700 transition-all shadow-sm hover:shadow-md"
        >
          <Plus className="h-4 w-4 mr-2" />
          Agregar Persona
        </button>
      </div>

      {/* Stats */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-emerald-200/50 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-emerald-600">Total Personas</p>
            <p className="text-3xl font-bold text-emerald-700">{lawyers.length}</p>
          </div>
          <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
            <UserCheck className="h-6 w-6 text-emerald-600" />
          </div>
        </div>
      </div>

      {/* Lawyers Grid */}
      {lawyers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {lawyers.map((lawyer) => (
            <div
              key={lawyer.id}
              className="group bg-white/80 backdrop-blur-md rounded-3xl shadow-lg border border-gray-200/50 p-6 hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 relative overflow-hidden"
            >
              {/* Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative flex items-start justify-between mb-6">
                <div className="flex items-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 via-green-600 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                    <User className="h-7 w-7 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-emerald-700 transition-colors duration-300">
                      Abogado
                    </h3>
                    <p className="text-sm text-gray-600 font-medium">Persona Autorizada</p>
                  </div>
                </div>
                
                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <button
                    onClick={() => setEditingLawyer(lawyer)}
                    className="p-2 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl hover:bg-emerald-50 hover:text-emerald-600 text-gray-600 transition-all"
                    title="Editar persona"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteLawyer(lawyer.id)}
                    className="p-2 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl hover:bg-red-50 hover:text-red-600 text-gray-600 transition-all"
                    title="Eliminar persona"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="relative space-y-3">
                <div className="bg-gray-50/80 rounded-xl p-3">
                  <p className="font-semibold text-gray-800 text-center">{lawyer.name}</p>
                </div>
                <div className="text-xs text-gray-500 text-center">
                  Agregado: {new Date(lawyer.createdAt).toLocaleDateString('es-ES')}
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
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay personas registradas</h3>
          <p className="text-gray-600 mb-6">Agrega la primera persona autorizada para usar laptops.</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl hover:from-emerald-700 hover:to-green-700 transition-all shadow-sm hover:shadow-md"
          >
            <Plus className="h-4 w-4 mr-2" />
            Agregar Primera Persona
          </button>
        </div>
      )}

      {/* Modals */}
      {showAddModal && (
        <AddLawyerModal
          onAdd={handleAddLawyer}
          onClose={() => setShowAddModal(false)}
          existingLawyers={lawyers}
        />
      )}

      {editingLawyer && (
        <EditLawyerModal
          lawyer={editingLawyer}
          onUpdate={handleUpdateLawyer}
          onClose={() => setEditingLawyer(null)}
          existingLawyers={lawyers}
        />
      )}
    </div>
  );
}
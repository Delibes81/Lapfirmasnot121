import React, { useState } from 'react';
import { X, User, Save } from 'lucide-react';
import { Lawyer } from '../types';
import { lawyerService } from '../services/lawyerService';

interface EditLawyerModalProps {
  lawyer: Lawyer;
  onUpdate: (updatedLawyer: Lawyer) => void;
  onClose: () => void;
  existingLawyers: Lawyer[];
}

export default function EditLawyerModal({ lawyer, onUpdate, onClose, existingLawyers }: EditLawyerModalProps) {
  const [name, setName] = useState(lawyer.name);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    if (!name.trim()) {
      setError('El nombre es requerido');
      return false;
    }

    if (
      name.toLowerCase() !== lawyer.name.toLowerCase() &&
      existingLawyers.some(l => l.name.toLowerCase() === name.toLowerCase())
    ) {
      setError('Esta persona ya existe');
      return false;
    }

    setError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      const updatedLawyer = await lawyerService.updateLawyer(lawyer.id, {
        name: name.trim()
      });
      onUpdate(updatedLawyer);
    } catch (error) {
      console.error('Error updating lawyer:', error);
      setError('Error al actualizar la persona. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNameChange = (value: string) => {
    setName(value);
    if (error) {
      setError('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-green-600 rounded-xl flex items-center justify-center mr-3">
              <User className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Editar Persona</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Lawyer Info Display */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-green-600 rounded-xl flex items-center justify-center mr-3">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Editando Persona</h3>
                <p className="text-sm text-gray-500">ID: {lawyer.id.slice(0, 8)}...</p>
              </div>
            </div>
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              <User className="h-4 w-4 inline mr-1" />
              Nombre Completo
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                error ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Ej: Lic. Juan Pérez"
              required
            />
            {error && (
              <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
          </div>

          {/* Info */}
          <div className="bg-emerald-50 rounded-lg p-4">
            <div className="flex items-start">
              <User className="h-5 w-5 text-emerald-600 mr-2 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-emerald-800">Información</h4>
                <p className="text-sm text-emerald-700 mt-1">
                  Creado: {new Date(lawyer.createdAt).toLocaleDateString('es-ES')}
                </p>
                <p className="text-sm text-emerald-700">
                  Última actualización: {new Date(lawyer.updatedAt).toLocaleDateString('es-ES')}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl hover:from-emerald-700 hover:to-green-700 transition-all font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Cambios
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
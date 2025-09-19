import React, { useState } from 'react';
import { X, Laptop, AlertTriangle, Trash2 } from 'lucide-react';
import { Laptop as LaptopType } from '../types';

interface DeleteLaptopModalProps {
  laptop: LaptopType;
  onConfirm: (laptopId: string) => void;
  onClose: () => void;
}

export default function DeleteLaptopModal({ laptop, onConfirm, onClose }: DeleteLaptopModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm(laptop.id);
    } catch (error) {
      console.error('Error deleting laptop:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const canDelete = laptop.status === 'disponible';

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-pink-600 rounded-xl flex items-center justify-center mr-3">
              <Trash2 className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Eliminar Laptop</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Laptop Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mr-3">
                <Laptop className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{laptop.id}</h3>
                <p className="text-sm text-gray-500">{laptop.brand} {laptop.model}</p>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <p><span className="font-medium">S/N:</span> {laptop.serialNumber}</p>
              <p><span className="font-medium">Estado:</span> {laptop.status}</p>
              {laptop.currentUser && (
                <p><span className="font-medium">Usuario actual:</span> {laptop.currentUser}</p>
              )}
            </div>
          </div>

          {/* Warning */}
          {!canDelete ? (
            <div className="bg-red-50 rounded-lg p-4">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-red-800">No se puede eliminar</h4>
                  <p className="text-sm text-red-700 mt-1">
                    Esta laptop está actualmente {laptop.status === 'en-uso' ? 'en uso' : 'en mantenimiento'}. 
                    Debe estar disponible para poder eliminarla.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-red-50 rounded-lg p-4">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-red-800">¡Advertencia!</h4>
                  <p className="text-sm text-red-700 mt-1">
                    Esta acción no se puede deshacer. La laptop será eliminada permanentemente del sistema, 
                    incluyendo todo su historial de asignaciones.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium"
              disabled={isDeleting}
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              disabled={!canDelete || isDeleting}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl hover:from-red-700 hover:to-pink-700 transition-all font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isDeleting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Eliminando...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar Laptop
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
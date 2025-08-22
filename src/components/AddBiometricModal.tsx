import React, { useState } from 'react';
import { X, Fingerprint, Hash } from 'lucide-react';
import { BiometricDevice } from '../types';
import { biometricService } from '../services/biometricService';

interface AddBiometricModalProps {
  onAdd: (device: BiometricDevice) => void;
  onClose: () => void;
  existingDevices: BiometricDevice[];
}

export default function AddBiometricModal({ onAdd, onClose, existingDevices }: AddBiometricModalProps) {
  const [serialNumber, setSerialNumber] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    if (!serialNumber.trim()) {
      setError('El número de serie es requerido');
      return false;
    }

    if (existingDevices.some(device => device.serialNumber === serialNumber)) {
      setError('Este número de serie ya existe');
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
      const newDevice = await biometricService.createBiometricDevice({
        serialNumber: serialNumber.trim()
      });
      onAdd(newDevice);
    } catch (error) {
      console.error('Error creating biometric device:', error);
      setError('Error al crear el dispositivo. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSerialNumberChange = (value: string) => {
    setSerialNumber(value.toUpperCase());
    if (error) {
      setError('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mr-3">
              <Fingerprint className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Agregar Dispositivo Biométrico</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Serial Number */}
          <div>
            <label htmlFor="serialNumber" className="block text-sm font-medium text-gray-700 mb-2">
              <Hash className="h-4 w-4 inline mr-1" />
              Número de Serie
            </label>
            <input
              type="text"
              id="serialNumber"
              value={serialNumber}
              onChange={(e) => handleSerialNumberChange(e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors font-mono ${
                error ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Ej: P320E09638"
              required
            />
            {error && (
              <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
          </div>

          {/* Info */}
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-start">
              <Fingerprint className="h-5 w-5 text-purple-600 mr-2 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-purple-800">Información</h4>
                <p className="text-sm text-purple-700 mt-1">
                  El número de serie debe ser único y corresponder al dispositivo biométrico físico.
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
              disabled={isLoading || !serialNumber.trim()}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Agregando...
                </>
              ) : (
                'Agregar Dispositivo'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
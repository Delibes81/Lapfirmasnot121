import React, { useState, useEffect } from 'react';
import { X, User, Fingerprint, Calendar, CheckCircle } from 'lucide-react';
import { Laptop, Lawyer, BiometricDevice } from '../types';
import { lawyerService } from '../services/lawyerService';
import { biometricService } from '../services/biometricService';

interface AssignmentModalProps {
  laptop: Laptop;
  isReturning: boolean;
  onAssign: (laptopId: string, userName: string, biometricSerial?: string) => void;
  onReturn: (laptopId: string) => void;
  onClose: () => void;
}

export default function AssignmentModal({ 
  laptop, 
  isReturning, 
  onAssign, 
  onReturn, 
  onClose 
}: AssignmentModalProps) {
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedBiometric, setSelectedBiometric] = useState('');
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [biometricDevices, setBiometricDevices] = useState<BiometricDevice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [lawyersData, biometricsData] = await Promise.all([
        lawyerService.getAllLawyers(),
        biometricService.getAllBiometricDevices()
      ]);
      setLawyers(lawyersData);
      setBiometricDevices(biometricsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isReturning) {
      onReturn(laptop.id);
    } else {
      if (selectedUser) {
        onAssign(laptop.id, selectedUser, selectedBiometric || undefined);
      }
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando datos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-3 ${
              isReturning 
                ? 'bg-gradient-to-r from-emerald-600 to-green-600' 
                : 'bg-gradient-to-r from-blue-600 to-indigo-600'
            }`}>
              {isReturning ? (
                <CheckCircle className="h-5 w-5 text-white" />
              ) : (
                <User className="h-5 w-5 text-white" />
              )}
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              {isReturning ? 'Devolver Laptop' : 'Asignar Laptop'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Laptop Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mr-3">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{laptop.id}</h3>
                <p className="text-sm text-gray-500">{laptop.brand} {laptop.model}</p>
              </div>
            </div>
            {laptop.currentUser && (
              <p className="text-sm text-gray-600">
                <span className="font-medium">Usuario actual:</span> {laptop.currentUser}
              </p>
            )}
            {laptop.biometricSerial && (
              <p className="text-sm text-gray-600">
                <span className="font-medium">Biométrico actual:</span> {laptop.biometricSerial}
              </p>
            )}
          </div>

          {!isReturning ? (
            <>
              {/* User Selection */}
              <div>
                <label htmlFor="user" className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="h-4 w-4 inline mr-1" />
                  Seleccionar Usuario
                </label>
                <select
                  id="user"
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Selecciona un usuario...</option>
                  {lawyers.map((lawyer) => (
                    <option key={lawyer.id} value={lawyer.name}>
                      {lawyer.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Biometric Selection */}
              <div>
                <label htmlFor="biometric" className="block text-sm font-medium text-gray-700 mb-2">
                  <Fingerprint className="h-4 w-4 inline mr-1" />
                  Dispositivo Biométrico (Opcional)
                </label>
                <select
                  id="biometric"
                  value={selectedBiometric}
                  onChange={(e) => setSelectedBiometric(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                >
                  <option value="">Sin biométrico</option>
                  {biometricDevices.map((device) => (
                    <option key={device.id} value={device.serialNumber}>
                      {device.serialNumber}
                    </option>
                  ))}
                </select>
              </div>
            </>
          ) : (
            <div className="bg-emerald-50 rounded-lg p-4">
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-emerald-600 mr-2 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-emerald-800">Confirmar Devolución</h4>
                  <p className="text-sm text-emerald-700 mt-1">
                    La laptop será marcada como disponible y se liberará la asignación del usuario y biométrico.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Date Info */}
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-1" />
            <span>Fecha y hora: {new Date().toLocaleString('es-ES')}</span>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!isReturning && !selectedUser}
              className={`flex-1 px-4 py-3 rounded-xl text-white font-medium transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed ${
                isReturning
                  ? 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
              }`}
            >
              {isReturning ? 'Confirmar Devolución' : 'Asignar Laptop'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
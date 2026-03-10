import React, { useState } from 'react';
import { X, User, Fingerprint, Calendar, CheckCircle } from 'lucide-react';
import { Laptop, Lawyer, BiometricDevice, Pasante } from '../types';

interface AssignmentModalProps {
  laptop: Laptop;
  isReturning: boolean;
  onAssign: (laptopId: string, userName: string, biometricSerial?: string, internName?: string) => void;
  onReturn: (laptopId: string) => void;
  onClose: () => void;
  existingLawyers: Lawyer[];
  existingBiometrics: BiometricDevice[];
  existingPasantes: Pasante[];
}

export default function AssignmentModal({ 
  laptop, 
  isReturning, 
  onAssign, 
  onReturn, 
  onClose,
  existingLawyers,
  existingBiometrics,
  existingPasantes
}: AssignmentModalProps) {
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedBiometric, setSelectedBiometric] = useState('');
  const [internName, setInternName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isReturning) {
      onReturn(laptop.id);
    } else {
      if (selectedUser || internName) {
        // If neither user nor intern is fully selected, we shouldn't submit, but
        // if only internName is present, default userName to "Asignado a Pasante" to pass db constraint.
        const fallbackUserName = selectedUser ? selectedUser : "Asignación Temporal";
        onAssign(laptop.id, fallbackUserName, selectedBiometric || undefined, internName || undefined);
      }
    }
  };

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
            {laptop.assignedIntern && (
              <p className="text-sm text-gray-600">
                <span className="font-medium text-purple-600">Pasante actual:</span> {laptop.assignedIntern}
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
                  Seleccionar Usuario (Opcional si hay pasante)
                </label>
                <select
                  id="user"
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Selecciona un usuario...</option>
                  {existingLawyers.map((lawyer) => (
                    <option key={lawyer.id} value={lawyer.name}>
                      {lawyer.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Intern Input with Datalist */}
              <div>
                <label htmlFor="pasante" className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="h-4 w-4 inline mr-1 text-purple-600" />
                  Nombre de Pasante (Opcional)
                </label>
                <input
                  type="text"
                  id="pasante"
                  list="pasantes-list"
                  value={internName}
                  onChange={(e) => setInternName(e.target.value)}
                  placeholder="👩‍🎓 Ej: Juan Pérez"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-purple-900"
                />
                <datalist id="pasantes-list">
                  {existingPasantes.map((p) => (
                    <option key={p.id} value={p.name} />
                  ))}
                </datalist>
                <p className="text-xs text-gray-500 mt-1">Podrás buscar un pasante existente o crear uno nuevo al escribir su nombre.</p>
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
                  {existingBiometrics.map((device) => (
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
                    La laptop será marcada como disponible y se liberará la asignación del usuario, pasante y biométrico.
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
              disabled={!isReturning && !selectedUser && !internName}
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
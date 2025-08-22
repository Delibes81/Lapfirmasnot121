import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Fingerprint, Hash } from 'lucide-react';
import { BiometricDevice } from '../types';
import { biometricService } from '../services/biometricService';
import AddBiometricModal from './AddBiometricModal';
import EditBiometricModal from './EditBiometricModal';

export default function BiometricManagement() {
  const [devices, setDevices] = useState<BiometricDevice[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDevice, setEditingDevice] = useState<BiometricDevice | null>(null);

  useEffect(() => {
    loadDevices();
  }, []);

  const loadDevices = async () => {
    try {
      setLoading(true);
      const devicesData = await biometricService.getAllBiometricDevices();
      setDevices(devicesData);
    } catch (error) {
      console.error('Error loading biometric devices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDevice = (newDevice: BiometricDevice) => {
    setDevices(prev => [...prev, newDevice]);
    setShowAddModal(false);
  };

  const handleUpdateDevice = (updatedDevice: BiometricDevice) => {
    setDevices(prev => prev.map(device => 
      device.id === updatedDevice.id ? updatedDevice : device
    ));
    setEditingDevice(null);
  };

  const handleDeleteDevice = async (deviceId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este dispositivo biométrico?')) {
      return;
    }

    try {
      await biometricService.deleteBiometricDevice(deviceId);
      setDevices(prev => prev.filter(device => device.id !== deviceId));
    } catch (error) {
      console.error('Error deleting biometric device:', error);
      alert('Error al eliminar el dispositivo. Por favor, inténtalo de nuevo.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Fingerprint className="h-8 w-8 text-white animate-pulse" />
          </div>
          <p className="text-gray-600">Cargando dispositivos biométricos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Dispositivos Biométricos</h3>
          <p className="text-gray-600 mt-1">Gestión de lectores de huella digital</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-sm hover:shadow-md"
        >
          <Plus className="h-4 w-4 mr-2" />
          Agregar Dispositivo
        </button>
      </div>

      {/* Stats */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-purple-200/50 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-purple-600">Total Dispositivos</p>
            <p className="text-3xl font-bold text-purple-700">{devices.length}</p>
          </div>
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
            <Fingerprint className="h-6 w-6 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Devices Grid */}
      {devices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {devices.map((device) => (
            <div
              key={device.id}
              className="group bg-white/80 backdrop-blur-md rounded-3xl shadow-lg border border-gray-200/50 p-6 hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 relative overflow-hidden"
            >
              {/* Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative flex items-start justify-between mb-6">
                <div className="flex items-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 via-pink-600 to-red-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                    <Fingerprint className="h-7 w-7 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-purple-700 transition-colors duration-300">
                      Biométrico
                    </h3>
                    <p className="text-sm text-gray-600 font-medium">Lector de Huella</p>
                  </div>
                </div>
                
                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <button
                    onClick={() => setEditingDevice(device)}
                    className="p-2 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl hover:bg-purple-50 hover:text-purple-600 text-gray-600 transition-all"
                    title="Editar dispositivo"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteDevice(device.id)}
                    className="p-2 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl hover:bg-red-50 hover:text-red-600 text-gray-600 transition-all"
                    title="Eliminar dispositivo"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="relative space-y-3">
                <div className="flex items-center justify-between text-sm bg-gray-50/80 rounded-xl p-3">
                  <span className="text-gray-500 font-medium flex items-center">
                    <Hash className="h-4 w-4 mr-1" />
                    S/N:
                  </span>
                  <span className="font-mono text-gray-800 font-semibold">{device.serialNumber}</span>
                </div>
                <div className="text-xs text-gray-500 text-center">
                  Agregado: {new Date(device.createdAt).toLocaleDateString('es-ES')}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-12 border border-gray-200/50 shadow-sm text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Fingerprint className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay dispositivos biométricos</h3>
          <p className="text-gray-600 mb-6">Agrega tu primer dispositivo biométrico para comenzar.</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-sm hover:shadow-md"
          >
            <Plus className="h-4 w-4 mr-2" />
            Agregar Primer Dispositivo
          </button>
        </div>
      )}

      {/* Modals */}
      {showAddModal && (
        <AddBiometricModal
          onAdd={handleAddDevice}
          onClose={() => setShowAddModal(false)}
          existingDevices={devices}
        />
      )}

      {editingDevice && (
        <EditBiometricModal
          device={editingDevice}
          onUpdate={handleUpdateDevice}
          onClose={() => setEditingDevice(null)}
          existingDevices={devices}
        />
      )}
    </div>
  );
}
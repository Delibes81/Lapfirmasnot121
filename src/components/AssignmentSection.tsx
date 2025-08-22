import React, { useState, useEffect } from 'react';
import { UserPlus, CheckCircle, User, Fingerprint, Laptop, Calendar, ArrowRight } from 'lucide-react';
import { Laptop as LaptopType, Lawyer, BiometricDevice } from '../types';
import { lawyerService } from '../services/lawyerService';
import { biometricService } from '../services/biometricService';
import { laptopService } from '../services/laptopService';

interface AssignmentSectionProps {
  laptops: LaptopType[];
  onDataChange: () => void;
}

export default function AssignmentSection({ laptops, onDataChange }: AssignmentSectionProps) {
  const [selectedLaptop, setSelectedLaptop] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedBiometric, setSelectedBiometric] = useState('');
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [biometricDevices, setBiometricDevices] = useState<BiometricDevice[]>([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);

  const availableLaptops = laptops.filter(l => l.status === 'disponible' || !l.status);
  const inUseLaptops = laptops.filter(l => l.status === 'en-uso');

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

  const handleAssign = async () => {
    if (!selectedLaptop || !selectedUser) return;

    try {
      setAssigning(true);
      await laptopService.assignLaptop(selectedLaptop, selectedUser, selectedBiometric || undefined);
      
      // Reset form
      setSelectedLaptop('');
      setSelectedUser('');
      setSelectedBiometric('');
      
      // Refresh data
      onDataChange();
    } catch (error) {
      console.error('Error assigning laptop:', error);
      alert('Error al asignar la laptop. Por favor, inténtalo de nuevo.');
    } finally {
      setAssigning(false);
    }
  };

  const handleReturn = async (laptopId: string) => {
    if (!confirm('¿Estás seguro de que quieres devolver esta laptop?')) return;

    try {
      await laptopService.returnLaptop(laptopId);
      onDataChange();
    } catch (error) {
      console.error('Error returning laptop:', error);
      alert('Error al devolver la laptop. Por favor, inténtalo de nuevo.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <UserPlus className="h-8 w-8 text-white animate-pulse" />
          </div>
          <p className="text-gray-600">Cargando datos de asignación...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900">Asignación de Laptops</h3>
        <p className="text-gray-600 mt-1">Asigna laptops a usuarios y gestiona devoluciones</p>
      </div>

      {/* Assignment Form */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-blue-200/50 shadow-sm">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mr-3">
            <UserPlus className="h-5 w-5 text-white" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900">Nueva Asignación</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Laptop Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Laptop className="h-4 w-4 inline mr-1" />
              Seleccionar Laptop
            </label>
            <select
              value={selectedLaptop}
              onChange={(e) => setSelectedLaptop(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Selecciona una laptop...</option>
              {availableLaptops.map((laptop) => (
                <option key={laptop.id} value={laptop.id}>
                  {laptop.id} - {laptop.brand} {laptop.model}
                </option>
              ))}
            </select>
          </div>

          {/* User Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="h-4 w-4 inline mr-1" />
              Seleccionar Usuario
            </label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Fingerprint className="h-4 w-4 inline mr-1" />
              Dispositivo Biométrico (Opcional)
            </label>
            <select
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
        </div>

        {/* Assignment Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleAssign}
            disabled={!selectedLaptop || !selectedUser || assigning}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {assigning ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Asignando...
              </>
            ) : (
              <>
                <ArrowRight className="h-4 w-4 mr-2" />
                Asignar Laptop
              </>
            )}
          </button>
        </div>
      </div>

      {/* Current Assignments */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-orange-200/50 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl flex items-center justify-center mr-3">
              <CheckCircle className="h-5 w-5 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900">Laptops Asignadas</h4>
          </div>
          <div className="text-sm text-gray-600">
            {inUseLaptops.length} laptop{inUseLaptops.length !== 1 ? 's' : ''} en uso
          </div>
        </div>

        {inUseLaptops.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {inUseLaptops.map((laptop) => (
              <div
                key={laptop.id}
                className="bg-white/80 rounded-xl p-4 border border-orange-200/50 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mr-3">
                    {laptop.id} - {laptop.brand} {laptop.model} ({laptop.status || 'disponible'})
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900">{laptop.id}</h5>
                      <p className="text-sm text-gray-600">{laptop.brand} {laptop.model}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleReturn(laptop.id)}
                    className="p-2 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 transition-colors"
                    title="Devolver laptop"
                  >
                    <CheckCircle className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 flex items-center">
                      <User className="h-3 w-3 mr-1" />
                      Usuario:
                    </span>
                    <span className="font-medium text-gray-900">{laptop.currentUser}</span>
                  </div>
                  
                  {laptop.biometricSerial && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 flex items-center">
                        <Fingerprint className="h-3 w-3 mr-1" />
                        Biométrico:
                      </span>
                      <span className="font-mono text-gray-900 text-xs">{laptop.biometricSerial}</span>
                    </div>
                  )}
                  
                  {laptop.assignedAt && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        Asignado:
                      </span>
                      <span className="text-gray-900 text-xs">
                        {new Date(laptop.assignedAt).toLocaleDateString('es-ES')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Laptop className="h-8 w-8 text-gray-400" />
              {availableLaptops.length === 0 && !loading && (
                <p className="text-sm text-gray-500 mt-1">
                  No hay laptops disponibles. Total laptops: {laptops.length}
                </p>
              )}
            </div>
            <h5 className="text-lg font-medium text-gray-900 mb-2">No hay laptops asignadas</h5>
            <p className="text-gray-600">Todas las laptops están disponibles para asignación.</p>
          </div>
        )}
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { X, Laptop, Building, Hash, Fingerprint } from 'lucide-react';
import { Laptop as LaptopType } from '../types';
import { laptopService } from '../services/laptopService';
import { biometricService } from '../services/biometricService';
import { BiometricDevice } from '../types';

interface AddLaptopModalProps {
  onAdd: (laptop: LaptopType) => void;
  onClose: () => void;
  existingLaptops: LaptopType[];
}

export default function AddLaptopModal({ onAdd, onClose, existingLaptops }: AddLaptopModalProps) {
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    serialNumber: '',
    biometricSerial: ''
  });

  const [biometricDevices, setBiometricDevices] = useState<BiometricDevice[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loadingBiometrics, setLoadingBiometrics] = useState(true);

  // Cargar dispositivos biométricos al montar el componente
  React.useEffect(() => {
    const loadBiometricDevices = async () => {
      try {
        const devices = await biometricService.getAllBiometricDevices();
        setBiometricDevices(devices);
      } catch (error) {
        console.error('Error loading biometric devices:', error);
      } finally {
        setLoadingBiometrics(false);
      }
    };

    loadBiometricDevices();
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.brand.trim()) {
      newErrors.brand = 'La marca es requerida';
    }

    if (!formData.model.trim()) {
      newErrors.model = 'El modelo es requerido';
    }

    if (!formData.serialNumber.trim()) {
      newErrors.serialNumber = 'El número de serie es requerido';
    } else if (existingLaptops.some(laptop => laptop.serialNumber === formData.serialNumber)) {
      newErrors.serialNumber = 'Este número de serie ya existe';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const newLaptop: Omit<LaptopType, 'createdAt' | 'updatedAt'> = {
        id: `LT-${String(existingLaptops.length + 1).padStart(3, '0')}`,
        brand: formData.brand,
        model: formData.model,
        serialNumber: formData.serialNumber,
        biometricSerial: formData.biometricSerial || null
      };

      const createdLaptop = await laptopService.createLaptop(newLaptop);
      onAdd(createdLaptop);
    } catch (error) {
      console.error('Error creating laptop:', error);
      alert('Error al crear la laptop. Por favor, inténtalo de nuevo.');
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mr-3">
              <Laptop className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Agregar Nueva Laptop</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Brand */}
          <div>
            <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-2">
              <Building className="h-4 w-4 inline mr-1" />
              Marca
            </label>
            <input
              type="text"
              id="brand"
              value={formData.brand}
              onChange={(e) => handleInputChange('brand', e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.brand ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Ej: Dell, HP, Lenovo"
            />
            {errors.brand && (
              <p className="mt-1 text-sm text-red-600">{errors.brand}</p>
            )}
          </div>

          {/* Model */}
          <div>
            <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-2">
              <Laptop className="h-4 w-4 inline mr-1" />
              Modelo
            </label>
            <input
              type="text"
              id="model"
              value={formData.model}
              onChange={(e) => handleInputChange('model', e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.model ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Ej: Latitude 5520, EliteBook 840"
            />
            {errors.model && (
              <p className="mt-1 text-sm text-red-600">{errors.model}</p>
            )}
          </div>

          {/* Serial Number */}
          <div>
            <label htmlFor="serialNumber" className="block text-sm font-medium text-gray-700 mb-2">
              <Hash className="h-4 w-4 inline mr-1" />
              Número de Serie
            </label>
            <input
              type="text"
              id="serialNumber"
              value={formData.serialNumber}
              onChange={(e) => handleInputChange('serialNumber', e.target.value.toUpperCase())}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors font-mono ${
                errors.serialNumber ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Ej: DL5520001"
            />
            {errors.serialNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.serialNumber}</p>
            )}
          </div>

          {/* Biometric Serial Selection */}
          <div>
            <label htmlFor="biometricSerial" className="block text-sm font-medium text-gray-700 mb-2">
              <Fingerprint className="h-4 w-4 inline mr-1" />
              Dispositivo Biométrico (Opcional)
            </label>
            {loadingBiometrics ? (
              <div className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-500">
                Cargando dispositivos...
              </div>
            ) : (
              <select
                id="biometricSerial"
                value={formData.biometricSerial}
                onChange={(e) => handleInputChange('biometricSerial', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
              >
                <option value="">Sin biométrico asignado</option>
                {biometricDevices.map((device) => (
                  <option key={device.id} value={device.serialNumber}>
                    {device.serialNumber}
                  </option>
                ))}
              </select>
            )}
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
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all font-medium shadow-sm hover:shadow-md"
            >
              Agregar Laptop
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
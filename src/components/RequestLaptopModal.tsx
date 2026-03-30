import React, { useState } from 'react';
import { X, Send, AlertTriangle, User, FileText, Laptop as LaptopIcon } from 'lucide-react';
import { Laptop, Lawyer } from '../types';
import { requestService } from '../services/requestService';
import { lawyerService } from '../services/lawyerService';

interface RequestLaptopModalProps {
  availableLaptops: Laptop[];
  initialRequestedLaptopId?: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function RequestLaptopModal({
  availableLaptops,
  initialRequestedLaptopId,
  onClose,
  onSuccess
}: RequestLaptopModalProps) {
  const [formData, setFormData] = useState({
    lawyerName: '',
    applicantName: '',
    reason: '',
    requestedLaptopId: initialRequestedLaptopId || (availableLaptops.length > 0 ? availableLaptops[0].id : '')
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [existingLawyers, setExistingLawyers] = useState<Lawyer[]>([]);

  React.useEffect(() => {
    lawyerService.getAllLawyers().then(setExistingLawyers).catch(console.error);
  }, []);

  // If no laptops are available, render locked state immediately
  if (availableLaptops.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-16 bg-gradient-to-bl from-red-50 to-transparent rounded-full opacity-50 pointer-events-none"></div>
          <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner relative z-10">
            <AlertTriangle className="h-10 w-10" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-3 relative z-10">Sin Equipos Disponibles</h2>
          <p className="text-gray-600 mb-8 relative z-10">
            Actualmente no hay laptops disponibles en este momento. Las solicitudes están temporalmente deshabilitadas hasta que haya inventario nuevo o devuelto.
          </p>
          <button
            onClick={onClose}
            className="w-full py-4 px-6 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl transition-colors relative z-10"
          >
            Entendido, volver
          </button>
        </div>
      </div>
    );
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.lawyerName.trim()) newErrors.lawyerName = 'Selecciona el abogado responsable';
    if (!formData.applicantName.trim()) newErrors.applicantName = 'El nombre de quien usará el equipo es requerido';
    if (!formData.reason.trim()) newErrors.reason = 'El motivo es requerido';
    if (!formData.requestedLaptopId) newErrors.requestedLaptopId = 'Selecciona un equipo';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      await requestService.createRequest({
        lawyerName: formData.lawyerName,
        applicantName: formData.applicantName,
        reason: formData.reason,
        requestedLaptopId: formData.requestedLaptopId
      });
      onSuccess();
    } catch (error) {
      console.error('Error creating request:', error);
      alert('Hubo un error al enviar tu solicitud. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] max-w-lg w-full max-h-[90vh] overflow-y-auto border border-white/50">
        <div className="flex items-center justify-between p-6 border-b border-gray-100/50 bg-white/50 sticky top-0 z-20 backdrop-blur-xl">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg shadow-indigo-500/30">
              <Send className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-900 tracking-tight">Solicitar Laptop</h2>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mt-0.5">Formulario de Control</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-900 rounded-full transition-all">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Laptop Selection */}
          <div className="bg-indigo-50/50 p-5 rounded-2xl border border-indigo-100/50">
            <label htmlFor="requestedLaptopId" className="block text-sm font-bold text-indigo-900 mb-2 flex items-center">
              <LaptopIcon className="h-4 w-4 mr-1.5 text-indigo-600" />
              Equipo a Solicitar (Inventario Disponible)
            </label>
            <div className="relative">
              <select
                id="requestedLaptopId"
                value={formData.requestedLaptopId}
                onChange={(e) => handleInputChange('requestedLaptopId', e.target.value)}
                className={`w-full px-4 py-3.5 bg-white border rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm font-bold text-gray-700 ${errors.requestedLaptopId ? 'border-red-300 ring-1 ring-red-500' : 'border-indigo-100'
                  }`}
              >
                {availableLaptops.map(laptop => (
                  <option key={laptop.id} value={laptop.id}>
                    {laptop.id} - {laptop.brand} {laptop.model}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-indigo-500">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
              </div>
            </div>
            {errors.requestedLaptopId && <p className="mt-1.5 text-xs font-bold text-red-500">{errors.requestedLaptopId}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Lawyer Selection */}
            <div>
              <label htmlFor="lawyerName" className="block text-sm font-bold text-gray-700 mb-2">
                Abogado Solicitante
              </label>
              <select
                id="lawyerName"
                value={formData.lawyerName}
                onChange={(e) => handleInputChange('lawyerName', e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-sm bg-gray-50/50 focus:bg-white ${errors.lawyerName ? 'border-red-300' : 'border-gray-200'
                  }`}
              >
                <option value="">Selecciona abogado...</option>
                {existingLawyers.map(lawyer => (
                  <option key={lawyer.id} value={lawyer.name}>{lawyer.name}</option>
                ))}
              </select>
              {errors.lawyerName && <p className="mt-1.5 text-xs font-bold text-red-500">{errors.lawyerName}</p>}
            </div>

            {/* Applicant Name */}
            <div>
              <label htmlFor="applicantName" className="block text-sm font-bold text-gray-700 mb-2">
                Usuario(Pasante o Asistente)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="applicantName"
                  value={formData.applicantName}
                  onChange={(e) => handleInputChange('applicantName', e.target.value)}
                  placeholder="Ej: Juan Pérez"
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-sm bg-gray-50/50 focus:bg-white ${errors.applicantName ? 'border-red-300' : 'border-gray-200'
                    }`}
                />
              </div>
              {errors.applicantName && <p className="mt-1.5 text-xs font-bold text-red-500">{errors.applicantName}</p>}
            </div>
          </div>

          {/* Reason */}
          <div>
            <label htmlFor="reason" className="block text-sm font-bold text-gray-700 mb-2">
              Motivo de la Solicitud
            </label>
            <div className="relative">
              <div className="absolute top-3.5 left-3.5 pointer-events-none">
                <FileText className="h-4 w-4 text-gray-400" />
              </div>
              <textarea
                id="reason"
                rows={3}
                value={formData.reason}
                onChange={(e) => handleInputChange('reason', e.target.value)}
                placeholder="Ej: Expediente 256,358"
                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-sm resize-none bg-gray-50/50 focus:bg-white ${errors.reason ? 'border-red-300' : 'border-gray-200'
                  }`}
              />
            </div>
            {errors.reason && <p className="mt-1.5 text-xs font-bold text-red-500">{errors.reason}</p>}
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-6 py-3.5 text-gray-600 bg-white border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-xl transition-all font-bold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all font-bold shadow-lg shadow-indigo-500/30 flex items-center justify-center disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Enviando...
                </>
              ) : (
                <>
                  Enviar Solicitud
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

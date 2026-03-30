import React, { useState, useEffect } from 'react';
import { Check, X, Clock, Laptop as LaptopIcon, User, FileText, AlertCircle } from 'lucide-react';
import { Laptop, LaptopRequest, Lawyer, BiometricDevice, Pasante } from '../types';
import { requestService } from '../services/requestService';
import { laptopService } from '../services/laptopService';
import { lawyerService } from '../services/lawyerService';
import { biometricService } from '../services/biometricService';
import { pasanteService } from '../services/pasanteService';
import AssignmentModal from './AssignmentModal';

interface RequestsPanelProps {
  laptops: Laptop[];
  onLaptopsChanged: () => void;
}

export default function RequestsPanel({ laptops, onLaptopsChanged }: RequestsPanelProps) {
  const [requests, setRequests] = useState<LaptopRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Data for Assignment Modal
  const [existingLawyers, setExistingLawyers] = useState<Lawyer[]>([]);
  const [existingBiometrics, setExistingBiometrics] = useState<BiometricDevice[]>([]);
  const [existingPasantes, setExistingPasantes] = useState<Pasante[]>([]);

  // State for Assignment Modal
  const [selectedRequestToApprove, setSelectedRequestToApprove] = useState<LaptopRequest | null>(null);

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      const data = await requestService.getPendingRequests();
      setRequests(data);
    } catch (error) {
      console.error('Error loading requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadFilterData = async () => {
    try {
      const [lawyers, biometrics, pasantes] = await Promise.all([
        lawyerService.getAllLawyers(),
        biometricService.getAllBiometricDevices(),
        pasanteService.getAllPasantes()
      ]);
      setExistingLawyers(lawyers);
      setExistingBiometrics(biometrics);
      setExistingPasantes(pasantes);
    } catch (error) {
      console.error('Error loading filter data:', error);
    }
  };

  useEffect(() => {
    fetchRequests();
    loadFilterData();
  }, []);

  const handleReject = async (requestId: string) => {
    if (!window.confirm('¿Seguro que deseas rechazar esta solicitud?')) return;
    try {
      await requestService.updateRequestStatus(requestId, 'rechazada');
      setRequests(reqs => reqs.filter(r => r.id !== requestId));
    } catch (error) {
      console.error('Error rejecting request:', error);
      alert('Error al rechazar la solicitud.');
    }
  };

  const handleApproveAction = async (laptopId: string, userName: string, biometricSerial?: string, internName?: string) => {
    if (!selectedRequestToApprove) return;
    
    try {
      // 1. Assign laptop
      await laptopService.assignLaptop(laptopId, userName, biometricSerial, internName);
      
      // 2. Mark request as approved
      await requestService.updateRequestStatus(selectedRequestToApprove.id, 'aprobada');
      
      // 3. Cleanup and refresh
      setSelectedRequestToApprove(null);
      setRequests(reqs => reqs.filter(r => r.id !== selectedRequestToApprove.id));
      onLaptopsChanged(); // Refreshes laptops in AdminView
      
      alert('¡Solicitud aprobada y laptop asignada exitosamente!');
    } catch (error) {
      console.error('Error assigning laptop from request:', error);
      alert('Hubo un error al asignar el equipo desde la solicitud.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <Clock className="w-6 h-6 mr-2 text-indigo-500" />
          Solicitudes Pendientes
        </h2>
      </div>

      {requests.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8 text-emerald-500" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">Todo al día</h3>
          <p className="text-gray-500">No hay solicitudes de equipo pendientes de revisión.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {requests.map(request => {
            // Find the associated laptop from inventory
            const targetLaptop = laptops.find(l => l.id === request.requestedLaptopId);
            const isAvailable = targetLaptop?.status === 'disponible';

            return (
              <div key={request.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden group hover:shadow-md transition-all">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    {/* Focus on Applicant */}
                    <div className="flex-1 space-y-4">
                      
                      <div className="flex items-start">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex flex-col items-center justify-center mr-4 shrink-0 border border-indigo-100/50">
                          <User className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-1.5 flex items-center">
                            Solicita: {request.lawyerName}
                          </p>
                          <h3 className="text-xl font-black text-gray-900 leading-none mb-1">
                            {request.applicantName}
                          </h3>
                        </div>
                      </div>

                      <div className="pl-14">
                        <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100 inline-block max-w-2xl">
                          <div className="flex items-start">
                            <FileText className="h-4 w-4 text-gray-400 mt-0.5 mr-2 shrink-0" />
                            <p className="text-sm text-gray-700 leading-relaxed font-medium">
                              "{request.reason}"
                            </p>
                          </div>
                        </div>
                        <p className="text-[11px] font-bold text-gray-400 mt-2 uppercase tracking-wide">
                          Recibida el {new Date(request.createdAt).toLocaleString('es-ES', { day: 'numeric', month: 'short', hour:'2-digit', minute:'2-digit' })}
                        </p>
                      </div>

                    </div>

                    {/* Focus on Target Equipment */}
                    <div className="w-full md:w-72 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6 flex flex-col justify-center">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Equipo Deseado</p>
                      {targetLaptop ? (
                        <div className="bg-white border rounded-xl p-3 mb-4 shadow-sm border-gray-200">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <LaptopIcon className="w-4 h-4 text-gray-400 mr-2" />
                              <span className="font-black text-gray-900">{targetLaptop.id}</span>
                            </div>
                            {isAvailable ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                                DISPONIBLE
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-50 text-orange-600 border border-orange-100">
                                OCUPADO
                              </span>
                            )}
                          </div>
                          <p className="text-xs font-medium text-gray-500">{targetLaptop.brand} {targetLaptop.model}</p>
                        </div>
                      ) : (
                        <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-xs font-bold flex items-center border border-red-100">
                          <AlertCircle className="w-4 h-4 mr-2" /> Equipo no encontrado en BD
                        </div>
                      )}

                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleReject(request.id)}
                          className="flex-1 py-2.5 px-3 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-sm rounded-xl transition-colors border border-red-100 flex items-center justify-center"
                        >
                          <X className="w-4 h-4 mr-1.5" /> Rechazar
                        </button>
                        <button
                          onClick={() => setSelectedRequestToApprove(request)}
                          disabled={!targetLaptop || !isAvailable}
                          title={!isAvailable ? 'El equipo ya fue asignado a otro usuario y no está disponible.' : ''}
                          className="flex-1 py-2.5 px-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm rounded-xl transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                          <Check className="w-4 h-4 mr-1.5" /> Aprobar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Assignment Modal integration when Approving */}
      {selectedRequestToApprove && (
        (() => {
          const targetLaptop = laptops.find(l => l.id === selectedRequestToApprove.requestedLaptopId);
          if (!targetLaptop) return null; // Defensive check
          
          return (
            <AssignmentModal
              laptop={targetLaptop}
              isReturning={false}
              existingLawyers={existingLawyers}
              existingBiometrics={existingBiometrics}
              existingPasantes={existingPasantes}
              initialSelectedUser={selectedRequestToApprove.lawyerName}
              initialInternName={selectedRequestToApprove.applicantName}
              onClose={() => setSelectedRequestToApprove(null)}
              // MOCK functions for return (won't be called since isReturning=false)
              onReturn={() => {}}
              onAssign={handleApproveAction}
            />
          );
        })()
      )}
    </div>
  );
}

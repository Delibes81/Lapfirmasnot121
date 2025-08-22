import React from 'react';
import { Laptop, Edit3, User, Fingerprint, CheckCircle, Clock, Settings } from 'lucide-react';
import { Laptop as LaptopType } from '../types';

interface LaptopCardProps {
  laptop: LaptopType;
  onEdit?: (laptop: LaptopType) => void;
  onAssign?: (laptop: LaptopType) => void;
  onReturn?: (laptop: LaptopType) => void;
  showEditButton?: boolean;
  showAssignButton?: boolean;
}

export default function LaptopCard({ 
  laptop, 
  onEdit, 
  onAssign, 
  onReturn, 
  showEditButton = false, 
  showAssignButton = false 
}: LaptopCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'disponible':
        return 'from-emerald-500 via-green-600 to-teal-600';
      case 'en-uso':
        return 'from-orange-500 via-red-600 to-pink-600';
      case 'mantenimiento':
        return 'from-gray-500 via-slate-600 to-zinc-600';
      default:
        return 'from-blue-500 via-indigo-600 to-purple-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'disponible':
        return <CheckCircle className="h-4 w-4" />;
      case 'en-uso':
        return <Clock className="h-4 w-4" />;
      case 'mantenimiento':
        return <Settings className="h-4 w-4" />;
      default:
        return <Laptop className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'disponible':
        return 'Disponible';
      case 'en-uso':
        return 'En Uso';
      case 'mantenimiento':
        return 'Mantenimiento';
      default:
        return status;
    }
  };

  return (
    <div className="group bg-white/80 backdrop-blur-md rounded-3xl shadow-lg border border-gray-200/50 p-6 hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative flex items-start justify-between mb-6">
        <div className="flex items-center">
          <div className={`w-14 h-14 bg-gradient-to-br ${getStatusColor(laptop.status)} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
            <Laptop className="h-7 w-7 text-white" />
          </div>
          <div className="ml-4">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-700 transition-colors duration-300">{laptop.id}</h3>
            <p className="text-sm text-gray-600 font-medium">{laptop.brand} {laptop.model}</p>
          </div>
        </div>
        
        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
          {showEditButton && onEdit && (
            <button
              onClick={() => onEdit(laptop)}
              className="p-2 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl hover:bg-indigo-50 hover:text-indigo-600 text-gray-600"
              title="Editar laptop"
            >
              <Edit3 className="h-4 w-4" />
            </button>
          )}
          
          {showAssignButton && laptop.status === 'disponible' && onAssign && (
            <button
              onClick={() => onAssign(laptop)}
              className="p-2 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl hover:bg-emerald-50 hover:text-emerald-600 text-gray-600"
              title="Asignar laptop"
            >
              <User className="h-4 w-4" />
            </button>
          )}
          
          {showAssignButton && laptop.status === 'en-uso' && onReturn && (
            <button
              onClick={() => onReturn(laptop)}
              className="p-2 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl hover:bg-orange-50 hover:text-orange-600 text-gray-600"
              title="Devolver laptop"
            >
              <CheckCircle className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Status Badge */}
      <div className="relative mb-4">
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
          laptop.status === 'disponible' 
            ? 'bg-emerald-100 text-emerald-800' 
            : laptop.status === 'en-uso'
            ? 'bg-orange-100 text-orange-800'
            : 'bg-gray-100 text-gray-800'
        }`}>
          {getStatusIcon(laptop.status)}
          <span className="ml-1">{getStatusText(laptop.status)}</span>
        </div>
      </div>

      <div className="relative space-y-3 mb-6">
        <div className="flex items-center justify-between text-sm bg-gray-50/80 rounded-xl p-3">
          <span className="text-gray-500 font-medium">S/N:</span>
          <span className="font-mono text-gray-800 font-semibold">{laptop.serialNumber}</span>
        </div>
        
        {laptop.currentUser && (
          <div className="flex items-center justify-between text-sm bg-blue-50/80 rounded-xl p-3">
            <span className="text-blue-500 font-medium flex items-center">
              <User className="h-4 w-4 mr-1" />
              Usuario:
            </span>
            <span className="text-blue-800 font-semibold">{laptop.currentUser}</span>
          </div>
        )}
        
        {laptop.biometricSerial && (
          <div className="flex items-center justify-between text-sm bg-purple-50/80 rounded-xl p-3">
            <span className="text-purple-500 font-medium flex items-center">
              <Fingerprint className="h-4 w-4 mr-1" />
              Biométrico:
            </span>
            <span className="font-mono text-purple-800 font-semibold">{laptop.biometricSerial}</span>
          </div>
        )}
        
        {laptop.assignedAt && (
          <div className="text-xs text-gray-500 text-center">
            Asignado: {new Date(laptop.assignedAt).toLocaleDateString('es-ES')}
          </div>
        )}
      </div>
    </div>
  );
}
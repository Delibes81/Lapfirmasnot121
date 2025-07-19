import React from 'react';
import { Laptop, User, Settings, ArrowRight, RotateCcw, Fingerprint } from 'lucide-react';
import { Laptop as LaptopType, LaptopStatus } from '../types';

interface LaptopCardProps {
  laptop: LaptopType;
  onAssign: () => void;
  onReturn: () => void;
  onStatusChange: (laptopId: string, status: LaptopStatus) => void;
}

const statusConfig = {
  'disponible': {
    color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    dotColor: 'bg-emerald-500',
    label: 'Disponible'
  },
  'en-uso': {
    color: 'bg-amber-100 text-amber-800 border-amber-200',
    dotColor: 'bg-amber-500',
    label: 'En Uso'
  },
  'mantenimiento': {
    color: 'bg-red-100 text-red-800 border-red-200',
    dotColor: 'bg-red-500',
    label: 'Mantenimiento'
  }
};

export default function LaptopCard({ laptop, onAssign, onReturn, onStatusChange }: LaptopCardProps) {
  const config = statusConfig[laptop.status];

  return (
    <div className="group bg-white/80 backdrop-blur-md rounded-3xl shadow-lg border border-gray-200/50 p-6 hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative flex items-start justify-between mb-6">
        <div className="flex items-center">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
            <Laptop className="h-7 w-7 text-white" />
          </div>
          <div className="ml-4">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-700 transition-colors duration-300">{laptop.id}</h3>
            <p className="text-sm text-gray-600 font-medium">{laptop.brand} {laptop.model}</p>
          </div>
        </div>
        
        <span className={`inline-flex items-center px-4 py-2 rounded-2xl text-sm font-bold border ${config.color} shadow-md`}>
          <div className={`w-3 h-3 ${config.dotColor} rounded-full mr-3 animate-pulse`}></div>
          {config.label}
        </span>
      </div>

      <div className="relative space-y-3 mb-6">
        <div className="flex items-center justify-between text-sm bg-gray-50/80 rounded-xl p-3">
          <span className="text-gray-500 font-medium">S/N:</span>
          <span className="font-mono text-gray-800 font-semibold">{laptop.serialNumber}</span>
        </div>
        
        <div className="flex items-center justify-between text-sm bg-gray-50/80 rounded-xl p-3">
          <span className="text-gray-500 font-medium">Biométrico:</span>
          <div className="flex items-center space-x-2">
            <Fingerprint className={`h-5 w-5 ${laptop.biometricReader ? 'text-emerald-600' : 'text-gray-400'}`} />
            <span className={`font-semibold ${laptop.biometricReader ? 'text-emerald-600' : 'text-gray-400'}`}>
              {laptop.biometricReader ? 'Sí' : 'No'}
            </span>
          </div>
        </div>
        
        {laptop.biometricReader && laptop.biometricSerial && (
          <div className="flex items-center justify-between text-sm bg-emerald-50/80 rounded-xl p-3">
            <span className="text-emerald-600 font-medium">S/N Biométrico:</span>
            <span className="font-mono text-emerald-800 font-semibold">{laptop.biometricSerial}</span>
          </div>
        )}
        
        {laptop.currentUser && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3 border border-blue-100">
            <div className="flex items-center text-sm">
              <User className="h-4 w-4 mr-2 text-blue-600" />
              <span className="text-blue-600 font-semibold">Asignado a:</span>
              <span className="ml-2 text-blue-900 font-bold">{laptop.currentUser}</span>
            </div>
          </div>
        )}
      </div>

      <div className="relative space-y-3">
        {laptop.status === 'disponible' && (
          <button
            onClick={onAssign}
            className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <User className="h-5 w-5 mr-2" />
            Asignar
            <ArrowRight className="h-5 w-5 ml-2" />
          </button>
        )}

        {laptop.status === 'en-uso' && (
          <button
            onClick={onReturn}
            className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white text-sm font-bold rounded-2xl hover:from-emerald-700 hover:to-green-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <RotateCcw className="h-5 w-5 mr-2" />
            Devolver
          </button>
        )}

        <div className="flex space-x-3">
          <select
            value={laptop.status}
            onChange={(e) => onStatusChange(laptop.id, e.target.value as LaptopStatus)}
            className="flex-1 text-sm border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm font-medium"
          >
            <option value="disponible">Disponible</option>
            <option value="en-uso">En Uso</option>
            <option value="mantenimiento">Mantenimiento</option>
          </select>
          <button
            onClick={() => onStatusChange(laptop.id, 'mantenimiento')}
            className="px-4 py-3 text-gray-600 hover:text-gray-900 transition-all rounded-xl hover:bg-gray-100 shadow-sm hover:shadow-md"
            title="Enviar a mantenimiento"
          >
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
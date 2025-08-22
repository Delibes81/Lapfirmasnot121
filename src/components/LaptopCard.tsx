import React from 'react';
import { Laptop, Edit3, Fingerprint } from 'lucide-react';
import { Laptop as LaptopType } from '../types';

interface LaptopCardProps {
  laptop: LaptopType;
  onEdit?: (laptop: LaptopType) => void;
  showEditButton?: boolean;
}

export default function LaptopCard({ laptop, onEdit, showEditButton = false }: LaptopCardProps) {
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
        
        {showEditButton && onEdit && (
          <button
            onClick={() => onEdit(laptop)}
            className="opacity-0 group-hover:opacity-100 transition-all duration-300 p-2 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl hover:bg-indigo-50 hover:text-indigo-600 text-gray-600"
            title="Editar laptop"
          >
            <Edit3 className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="relative space-y-3 mb-6">
        <div className="flex items-center justify-between text-sm bg-gray-50/80 rounded-xl p-3">
          <span className="text-gray-500 font-medium">S/N:</span>
          <span className="font-mono text-gray-800 font-semibold">{laptop.serialNumber}</span>
        </div>
        
        {laptop.biometricSerial && (
          <div className="flex items-center justify-between text-sm bg-purple-50/80 rounded-xl p-3">
            <span className="text-purple-600 font-medium flex items-center">
              <Fingerprint className="h-3 w-3 mr-1" />
              Biométrico:
            </span>
            <span className="font-mono text-purple-800 font-semibold">{laptop.biometricSerial}</span>
          </div>
        )}
      </div>
    </div>
  );
}
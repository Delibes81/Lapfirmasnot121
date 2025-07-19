import React from 'react';
import { Laptop, Fingerprint, CheckCircle, Clock, AlertTriangle, Grid3X3, List, BarChart3 } from 'lucide-react';
import { Laptop as LaptopType } from '../types';

interface PublicViewProps {
  laptops: LaptopType[];
}

type PublicViewMode = 'grid' | 'list' | 'stats';

const statusConfig = {
  'disponible': {
    icon: CheckCircle,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    label: 'Disponible'
  },
  'en-uso': {
    icon: Clock,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    label: 'En Uso'
  },
  'mantenimiento': {
    icon: AlertTriangle,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    label: 'Mantenimiento'
  }
};

export default function PublicView({ laptops }: PublicViewProps) {
  const [viewMode, setViewMode] = React.useState<PublicViewMode>('grid');
  
  const availableCount = laptops.filter(l => l.status === 'disponible').length;
  const inUseCount = laptops.filter(l => l.status === 'en-uso').length;
  const maintenanceCount = laptops.filter(l => l.status === 'mantenimiento').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* View Mode Selector */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-sm mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Estado de Laptops</h2>
            <p className="text-gray-600 mt-1">Consulta en tiempo real del inventario</p>
          </div>
          
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === 'grid'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Grid3X3 className="h-4 w-4 mr-2" />
              Tarjetas
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === 'list'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <List className="h-4 w-4 mr-2" />
              Lista
            </button>
            <button
              onClick={() => setViewMode('stats')}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === 'stats'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Estadísticas
            </button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      {(viewMode === 'grid' || viewMode === 'stats') && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-emerald-200/50 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-600">Disponibles</p>
                <p className="text-3xl font-bold text-emerald-700">{availableCount}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-amber-200/50 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-600">En Uso</p>
                <p className="text-3xl font-bold text-amber-700">{inUseCount}</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-red-200/50 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Mantenimiento</p>
                <p className="text-3xl font-bold text-red-700">{maintenanceCount}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Only View */}
      {viewMode === 'stats' && (
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Resumen Detallado</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Por Estado</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-emerald-600 mr-3" />
                    <span className="font-medium text-emerald-800">Disponibles</span>
                  </div>
                  <span className="text-2xl font-bold text-emerald-700">{availableCount}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-amber-50 rounded-xl">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-amber-600 mr-3" />
                    <span className="font-medium text-amber-800">En Uso</span>
                  </div>
                  <span className="text-2xl font-bold text-amber-700">{inUseCount}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl">
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-red-600 mr-3" />
                    <span className="font-medium text-red-800">Mantenimiento</span>
                  </div>
                  <span className="text-2xl font-bold text-red-700">{maintenanceCount}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Características</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                  <div className="flex items-center">
                    <Fingerprint className="h-5 w-5 text-blue-600 mr-3" />
                    <span className="font-medium text-blue-800">Con Biométrico</span>
                  </div>
                  <span className="text-2xl font-bold text-blue-700">
                    {laptops.filter(l => l.biometricReader).length}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center">
                    <Laptop className="h-5 w-5 text-gray-600 mr-3" />
                    <span className="font-medium text-gray-800">Total Equipos</span>
                  </div>
                  <span className="text-2xl font-bold text-gray-700">{laptops.length}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl">
                  <div className="flex items-center">
                    <BarChart3 className="h-5 w-5 text-purple-600 mr-3" />
                    <span className="font-medium text-purple-800">Utilización</span>
                  </div>
                  <span className="text-2xl font-bold text-purple-700">
                    {Math.round((inUseCount / laptops.length) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {laptops.map((laptop) => {
            const config = statusConfig[laptop.status];
            const StatusIcon = config.icon;

            return (
              <div
                key={laptop.id}
                className={`group bg-white/80 backdrop-blur-md rounded-3xl p-6 border ${config.borderColor} shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 relative overflow-hidden`}
              >
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Header */}
                <div className="relative flex items-center justify-between mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                    <Laptop className="h-7 w-7 text-white" />
                  </div>
                  <div className={`p-3 rounded-2xl ${config.bgColor} shadow-md group-hover:shadow-lg transition-all duration-300`}>
                    <StatusIcon className={`h-5 w-5 ${config.color}`} />
                  </div>
                </div>

                {/* Laptop Info */}
                <div className="relative space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-700 transition-colors duration-300">{laptop.id}</h3>
                    <p className="text-sm text-gray-600 font-medium">{laptop.brand} {laptop.model}</p>
                  </div>

                  <div className="space-y-3">
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
                  </div>

                  {/* Status Badge */}
                  <div className={`inline-flex items-center px-4 py-2 rounded-2xl text-sm font-bold ${config.bgColor} ${config.color} border ${config.borderColor} shadow-md`}>
                    <div className={`w-3 h-3 rounded-full mr-3 ${config.color.replace('text-', 'bg-')} animate-pulse`}></div>
                    {config.label}
                  </div>

                  {/* Current User */}
                  {laptop.currentUser && (
                    <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                      <p className="text-xs text-blue-600 font-semibold mb-1 uppercase tracking-wide">Asignado a:</p>
                      <p className="text-sm font-bold text-blue-900">{laptop.currentUser}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-emerald-200/50 shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Equipo</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Marca/Modelo</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Número de Serie</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Biométrico</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">S/N Biométrico</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Estado</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Usuario</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {laptops.map((laptop) => {
                  const config = statusConfig[laptop.status];
                  const StatusIcon = config.icon;
                  
                  return (
                    <tr key={laptop.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-3">
                            <Laptop className="h-5 w-5 text-white" />
                          </div>
                          <span className="font-bold text-gray-900">{laptop.id}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <div className="font-medium text-gray-900">{laptop.brand}</div>
                          <div className="text-sm text-gray-500">{laptop.model}</div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-mono text-sm text-gray-800">{laptop.serialNumber}</span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <Fingerprint className={`h-5 w-5 mr-2 ${laptop.biometricReader ? 'text-emerald-600' : 'text-gray-400'}`} />
                          <span className={`font-medium ${laptop.biometricReader ? 'text-emerald-600' : 'text-gray-400'}`}>
                            {laptop.biometricReader ? 'Sí' : 'No'}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {laptop.biometricSerial ? (
                          <span className="font-mono text-sm text-emerald-800 bg-emerald-50 px-2 py-1 rounded">{laptop.biometricSerial}</span>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.bgColor} ${config.color}`}>
                          <StatusIcon className="h-4 w-4 mr-2" />
                          {config.label}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {laptop.currentUser ? (
                          <span className="text-sm font-medium text-blue-900">{laptop.currentUser}</span>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div className="mt-12 text-center">
        <p className="text-sm text-gray-500">
          Última actualización: {new Date().toLocaleString('es-ES')}
        </p>
      </div>
    </div>
  );
}
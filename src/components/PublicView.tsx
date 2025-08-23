import React from 'react';
import { Laptop, Grid3X3, List, BarChart3, User, Fingerprint, CheckCircle, Clock, Settings } from 'lucide-react';
import { Laptop as LaptopType } from '../types';

interface PublicViewProps {
  laptops: LaptopType[];
}

type PublicViewMode = 'grid' | 'list' | 'stats';

export default function PublicView({ laptops }: PublicViewProps) {
  const [viewMode, setViewMode] = React.useState<PublicViewMode>('grid');
  
  const totalCount = laptops.length;
  const availableCount = laptops.filter(l => l.status === 'disponible').length;
  const inUseCount = laptops.filter(l => l.status === 'en-uso').length;
  const maintenanceCount = laptops.filter(l => l.status === 'mantenimiento').length;

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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-blue-200/50 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Laptops</p>
                <p className="text-3xl font-bold text-blue-700">{totalCount}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Laptop className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

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

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-orange-200/50 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">En Uso</p>
                <p className="text-3xl font-bold text-orange-700">{inUseCount}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Mantenimiento</p>
                <p className="text-3xl font-bold text-gray-700">{maintenanceCount}</p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <Settings className="h-6 w-6 text-gray-600" />
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
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Inventario</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                  <div className="flex items-center">
                    <Laptop className="h-5 w-5 text-blue-600 mr-3" />
                    <span className="font-medium text-blue-800">Total Equipos</span>
                  </div>
                  <span className="text-2xl font-bold text-blue-700">{totalCount}</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-emerald-600 mr-3" />
                    <span className="font-medium text-emerald-800">Disponibles</span>
                  </div>
                  <span className="text-2xl font-bold text-emerald-700">{availableCount}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-orange-50 rounded-xl">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-orange-600 mr-3" />
                    <span className="font-medium text-orange-800">En Uso</span>
                  </div>
                  <span className="text-2xl font-bold text-orange-700">{inUseCount}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center">
                    <Settings className="h-5 w-5 text-gray-600 mr-3" />
                    <span className="font-medium text-gray-800">Mantenimiento</span>
                  </div>
                  <span className="text-2xl font-bold text-gray-700">{maintenanceCount}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Por Marca</h4>
              <div className="space-y-4">
                {Array.from(new Set(laptops.map(l => l.brand))).map(brand => (
                  <div key={brand} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center">
                      <Laptop className="h-5 w-5 text-gray-600 mr-3" />
                      <span className="font-medium text-gray-800">{brand}</span>
                    </div>
                    <span className="text-2xl font-bold text-gray-700">
                      {laptops.filter(l => l.brand === brand).length}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
          {laptops.map((laptop) => {
            return (
              <div
                key={laptop.id}
                className="group bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 relative overflow-hidden flex flex-col"
              >
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Header */}
                <div className="relative flex items-center justify-center mb-4">
                  <div className={`w-14 h-14 bg-gradient-to-br ${getStatusColor(laptop.status)} rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                    <Laptop className="h-7 w-7 text-white" />
                  </div>
                </div>

                {/* Status Badge */}
                <div className="relative mb-4 flex justify-center">
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

                {/* Laptop Info */}
                <div className="relative space-y-3 flex-1 flex flex-col">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-700 transition-colors duration-300 text-center">{laptop.id}</h3>
                    <p className="text-sm text-gray-600 font-medium text-center">{laptop.brand} {laptop.model}</p>
                  </div>

                  <div className="space-y-2 flex-1">
                    <div className="bg-gray-50/80 rounded-lg p-2">
                      <span className="text-gray-500 font-medium">S/N:</span>
                      <div className="font-mono text-gray-800 font-semibold text-sm text-center mt-1">{laptop.serialNumber}</div>
                    </div>
                  
                    {laptop.currentUser && (
                      <div className="bg-blue-50/80 rounded-lg p-2">
                        <div className="text-blue-500 font-medium flex items-center justify-center text-sm">
                          <User className="h-3 w-3 mr-1" />
                          Usuario:
                        </div>
                        <div className="text-blue-800 font-semibold text-center text-sm mt-1">{laptop.currentUser}</div>
                      </div>
                    )}
                  
                    {laptop.biometricSerial && (
                      <div className="bg-purple-50/80 rounded-lg p-2">
                        <div className="text-purple-500 font-medium flex items-center justify-center text-sm">
                          <Fingerprint className="h-3 w-3 mr-1" />
                          Biométrico:
                        </div>
                        <div className="font-mono text-purple-800 font-semibold text-sm text-center mt-1">{laptop.biometricSerial}</div>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-auto">
                    {laptop.assignedAt && (
                      <div className="text-sm text-gray-500 text-center">
                        Asignado: {new Date(laptop.assignedAt).toLocaleDateString('es-ES')}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Equipo</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Estado</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Marca</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Modelo</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Número de Serie</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Usuario</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Biométrico</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {laptops.map((laptop) => {
                  return (
                    <tr key={laptop.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <div className={`w-10 h-10 bg-gradient-to-br ${getStatusColor(laptop.status)} rounded-xl flex items-center justify-center mr-3`}>
                            <Laptop className="h-5 w-5 text-white" />
                          </div>
                          <span className="font-bold text-gray-900">{laptop.id}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          laptop.status === 'disponible' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : laptop.status === 'en-uso'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {getStatusIcon(laptop.status)}
                          <span className="ml-1">{getStatusText(laptop.status)}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <span className="font-medium text-gray-900">{laptop.brand}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-medium text-gray-900">{laptop.model}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-mono text-sm text-gray-800">{laptop.serialNumber}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm text-gray-900">
                          {laptop.currentUser || '-'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-mono text-sm text-gray-800">
                          {laptop.biometricSerial || '-'}
                        </span>
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
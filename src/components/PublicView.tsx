import React from 'react';
import { Laptop, Grid3X3, List, BarChart3, User, Fingerprint, CheckCircle, Clock, Settings, Search, Send } from 'lucide-react';
import { Laptop as LaptopType } from '../types';
import RequestLaptopModal from './RequestLaptopModal';

interface PublicViewProps {
  laptops: LaptopType[];
}

type PublicViewMode = 'grid' | 'list' | 'stats';

export default function PublicView({ laptops }: PublicViewProps) {
  const [viewMode, setViewMode] = React.useState<PublicViewMode>('grid');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [showRequestModal, setShowRequestModal] = React.useState(false);
  const [initialRequestedLaptopId, setInitialRequestedLaptopId] = React.useState<string | undefined>();

  const visibleLaptops = laptops.filter(laptop => laptop.isPublic !== false);

  const statusOrder: Record<string, number> = {
    'en-uso': 1,
    'disponible': 2,
    'mantenimiento': 3
  };

  const filteredLaptops = visibleLaptops
    .filter(laptop =>
      laptop.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      laptop.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      laptop.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      laptop.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (laptop.currentUser && laptop.currentUser.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (laptop.assignedIntern && laptop.assignedIntern.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      const orderA = statusOrder[a.status] || 99;
      const orderB = statusOrder[b.status] || 99;
      if (orderA === orderB) {
        // If same status, order alphabetically by ID as secondary sort
        return a.id.localeCompare(b.id);
      }
      return orderA - orderB;
    });

  const totalCount = visibleLaptops.length;
  const strictlyAvailableLaptops = visibleLaptops.filter(l => l.status === 'disponible');
  const availableCount = strictlyAvailableLaptops.length;
  const inUseCount = visibleLaptops.filter(l => l.status === 'en-uso').length;
  const maintenanceCount = visibleLaptops.filter(l => l.status === 'mantenimiento').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'disponible':
        return 'from-emerald-400 to-emerald-600 shadow-emerald-500/30';
      case 'en-uso':
        return 'from-amber-400 to-orange-500 shadow-orange-500/30';
      case 'mantenimiento':
        return 'from-slate-500 to-slate-700 shadow-slate-500/30';
      default:
        return 'from-blue-500 to-indigo-600 shadow-blue-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'disponible':
        return <CheckCircle className="h-3 w-3" />;
      case 'en-uso':
        return <Clock className="h-3 w-3" />;
      case 'mantenimiento':
        return <Settings className="h-3 w-3" />;
      default:
        return <Laptop className="h-3 w-3" />;
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

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'disponible':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100 ring-emerald-500/20';
      case 'en-uso':
        return 'bg-orange-50 text-orange-700 border-orange-100 ring-orange-500/20';
      case 'mantenimiento':
        return 'bg-slate-50 text-slate-700 border-slate-200 ring-slate-500/20';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200 ring-gray-500/20';
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4 animate-in fade-in duration-500">

      {/* Search and View Toggles Header */}
      <div className="mb-6 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80 group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400 group-focus-within:text-notaria-600 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Buscar equipo, usuario..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl leading-5 bg-white/70 backdrop-blur-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-notaria-500/50 focus:border-notaria-500 focus:bg-white transition-all duration-300 text-sm"
          />
        </div>

        <div className="flex bg-white/60 backdrop-blur-xl p-1 rounded-xl shadow-sm border border-gray-200/50 w-full md:w-auto">
          {[
            { id: 'grid', icon: Grid3X3, label: 'Tarjetas' },
            { id: 'list', icon: List, label: 'Lista' },
            { id: 'stats', icon: BarChart3, label: 'Panel' }
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => setViewMode(mode.id as PublicViewMode)}
              className={`flex-1 md:flex-none flex items-center justify-center px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${viewMode === mode.id
                  ? 'bg-white text-notaria-700 shadow-sm ring-1 ring-gray-200/50 scale-100 text-xs'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-white/40 scale-95 hover:scale-100 text-xs'
                }`}
            >
              <mode.icon className={`h-4 w-4 ${viewMode === mode.id ? 'mr-1.5' : ''}`} />
              <span className={viewMode === mode.id ? 'block' : 'hidden md:block md:ml-1.5'}>{mode.label}</span>
            </button>
          ))}
        </div>

        <button 
          onClick={() => {
            setInitialRequestedLaptopId(undefined);
            setShowRequestModal(true);
          }}
          className="w-full md:w-auto bg-gradient-to-r from-notaria-600 to-indigo-600 hover:from-notaria-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-notaria-500/20 transition-all flex items-center justify-center shrink-0"
        >
          <Send className="w-4 h-4 mr-2" />
          Solicitar Equipo
        </button>
      </div>

      {/* Bento Grid Stats Overview */}
      {(viewMode === 'grid' || viewMode === 'stats') && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
          {/* Total */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 border border-white shadow-md shadow-gray-200/40 relative overflow-hidden group hover:-translate-y-0.5 transition-transform duration-300">
            <div className="absolute -right-4 -top-4 w-16 h-16 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-full blur-xl group-hover:bg-blue-100 transition-colors"></div>
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-blue-500/30 mb-2">
                <Laptop className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-0.5">Total Equipos</p>
                <p className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-gray-900 to-gray-700 leading-tight">{totalCount}</p>
              </div>
            </div>
          </div>

          {/* Available */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 border border-white shadow-md shadow-emerald-200/30 relative overflow-hidden group hover:-translate-y-0.5 transition-transform duration-300">
            <div className="absolute -right-4 -top-4 w-16 h-16 bg-gradient-to-br from-emerald-50 to-teal-100 rounded-full blur-xl group-hover:bg-emerald-100 transition-colors"></div>
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-md shadow-emerald-500/30 mb-2 text-white">
                <CheckCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-0.5">Disponibles</p>
                <p className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-gray-900 to-gray-700 leading-tight">{availableCount}</p>
              </div>
            </div>
          </div>

          {/* In Use */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 border border-white shadow-md shadow-orange-200/30 relative overflow-hidden group hover:-translate-y-0.5 transition-transform duration-300">
            <div className="absolute -right-4 -top-4 w-16 h-16 bg-gradient-to-br from-orange-50 to-amber-100 rounded-full blur-xl group-hover:bg-orange-100 transition-colors"></div>
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-md shadow-orange-500/30 mb-2 text-white">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-0.5">En Uso</p>
                <p className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-gray-900 to-gray-700 leading-tight">{inUseCount}</p>
              </div>
            </div>
          </div>

          {/* Maintenance */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 border border-white shadow-md shadow-slate-200/40 relative overflow-hidden group hover:-translate-y-0.5 transition-transform duration-300">
            <div className="absolute -right-4 -top-4 w-16 h-16 bg-gradient-to-br from-slate-100 to-gray-200 rounded-full blur-xl group-hover:bg-slate-200 transition-colors"></div>
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="w-10 h-10 bg-gradient-to-br from-slate-500 to-slate-700 rounded-xl flex items-center justify-center shadow-md shadow-slate-500/30 mb-2 text-white">
                <Settings className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-0.5">Mantenimiento</p>
                <p className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-gray-900 to-gray-700 leading-tight">{maintenanceCount}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Detail View */}
      {viewMode === 'stats' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white shadow-lg shadow-gray-200/40">
            <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center">
              <BarChart3 className="w-5 h-5 mr-3 text-notaria-600" />
              Distribución por Marca
            </h3>
            <div className="space-y-4">
              {Array.from(new Set(visibleLaptops.map(l => l.brand))).map((brand) => {
                const count = visibleLaptops.filter(l => l.brand === brand).length;
                const percentage = Math.round((count / totalCount) * 100);
                return (
                  <div key={brand} className="group">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-sm font-semibold text-gray-700">{brand}</span>
                      <span className="text-xs font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded-full">{count} equipos</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-notaria-400 to-notaria-600 rounded-full transition-all duration-1000 ease-out group-hover:brightness-110"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white shadow-lg shadow-gray-200/40 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-24 bg-gradient-to-bl from-notaria-50 to-transparent rounded-full opacity-50 pointer-events-none"></div>
            <h3 className="text-lg font-bold text-gray-900 mb-5 relative z-10">Estado del Inventario</h3>
            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between p-4 bg-gradient-to-br from-white to-emerald-50/50 rounded-xl border border-emerald-100/50 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Operativos y Disponibles</p>
                    <p className="text-xs text-gray-500">Listos para asignación</p>
                  </div>
                </div>
                <span className="text-2xl font-black text-emerald-600">{availableCount}</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-br from-white to-orange-50/50 rounded-xl border border-orange-100/50 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Asignados</p>
                    <p className="text-xs text-gray-500">Actualmente en uso</p>
                  </div>
                </div>
                <span className="text-2xl font-black text-orange-600">{inUseCount}</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-br from-white to-slate-50/50 rounded-xl border border-slate-100/50 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
                    <Settings className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">En Mantenimiento</p>
                    <p className="text-xs text-gray-500">Requieren revisión</p>
                  </div>
                </div>
                <span className="text-2xl font-black text-slate-600">{maintenanceCount}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid gap-4 animate-in slide-in-from-bottom-8 duration-700" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
          {filteredLaptops.length === 0 ? (
            <div className="col-span-full py-10 text-center text-gray-500 bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200 border-dashed">
              <Search className="h-10 w-10 mx-auto mb-3 text-gray-300" />
              <p className="text-sm">No se encontraron equipos que coincidan con la búsqueda.</p>
            </div>
          ) : (
            filteredLaptops.map((laptop) => (
              <div
                key={laptop.id}
                className="group bg-white/80 backdrop-blur-xl rounded-2xl p-1 border border-white shadow-[0_4px_15px_rgb(0,0,0,0.03)] hover:shadow-[0_10px_25px_rgb(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 relative"
              >
                <div className="bg-gradient-to-b from-white to-gray-50/80 rounded-[14px] p-4 h-full flex flex-col relative overflow-hidden">

                  {/* Decorative background blob */}
                  <div className={`absolute -right-8 -top-8 w-24 h-24 rounded-full blur-2xl opacity-20 transition-opacity duration-300 group-hover:opacity-40 bg-gradient-to-br ${getStatusColor(laptop.status).split(' ')[0]}`}></div>

                  {/* Header Row */}
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className={`w-10 h-10 bg-gradient-to-br ${getStatusColor(laptop.status)} rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300`}>
                      <Laptop className="h-5 w-5 text-white" />
                    </div>
                    <div className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ring-1 ring-inset ${getStatusBadgeStyle(laptop.status)}`}>
                      {getStatusIcon(laptop.status)}
                      <span className="ml-1">{getStatusText(laptop.status)}</span>
                    </div>
                  </div>

                  {/* Identifier & Model */}
                  <div className="mb-4 relative z-10">
                    <h3 className="text-lg font-black text-gray-900 tracking-tight group-hover:text-notaria-700 transition-colors">
                      {laptop.id}
                    </h3>
                    <p className="text-xs font-medium text-gray-500 mt-0.5">
                      {laptop.brand} <span className="text-gray-300 mx-1">•</span> {laptop.model}
                    </p>
                  </div>

                  {/* Distinctive Info Lines */}
                  <div className="space-y-1.5 flex-1 relative z-10">

                    {/* Compact SN Line */}
                    <div className="flex items-center p-2 rounded-lg bg-white/60 border border-gray-100 shadow-sm group-hover:bg-white transition-colors">
                      <span className="text-[10px] font-bold text-gray-500 uppercase shrink-0 bg-gray-100/80 px-1.5 py-0.5 rounded mr-2">SN</span>
                      <span className="font-mono text-xs font-bold text-gray-800 truncate">{laptop.serialNumber}</span>
                    </div>

                    {laptop.currentUser && (
                      <div className="flex items-center p-2 rounded-lg bg-gradient-to-r from-notaria-50/50 to-white border border-notaria-100/50 shadow-sm mb-1.5">
                        <div className="w-6 h-6 rounded bg-notaria-100 text-notaria-600 flex items-center justify-center shrink-0 mr-2">
                          <User className="h-3.5 w-3.5" />
                        </div>
                        <span className="text-xs font-bold text-notaria-900 truncate" title={laptop.currentUser}>
                          {laptop.currentUser}
                        </span>
                      </div>
                    )}
                    
                    {laptop.assignedIntern && (
                      <div className="flex items-center p-2 rounded-lg bg-gradient-to-r from-purple-50/50 to-white border border-purple-100/50 shadow-sm">
                        <div className="w-6 h-6 rounded bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 mr-2">
                          <User className="h-3.5 w-3.5" />
                        </div>
                        <span className="text-xs font-bold text-purple-900 truncate" title={laptop.assignedIntern}>
                          {laptop.assignedIntern}
                        </span>
                      </div>
                    )}
                    
                    {!laptop.currentUser && !laptop.assignedIntern && (
                      <div className="p-2 rounded-lg border border-transparent h-10"></div> /* Placeholder for alignment */
                    )}

                    {laptop.biometricSerial && (
                      <div className="flex items-center p-2 rounded-lg bg-gradient-to-r from-teal-50/50 to-white border border-teal-100/50 shadow-sm">
                        <div className="w-6 h-6 rounded bg-teal-100 text-teal-600 flex items-center justify-center shrink-0 mr-2">
                          <Fingerprint className="h-3.5 w-3.5" />
                        </div>
                        <span className="font-mono text-xs font-bold text-teal-900 truncate" title={laptop.biometricSerial}>{laptop.biometricSerial}</span>
                      </div>
                    )}
                  </div>

                  {/* Footer Context */}
                  {laptop.assignedAt && (
                    <div className="mt-4 pt-3 border-t border-gray-100/80 relative z-10 flex justify-between items-center text-[10px] uppercase tracking-wider font-semibold">
                      <span className="text-gray-400">Asignado</span>
                      <span className="text-gray-500">{new Date(laptop.assignedAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                  )}

                  {laptop.status === 'disponible' && (
                    <div className="mt-4 pt-3 border-t border-gray-100/80 relative z-10">
                      <button 
                        onClick={() => {
                          setInitialRequestedLaptopId(laptop.id);
                          setShowRequestModal(true);
                        }}
                        className="w-full flex items-center justify-center px-4 py-2 border border-notaria-200 text-notaria-700 bg-notaria-50 hover:bg-notaria-100 rounded-xl text-xs font-bold transition-colors"
                      >
                        <Send className="w-3.5 h-3.5 mr-1.5" /> Solicitar este equipo
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modern List View */}
      {viewMode === 'list' && (
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white shadow-lg shadow-gray-200/30 overflow-hidden animate-in slide-in-from-bottom-8 duration-700">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="py-4 px-5 font-bold text-xs text-gray-500 uppercase tracking-wider">Equipo</th>
                  <th className="py-4 px-5 font-bold text-xs text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="py-4 px-5 font-bold text-xs text-gray-500 uppercase tracking-wider">Especificaciones</th>
                  <th className="py-4 px-5 font-bold text-xs text-gray-500 uppercase tracking-wider">Nº Serie</th>
                  <th className="py-4 px-5 font-bold text-xs text-gray-500 uppercase tracking-wider">Asignación</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredLaptops.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-sm text-gray-500">
                      No se encontraron equipos que coincidan con la búsqueda.
                    </td>
                  </tr>
                ) : (
                  filteredLaptops.map((laptop) => (
                    <tr key={laptop.id} className="hover:bg-gray-50/80 transition-colors group">
                      <td className="py-3 px-5">
                        <div className="flex items-center">
                          <div className={`w-8 h-8 bg-gradient-to-br ${getStatusColor(laptop.status)} rounded-lg flex items-center justify-center mr-3 shadow-sm group-hover:scale-105 transition-transform`}>
                            <Laptop className="h-4 w-4 text-white" />
                          </div>
                          <span className="font-extrabold text-gray-900 text-sm">{laptop.id}</span>
                        </div>
                      </td>
                      <td className="py-3 px-5">
                        <div className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ring-1 ring-inset ${getStatusBadgeStyle(laptop.status)}`}>
                          {getStatusIcon(laptop.status)}
                          <span className="ml-1.5">{getStatusText(laptop.status)}</span>
                        </div>
                      </td>
                      <td className="py-3 px-5">
                        <div className="flex flex-col">
                          <span className="font-bold text-sm text-gray-900">{laptop.brand}</span>
                          <span className="text-xs font-medium text-gray-500">{laptop.model}</span>
                        </div>
                      </td>
                      <td className="py-3 px-5">
                        <span className="font-mono text-xs font-bold text-gray-600 bg-gray-100/80 px-2 py-0.5 rounded-md">{laptop.serialNumber}</span>
                      </td>
                      <td className="py-3 px-5">
                        <div className="flex flex-col space-y-1">
                          {laptop.currentUser && (
                            <span className="text-xs font-bold text-notaria-700 flex items-center">
                              <User className="w-3 h-3 mr-1" />
                              {laptop.currentUser}
                            </span>
                          )}
                          {laptop.assignedIntern && (
                            <span className="text-[11px] font-bold text-purple-700 flex items-center">
                              <User className="w-3 h-3 mr-1" />
                              {laptop.assignedIntern}
                            </span>
                          )}
                          {!laptop.currentUser && !laptop.assignedIntern && (
                            <span className="text-xs text-gray-400 font-medium">-</span>
                          )}
                          {laptop.biometricSerial && (
                            <span className="font-mono text-[10px] text-teal-600 flex items-center">
                              <Fingerprint className="w-3 h-3 mr-1" />
                              {laptop.biometricSerial}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal for Requests */}
      {showRequestModal && (
        <RequestLaptopModal
          availableLaptops={strictlyAvailableLaptops}
          initialRequestedLaptopId={initialRequestedLaptopId}
          onClose={() => setShowRequestModal(false)}
          onSuccess={() => {
            setShowRequestModal(false);
            alert('¡Tu solicitud ha sido enviada exitosamente! Por favor, pasa al Área de Sistemas para validar tu solicitud.');
          }}
        />
      )}
    </div>
  );
}
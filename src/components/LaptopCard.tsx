import { Laptop as LaptopIcon, Edit3, User, Fingerprint, CheckCircle, Clock, Settings, Trash2, EyeOff } from 'lucide-react';
import { Laptop } from '../types';

interface LaptopCardProps {
  laptop: Laptop;
  onEdit?: (laptop: Laptop) => void;
  onAssign?: (laptop: Laptop) => void;
  onReturn?: (laptop: Laptop) => void;
  onMaintenanceToggle?: (laptopId: string, inMaintenance: boolean) => void;
  onDelete?: (laptop: Laptop) => void;
  showEditButton?: boolean;
  showAssignButton?: boolean;
  showMaintenanceButton?: boolean;
  showDeleteButton?: boolean;
}

export default function LaptopCard({ 
  laptop, 
  onEdit, 
  onAssign, 
  onReturn, 
  onMaintenanceToggle,
  onDelete,
  showEditButton = false, 
  showAssignButton = false,
  showMaintenanceButton = false,
  showDeleteButton = false
}: LaptopCardProps) {
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
        return <LaptopIcon className="h-3 w-3" />;
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
    <div className="group bg-white/80 backdrop-blur-xl rounded-2xl p-1 border border-white shadow-[0_4px_15px_rgb(0,0,0,0.03)] hover:shadow-[0_10px_25px_rgb(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 relative">
      <div className="bg-gradient-to-b from-white to-gray-50/80 rounded-[14px] p-4 h-full flex flex-col relative overflow-hidden">
                  
        {/* Decorative background blob */}
        <div className={`absolute -right-8 -top-8 w-24 h-24 rounded-full blur-2xl opacity-20 transition-opacity duration-300 group-hover:opacity-40 bg-gradient-to-br ${getStatusColor(laptop.status).split(' ')[0]}`}></div>

        {/* Header Row */}
        <div className="flex justify-between items-start mb-4 relative z-10">
          <div className="flex space-x-2">
            <div className={`w-10 h-10 bg-gradient-to-br ${getStatusColor(laptop.status)} rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300`}>
              <LaptopIcon className="h-5 w-5 text-white" />
            </div>
            {laptop.isPublic === false && (
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center shadow-sm text-gray-500" title="Oculto al público">
                <EyeOff className="h-4 w-4" />
              </div>
            )}
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
            <div className="flex items-center p-2 rounded-lg bg-gradient-to-r from-notaria-50/50 to-white border border-notaria-100/50 shadow-sm">
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
            <div className="p-2 rounded-lg border border-transparent h-10"></div>
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
        
        {/* Action Buttons - Compact Hover Row at bottom */}
        <div className={`relative z-10 flex justify-center space-x-1.5 mt-4 p-2 bg-white/90 backdrop-blur-md rounded-xl border border-gray-100 shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300 ${!showEditButton && !showAssignButton && !showMaintenanceButton && !showDeleteButton ? 'hidden' : ''}`}>
          {showEditButton && onEdit && (
            <button onClick={() => onEdit(laptop)} className="p-1.5 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 text-gray-500 transition-all" title="Editar">
              <Edit3 className="h-3.5 w-3.5" />
            </button>
          )}
          
          {showAssignButton && laptop.status === 'disponible' && onAssign && (
            <button onClick={() => onAssign(laptop)} className="p-1.5 rounded-lg hover:bg-emerald-50 hover:text-emerald-600 text-gray-500 transition-all" title="Asignar">
              <User className="h-3.5 w-3.5" />
            </button>
          )}
          
          {showAssignButton && laptop.status === 'en-uso' && onReturn && (
            <button onClick={() => onReturn(laptop)} className="p-1.5 rounded-lg hover:bg-orange-50 hover:text-orange-600 text-gray-500 transition-all" title="Devolver">
              <CheckCircle className="h-3.5 w-3.5" />
            </button>
          )}
          
          {showMaintenanceButton && onMaintenanceToggle && (
            <button onClick={() => onMaintenanceToggle(laptop.id, laptop.status !== 'mantenimiento')} className={`p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-all ${laptop.status === 'mantenimiento' ? 'text-blue-500 hover:text-blue-600 hover:bg-blue-50' : ''}`} title={laptop.status === 'mantenimiento' ? 'Quitar de mantenimiento' : 'Marcar en mantenimiento'}>
              <Settings className="h-3.5 w-3.5" />
            </button>
          )}
          
          {showDeleteButton && onDelete && (
            <button onClick={() => onDelete(laptop)} className="p-1.5 rounded-lg hover:bg-red-50 hover:text-red-600 text-gray-500 transition-all" title="Eliminar">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
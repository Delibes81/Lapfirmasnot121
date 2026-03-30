import React, { useState } from 'react';
import { Laptop as LaptopIcon, CheckCircle, Clock, Settings } from 'lucide-react';
import { Laptop, Lawyer, BiometricDevice, Pasante } from '../types';
import LaptopCard from './LaptopCard';
import EditLaptopModal from './EditLaptopModal';
import AssignmentModal from './AssignmentModal';
import DeleteLaptopModal from './DeleteLaptopModal';
import { laptopService } from '../services/laptopService';
import { lawyerService } from '../services/lawyerService';
import { biometricService } from '../services/biometricService';
import { pasanteService } from '../services/pasanteService';

interface LaptopManagementProps {
  laptops: Laptop[];
  setLaptops: React.Dispatch<React.SetStateAction<Laptop[]>>;
  onDataChange: () => void;
}

export default function LaptopManagement({ laptops, setLaptops, onDataChange }: LaptopManagementProps) {
  const [editingLaptop, setEditingLaptop] = useState<Laptop | null>(null);
  const [assigningLaptop, setAssigningLaptop] = useState<Laptop | null>(null);
  const [deletingLaptop, setDeletingLaptop] = useState<Laptop | null>(null);
  const [isReturning, setIsReturning] = useState(false);
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [biometricDevices, setBiometricDevices] = useState<BiometricDevice[]>([]);
  const [pasantes, setPasantes] = useState<Pasante[]>([]);
  
  const totalLaptops = laptops.length;
  const availableLaptops = laptops.filter(l => l.status === 'disponible').length;
  const inUseLaptops = laptops.filter(l => l.status === 'en-uso').length;
  const maintenanceLaptops = laptops.filter(l => l.status === 'mantenimiento').length;

  const statusOrder: Record<string, number> = {
    'en-uso': 1,
    'disponible': 2,
    'mantenimiento': 3
  };

  const sortedLaptops = [...laptops].sort((a, b) => {
    const orderA = statusOrder[a.status] || 99;
    const orderB = statusOrder[b.status] || 99;
    if (orderA === orderB) {
      return a.id.localeCompare(b.id);
    }
    return orderA - orderB;
  });

  // Load lawyers and biometric devices
  React.useEffect(() => {
    const loadData = async () => {
      try {
        const [lawyersData, biometricsData, pasantesData] = await Promise.all([
          lawyerService.getAllLawyers(),
          biometricService.getAllBiometricDevices(),
          pasanteService.getAllPasantes()
        ]);
        setLawyers(lawyersData);
        setBiometricDevices(biometricsData);
        setPasantes(pasantesData);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    loadData();
  }, []);

  const handleEditLaptop = (laptop: Laptop) => {
    setEditingLaptop(laptop);
  };

  const handleAssignLaptop = (laptop: Laptop) => {
    setAssigningLaptop(laptop);
    setIsReturning(false);
  };

  const handleReturnLaptop = (laptop: Laptop) => {
    setAssigningLaptop(laptop);
    setIsReturning(true);
  };

  const handleDeleteLaptop = (laptop: Laptop) => {
    setDeletingLaptop(laptop);
  };

  const handleConfirmDelete = async (laptopId: string) => {
    try {
      await laptopService.deleteLaptop(laptopId);
      setLaptops(prev => prev.filter(laptop => laptop.id !== laptopId));
      setDeletingLaptop(null);
      onDataChange();
    } catch (error) {
      console.error('Error deleting laptop:', error);
      alert('Error al eliminar la laptop. Por favor, inténtalo de nuevo.');
    }
  };

  const handleUpdateLaptop = (updatedLaptop: Laptop) => {
    setLaptops(prev => prev.map(laptop => 
      laptop.id === updatedLaptop.id ? updatedLaptop : laptop
    ));
    setEditingLaptop(null);
    onDataChange();
  };

  const handleAssignSubmit = async (laptopId: string, userName: string, biometricSerial?: string, internName?: string) => {
    try {
      let finalInternName = internName;
      if (internName) {
        const exists = pasantes.some(p => p.name.toLowerCase() === internName.toLowerCase());
        if (!exists) {
           const newPasante = await pasanteService.createPasante({ name: internName });
           setPasantes(prev => [...prev, newPasante]);
           finalInternName = newPasante.name;
        }
      }

      const updatedLaptop = await laptopService.assignLaptop(laptopId, userName, biometricSerial, finalInternName);
      setLaptops(prev => prev.map(laptop => 
        laptop.id === laptopId ? updatedLaptop : laptop
      ));
      setAssigningLaptop(null);
      onDataChange();
    } catch (error) {
      console.error('Error assigning laptop:', error);
      alert('Error al asignar la laptop. Por favor, inténtalo de nuevo.');
    }
  };

  const handleReturnSubmit = async (laptopId: string) => {
    try {
      const updatedLaptop = await laptopService.returnLaptop(laptopId);
      setLaptops(prev => prev.map(laptop => 
        laptop.id === laptopId ? updatedLaptop : laptop
      ));
      setAssigningLaptop(null);
      onDataChange();
    } catch (error) {
      console.error('Error returning laptop:', error);
      alert('Error al devolver la laptop. Por favor, inténtalo de nuevo.');
    }
  };

  const handleMaintenanceToggle = async (laptopId: string, inMaintenance: boolean) => {
    try {
      const updatedLaptop = await laptopService.setMaintenanceStatus(laptopId, inMaintenance);
      setLaptops(prev => prev.map(laptop => 
        laptop.id === laptopId ? updatedLaptop : laptop
      ));
      onDataChange();
    } catch (error) {
      console.error('Error updating maintenance status:', error);
      alert('Error al cambiar el estado de mantenimiento. Por favor, inténtalo de nuevo.');
    }
  };
  return (
    <div className="space-y-6">
      {/* Bento Grid Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-2">
        {/* Total */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 border border-white shadow-md shadow-gray-200/40 relative overflow-hidden group hover:-translate-y-0.5 transition-transform duration-300">
           <div className="absolute -right-4 -top-4 w-16 h-16 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-full blur-xl group-hover:bg-blue-100 transition-colors"></div>
           <div className="relative z-10 flex flex-col h-full justify-between">
             <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-blue-500/30 mb-2">
               <LaptopIcon className="h-5 w-5 text-white" />
             </div>
             <div>
               <p className="text-xs font-semibold text-gray-500 mb-0.5">Total Equipos</p>
               <p className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-gray-900 to-gray-700 leading-tight">{totalLaptops}</p>
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
               <p className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-gray-900 to-gray-700 leading-tight">{availableLaptops}</p>
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
               <p className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-gray-900 to-gray-700 leading-tight">{inUseLaptops}</p>
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
               <p className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-gray-900 to-gray-700 leading-tight">{maintenanceLaptops}</p>
             </div>
           </div>
        </div>
      </div>

      {/* Laptops Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedLaptops.map((laptop) => (
          <LaptopCard
            key={laptop.id}
            laptop={laptop}
            onEdit={handleEditLaptop}
            onAssign={handleAssignLaptop}
            onReturn={handleReturnLaptop}
            onMaintenanceToggle={handleMaintenanceToggle}
            onDelete={handleDeleteLaptop}
            showEditButton={true}
            showAssignButton={true}
            showMaintenanceButton={true}
            showDeleteButton={true}
          />
        ))}
      </div>

      {/* Edit Laptop Modal */}
      {editingLaptop && (
        <EditLaptopModal
          laptop={editingLaptop}
          onUpdate={handleUpdateLaptop}
          onClose={() => setEditingLaptop(null)}
          existingLaptops={laptops}
        />
      )}

      {/* Assignment Modal */}
      {assigningLaptop && (
        <AssignmentModal
          laptop={assigningLaptop}
          isReturning={isReturning}
          onAssign={handleAssignSubmit}
          onReturn={handleReturnSubmit}
          onClose={() => setAssigningLaptop(null)}
          existingLawyers={lawyers}
          existingBiometrics={biometricDevices}
          existingPasantes={pasantes}
        />
      )}

      {/* Delete Laptop Modal */}
      {deletingLaptop && (
        <DeleteLaptopModal
          laptop={deletingLaptop}
          onConfirm={handleConfirmDelete}
          onClose={() => setDeletingLaptop(null)}
        />
      )}
    </div>
  );
}
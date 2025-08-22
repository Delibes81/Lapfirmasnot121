import React, { useState } from 'react';
import { Laptop, Lawyer, BiometricDevice } from '../types';
import LaptopCard from './LaptopCard';
import EditLaptopModal from './EditLaptopModal';
import AssignmentModal from './AssignmentModal';
import { laptopService } from '../services/laptopService';
import { lawyerService } from '../services/lawyerService';
import { biometricService } from '../services/biometricService';

interface LaptopManagementProps {
  laptops: Laptop[];
  setLaptops: React.Dispatch<React.SetStateAction<Laptop[]>>;
  onDataChange: () => void;
}

export default function LaptopManagement({ laptops, setLaptops, onDataChange }: LaptopManagementProps) {
  const [editingLaptop, setEditingLaptop] = useState<Laptop | null>(null);
  const [assigningLaptop, setAssigningLaptop] = useState<Laptop | null>(null);
  const [isReturning, setIsReturning] = useState(false);
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [biometricDevices, setBiometricDevices] = useState<BiometricDevice[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  
  const totalLaptops = laptops.length;
  const availableLaptops = laptops.filter(l => l.status === 'disponible').length;
  const inUseLaptops = laptops.filter(l => l.status === 'en-uso').length;
  const maintenanceLaptops = laptops.filter(l => l.status === 'mantenimiento').length;

  // Load lawyers and biometric devices
  React.useEffect(() => {
    const loadData = async () => {
      try {
        const [lawyersData, biometricsData] = await Promise.all([
          lawyerService.getAllLawyers(),
          biometricService.getAllBiometricDevices()
        ]);
        setLawyers(lawyersData);
        setBiometricDevices(biometricsData);
        setDataLoaded(true);
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

  const handleUpdateLaptop = (updatedLaptop: Laptop) => {
    setLaptops(prev => prev.map(laptop => 
      laptop.id === updatedLaptop.id ? updatedLaptop : laptop
    ));
    setEditingLaptop(null);
    onDataChange();
  };

  const handleAssignSubmit = async (laptopId: string, userName: string, biometricSerial?: string) => {
    try {
      const updatedLaptop = await laptopService.assignLaptop(laptopId, userName, biometricSerial);
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

  const handleQuickAssign = async (laptopId: string, userName: string, biometricSerial?: string) => {
    try {
      const updatedLaptop = await laptopService.assignLaptop(laptopId, userName, biometricSerial);
      setLaptops(prev => prev.map(laptop => 
        laptop.id === laptopId ? updatedLaptop : laptop
      ));
    } catch (error) {
      console.error('Error assigning laptop:', error);
      alert('Error al asignar la laptop. Por favor, inténtalo de nuevo.');
    } finally {
      onDataChange();
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
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-blue-200/50 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Laptops</p>
              <p className="text-3xl font-bold text-blue-700">{totalLaptops}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            </div>
          </div>
        </div>
        
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-emerald-200/50 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-emerald-600">Disponibles</p>
              <p className="text-3xl font-bold text-emerald-700">{availableLaptops}</p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
            </div>
          </div>
        </div>
        
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-orange-200/50 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">En Uso</p>
              <p className="text-3xl font-bold text-orange-700">{inUseLaptops}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            </div>
          </div>
        </div>
        
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Mantenimiento</p>
              <p className="text-3xl font-bold text-gray-700">{maintenanceLaptops}</p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
              <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Laptops Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {laptops.map((laptop) => (
          <LaptopCard
            key={laptop.id}
            laptop={laptop}
            lawyers={lawyers}
            biometricDevices={biometricDevices}
            onEdit={handleEditLaptop}
            onAssign={handleAssignLaptop}
            onReturn={handleReturnLaptop}
            onQuickAssign={handleQuickAssign}
            onMaintenanceToggle={handleMaintenanceToggle}
            showEditButton={true}
            showAssignButton={true}
            showQuickAssign={true}
            showMaintenanceButton={true}
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
        />
      )}
    </div>
  );
}
import React, { useState } from 'react';
import { Laptop, Assignment, LaptopStatus } from '../types';
import LaptopCard from './LaptopCard';
import AssignmentModal from './AssignmentModal';
import { laptopService } from '../services/laptopService';

interface LaptopManagementProps {
  laptops: Laptop[];
  setLaptops: React.Dispatch<React.SetStateAction<Laptop[]>>;
  onDataChange: () => void;
}

export default function LaptopManagement({ laptops, setLaptops, onDataChange }: LaptopManagementProps) {
  const [selectedLaptop, setSelectedLaptop] = useState<Laptop | null>(null);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [isReturning, setIsReturning] = useState(false);

  const handleAssign = async (laptopId: string, userName: string, purpose: string, biometricSerial?: string) => {
    const laptop = laptops.find(l => l.id === laptopId);
    if (!laptop) return;

    try {
      // Actualizar la laptop
      setLaptops(laptops.map(l => 
        l.id === laptopId 
          ? { ...l, updatedAt: new Date().toISOString() }
          : l
      ));

      setShowAssignmentModal(false);
      setSelectedLaptop(null);
      onDataChange(); // Refrescar datos
    } catch (error) {
      console.error('Error assigning laptop:', error);
      alert('Error al asignar la laptop. Por favor, inténtalo de nuevo.');
    }
  };

  const handleReturn = async (laptopId: string, notes?: string) => {
    try {
      // Actualizar la laptop
      setLaptops(laptops.map(l => 
        l.id === laptopId 
          ? { ...l, updatedAt: new Date().toISOString() }
          : l
      ));

      setShowAssignmentModal(false);
      setSelectedLaptop(null);
      setIsReturning(false);
      onDataChange(); // Refrescar datos
    } catch (error) {
      console.error('Error returning laptop:', error);
      alert('Error al devolver la laptop. Por favor, inténtalo de nuevo.');
    }
  };

  const handleStatusChange = async (laptopId: string, newStatus: LaptopStatus) => {
    try {
      setLaptops(laptops.map(l => 
        l.id === laptopId 
          ? { ...l, updatedAt: new Date().toISOString() }
          : l
      ));

      onDataChange(); // Refrescar datos
    } catch (error) {
      console.error('Error updating laptop status:', error);
      alert('Error al actualizar el estado de la laptop. Por favor, inténtalo de nuevo.');
    }
  };

  const openAssignmentModal = (laptop: Laptop, returning = false) => {
    setSelectedLaptop(laptop);
    setIsReturning(returning);
    setShowAssignmentModal(true);
  };

  const totalLaptops = laptops.length;

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-emerald-200/50 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Laptops</p>
              <p className="text-3xl font-bold text-blue-700">{totalLaptops}</p>
            </div>
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Laptops Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {laptops.map((laptop) => (
          <LaptopCard
            key={laptop.id}
            laptop={laptop}
            onAssign={() => openAssignmentModal(laptop)}
            onReturn={() => openAssignmentModal(laptop, true)}
            onStatusChange={handleStatusChange}
          />
        ))}
      </div>

      {/* Assignment Modal */}
      {showAssignmentModal && selectedLaptop && (
        <AssignmentModal
          laptop={selectedLaptop}
          isReturning={isReturning}
          onAssign={handleAssign}
          onReturn={handleReturn}
          onClose={() => {
            setShowAssignmentModal(false);
            setSelectedLaptop(null);
            setIsReturning(false);
          }}
        />
      )}
    </div>
  );
}
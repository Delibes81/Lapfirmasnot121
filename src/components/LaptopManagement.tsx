import React, { useState } from 'react';
import { Laptop, Assignment, LaptopStatus } from '../types';
import LaptopCard from './LaptopCard';
import AssignmentModal from './AssignmentModal';
import { laptopService, assignmentService } from '../services/laptopService';

interface LaptopManagementProps {
  laptops: Laptop[];
  setLaptops: React.Dispatch<React.SetStateAction<Laptop[]>>;
  assignments: Assignment[];
  setAssignments: React.Dispatch<React.SetStateAction<Assignment[]>>;
  onDataChange: () => void;
}

export default function LaptopManagement({ laptops, setLaptops, assignments, setAssignments, onDataChange }: LaptopManagementProps) {
  const [selectedLaptop, setSelectedLaptop] = useState<Laptop | null>(null);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [isReturning, setIsReturning] = useState(false);

  const handleAssign = async (laptopId: string, userName: string, purpose: string, biometricSerial?: string) => {
    const laptop = laptops.find(l => l.id === laptopId);
    if (!laptop) return;

    try {
      // Crear la asignación en la base de datos
      const newAssignment = await assignmentService.createAssignment({
        laptopId,
        userName,
        purpose: 'Uso general',
        assignedAt: new Date().toISOString(),
        returnedAt: null,
      });

      // Actualizar el estado de la laptop
      await laptopService.updateLaptop(laptopId, {
        status: 'en-uso' as LaptopStatus,
        currentUser: userName,
        biometricReader: !!biometricSerial,
        biometricSerial: biometricSerial || undefined,
      });

      // Actualizar el estado local
      setAssignments([...assignments, newAssignment]);
      setLaptops(laptops.map(l => 
        l.id === laptopId 
          ? { 
              ...l, 
              status: 'en-uso' as LaptopStatus, 
              currentUser: userName, 
              biometricReader: !!biometricSerial,
              biometricSerial: biometricSerial || undefined,
              updatedAt: new Date().toISOString() 
            }
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
    const activeAssignment = assignments.find(a => 
      a.laptopId === laptopId && !a.returnedAt
    );

    if (!activeAssignment) return;

    try {
      // Actualizar la asignación en la base de datos
      await assignmentService.updateAssignment(activeAssignment.id, {
        returnedAt: new Date().toISOString(),
        returnNotes: notes
      });

      // Actualizar el estado de la laptop
      await laptopService.updateLaptop(laptopId, {
        status: 'disponible' as LaptopStatus,
        currentUser: null
      });

      // Actualizar el estado local
      setAssignments(assignments.map(a => 
        a.id === activeAssignment.id 
          ? { ...a, returnedAt: new Date().toISOString(), returnNotes: notes }
          : a
      ));

      setLaptops(laptops.map(l => 
        l.id === laptopId 
          ? { ...l, status: 'disponible' as LaptopStatus, currentUser: null, updatedAt: new Date().toISOString() }
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
      await laptopService.updateLaptop(laptopId, {
        status: newStatus,
        currentUser: newStatus === 'disponible' ? null : laptops.find(l => l.id === laptopId)?.currentUser
      });

      setLaptops(laptops.map(l => 
        l.id === laptopId 
          ? { 
              ...l, 
              status: newStatus, 
              currentUser: newStatus === 'disponible' ? null : l.currentUser,
              updatedAt: new Date().toISOString()
            }
          : l
      ));

      onDataChange(); // Refrescar datos
    } catch (error) {
      console.error('Error updating laptop status:', error);
      alert('Error al actualizar el estado de la laptop. Por favor, inténtalo de nuevo.');
    }
  };
      laptopId,
      userName,
      purpose: 'Uso general',
      assignedAt: new Date().toISOString(),
      returnedAt: null,
    };

    setAssignments([...assignments, newAssignment]);
    setLaptops(laptops.map(l => 
      l.id === laptopId 
        ? { 
            ...l, 
            status: 'en-uso' as LaptopStatus, 
            currentUser: userName, 
            biometricReader: !!biometricSerial,
            biometricSerial: biometricSerial || undefined,
            updatedAt: new Date().toISOString() 
          }
        : l
    ));

    setShowAssignmentModal(false);
    setSelectedLaptop(null);
  };

  const handleReturn = (laptopId: string, notes?: string) => {
    const activeAssignment = assignments.find(a => 
      a.laptopId === laptopId && !a.returnedAt
    );

    if (activeAssignment) {
      setAssignments(assignments.map(a => 
        a.id === activeAssignment.id 
          ? { ...a, returnedAt: new Date().toISOString(), returnNotes: notes }
          : a
      ));
    }

    setLaptops(laptops.map(l => 
      l.id === laptopId 
        ? { ...l, status: 'disponible' as LaptopStatus, currentUser: null, updatedAt: new Date().toISOString() }
        : l
    ));

    setShowAssignmentModal(false);
    setSelectedLaptop(null);
    setIsReturning(false);
  };

  const handleStatusChange = (laptopId: string, newStatus: LaptopStatus) => {
    setLaptops(laptops.map(l => 
      l.id === laptopId 
        ? { 
            ...l, 
            status: newStatus, 
            currentUser: newStatus === 'disponible' ? null : l.currentUser,
            updatedAt: new Date().toISOString()
          }
        : l
    ));
  };

  const openAssignmentModal = (laptop: Laptop, returning = false) => {
    setSelectedLaptop(laptop);
    setIsReturning(returning);
    setShowAssignmentModal(true);
  };

  const availableLaptops = laptops.filter(l => l.status === 'disponible').length;
  const inUseLaptops = laptops.filter(l => l.status === 'en-uso').length;
  const maintenanceLaptops = laptops.filter(l => l.status === 'mantenimiento').length;

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-emerald-200/50 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-emerald-600">Disponibles</p>
              <p className="text-3xl font-bold text-emerald-700">{availableLaptops}</p>
            </div>
            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-amber-200/50 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-amber-600">En Uso</p>
              <p className="text-3xl font-bold text-amber-700">{inUseLaptops}</p>
            </div>
            <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-red-200/50 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Mantenimiento</p>
              <p className="text-3xl font-bold text-red-700">{maintenanceLaptops}</p>
            </div>
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
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
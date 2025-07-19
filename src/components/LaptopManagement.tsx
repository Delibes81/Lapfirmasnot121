import React, { useState } from 'react';
import { Laptop, Assignment, LaptopStatus } from '../types';
import LaptopCard from './LaptopCard';
import AssignmentModal from './AssignmentModal';

interface LaptopManagementProps {
  laptops: Laptop[];
  setLaptops: React.Dispatch<React.SetStateAction<Laptop[]>>;
  assignments: Assignment[];
  setAssignments: React.Dispatch<React.SetStateAction<Assignment[]>>;
}

export default function LaptopManagement({ laptops, setLaptops, assignments, setAssignments }: LaptopManagementProps) {
  const [selectedLaptop, setSelectedLaptop] = useState<Laptop | null>(null);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [isReturning, setIsReturning] = useState(false);

  const handleAssign = (laptopId: string, userName: string, purpose: string) => {
    const laptop = laptops.find(l => l.id === laptopId);
    if (!laptop) return;

    const newAssignment: Assignment = {
      id: Date.now().toString(),
      laptopId,
      userName,
      purpose,
      assignedAt: new Date().toISOString(),
      returnedAt: null,
    };

    setAssignments([...assignments, newAssignment]);
    setLaptops(laptops.map(l => 
      l.id === laptopId 
        ? { ...l, status: 'en-uso' as LaptopStatus, currentUser: userName, updatedAt: new Date().toISOString() }
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
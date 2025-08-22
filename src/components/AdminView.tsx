import React, { useState } from 'react';
import { Plus, History, Settings } from 'lucide-react';
import LaptopManagement from './LaptopManagement';
import HistoryPanel from './HistoryPanel';
import AddLaptopModal from './AddLaptopModal';
import { Laptop, Assignment } from '../types';

interface AdminViewProps {
  laptops: Laptop[];
  setLaptops: React.Dispatch<React.SetStateAction<Laptop[]>>;
  assignments: Assignment[];
  setAssignments: React.Dispatch<React.SetStateAction<Assignment[]>>;
  onDataChange: () => void;
}

type AdminTab = 'management' | 'history';

export default function AdminView({ laptops, setLaptops, assignments, setAssignments, onDataChange }: AdminViewProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('management');
  const [showAddModal, setShowAddModal] = useState(false);

  const addLaptop = (laptopData: Omit<Laptop, 'id' | 'status' | 'currentUser' | 'createdAt' | 'updatedAt'>) => {
    const newLaptop: Laptop = {
      ...laptopData,
      id: `LT-${String(laptops.length + 1).padStart(3, '0')}`,
      status: 'disponible',
      currentUser: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setLaptops([...laptops, newLaptop]);
    setShowAddModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Admin Header */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-sm mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Panel de Administración</h2>
            <p className="text-gray-600 mt-1">Gestión completa del inventario de laptops</p>
          </div>
          
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-sm hover:shadow-md"
          >
            <Plus className="h-4 w-4 mr-2" />
            Agregar Laptop
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mt-6 bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('management')}
            className={`flex-1 flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'management'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Settings className="h-4 w-4 mr-2" />
            Gestión de Equipos
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'history'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <History className="h-4 w-4 mr-2" />
            Historial
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'management' ? (
        <LaptopManagement 
          laptops={laptops}
          setLaptops={setLaptops}
          assignments={assignments}
          setAssignments={setAssignments}
          onDataChange={onDataChange}
        />
      ) : (
        <HistoryPanel laptops={laptops} assignments={assignments} />
      )}

      {/* Add Laptop Modal */}
      {showAddModal && (
        <AddLaptopModal
          onAdd={addLaptop}
          onClose={() => setShowAddModal(false)}
          existingLaptops={laptops}
        />
      )}
    </div>
  );
}
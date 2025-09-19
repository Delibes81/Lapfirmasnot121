import React, { useState, useEffect } from 'react';
import { Plus, History, Settings, Fingerprint, Users } from 'lucide-react';
import LaptopManagement from './LaptopManagement';
import HistoryPanel from './HistoryPanel';
import BiometricManagement from './BiometricManagement';
import LawyerManagement from './LawyerManagement';
import AddLaptopModal from './AddLaptopModal';
import { Laptop, Assignment } from '../types';
import { assignmentService } from '../services/assignmentService';

interface AdminViewProps {
  laptops: Laptop[];
  setLaptops: React.Dispatch<React.SetStateAction<Laptop[]>>;
  onDataChange: () => void;
}

type AdminTab = 'management' | 'biometric' | 'lawyers' | 'history';

export default function AdminView({ laptops, setLaptops, onDataChange }: AdminViewProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('management');
  const [showAddModal, setShowAddModal] = useState(false);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [assignmentsLoading, setAssignmentsLoading] = useState(false);

  // Fetch assignments when history tab is active
  useEffect(() => {
    if (activeTab === 'history') {
      setAssignmentsLoading(true);
      assignmentService.getAllAssignments()
        .then(setAssignments)
        .catch(console.error)
        .finally(() => setAssignmentsLoading(false));
    }
  }, [activeTab]);

  const addLaptop = (newLaptop: Laptop) => {
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
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-notaria-600 to-notaria-700 text-white rounded-xl hover:from-notaria-700 hover:to-notaria-800 transition-all shadow-sm hover:shadow-md"
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
                ? 'bg-white text-notaria-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Settings className="h-4 w-4 mr-2" />
            Gestión de Equipos
          </button>
          <button
            onClick={() => setActiveTab('biometric')}
            className={`flex-1 flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'biometric'
                ? 'bg-white text-notaria-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Fingerprint className="h-4 w-4 mr-2" />
            Biométricos
          </button>
          <button
            onClick={() => setActiveTab('lawyers')}
            className={`flex-1 flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'lawyers'
                ? 'bg-white text-notaria-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Users className="h-4 w-4 mr-2" />
            Personas
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'history'
                ? 'bg-white text-notaria-700 shadow-sm'
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
          onDataChange={onDataChange}
        />
      ) : activeTab === 'biometric' ? (
        <BiometricManagement />
      ) : activeTab === 'lawyers' ? (
        <LawyerManagement />
      ) : (
        assignmentsLoading ? (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 shadow-sm">
            <div className="flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-notaria-600 border-t-transparent rounded-full animate-spin mr-3"></div>
              <p className="text-gray-600">Cargando historial...</p>
            </div>
          </div>
        ) : (
          <HistoryPanel laptops={laptops} assignments={assignments} />
        )
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
import React, { useState, useEffect } from 'react';
import { Shield, Eye, Settings } from 'lucide-react';
import PublicView from './components/PublicView';
import AdminView from './components/AdminView';
import { Laptop, Assignment, ViewMode } from './types';

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('public');
  const [laptops, setLaptops] = useState<Laptop[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  // Initialize data
  useEffect(() => {
    const initialLaptops: Laptop[] = [
      {
        id: 'LT-001',
        brand: 'Dell',
        model: 'Vostro 7000',
        serialNumber: 'HK5ZMKG3',
        biometricReader: false,
        status: 'disponible',
        currentUser: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'LT-002',
        brand: 'Dell',
        model: 'Vostro 7000',
        serialNumber: 'CNY4KG3',
        biometricReader: false,
        status: 'disponible',
        currentUser: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'LT-003',
        brand: 'Dell',
        model: 'Vostro 7000',
        serialNumber: '67CZKW2',
        biometricReader: false,
        status: 'disponible',
        currentUser: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    // Inicializar con historial vacío
    const initialAssignments: Assignment[] = [];

    // Establecer los datos iniciales
    setLaptops(initialLaptops);
    setAssignments(initialAssignments);

    // Guardar en localStorage
    localStorage.setItem('laptops', JSON.stringify(initialLaptops));
    localStorage.setItem('assignments', JSON.stringify(initialAssignments));
  }, []);

  // Save to localStorage when data changes
  useEffect(() => {
    if (laptops.length > 0) {
      localStorage.setItem('laptops', JSON.stringify(laptops));
    }
  }, [laptops]);

  useEffect(() => {
    if (assignments.length > 0) {
      localStorage.setItem('assignments', JSON.stringify(assignments));
    }
  }, [assignments]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Sistema de Laptops</h1>
                <p className="text-sm text-gray-500">Gestión y Control de Equipos</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('public')}
                className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === 'public'
                    ? 'bg-blue-100 text-blue-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Eye className="h-4 w-4 mr-2" />
                Vista Pública
              </button>
              <button
                onClick={() => setViewMode('admin')}
                className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === 'admin'
                    ? 'bg-indigo-100 text-indigo-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Settings className="h-4 w-4 mr-2" />
                Administrador
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {viewMode === 'public' ? (
          <PublicView laptops={laptops} />
        ) : (
          <AdminView 
            laptops={laptops}
            setLaptops={setLaptops}
            assignments={assignments}
            setAssignments={setAssignments}
          />
        )}
      </main>
    </div>
  );
}

export default App;
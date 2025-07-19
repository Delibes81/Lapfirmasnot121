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
    // Lista de 22 abogados del despacho
    const lawyers = [
      'Lic. María Elena Rodríguez',
      'Lic. Carlos Alberto Mendoza',
      'Lic. Ana Patricia Vásquez',
      'Lic. Roberto Javier Hernández',
      'Lic. Sofía Alejandra Torres',
      'Lic. Miguel Ángel Ramírez',
      'Lic. Laura Beatriz Morales',
      'Lic. Fernando José García',
      'Lic. Claudia Esperanza López',
      'Lic. Andrés Felipe Castro',
      'Lic. Gabriela Monserrat Ruiz',
      'Lic. Diego Armando Flores',
      'Lic. Valeria Nicole Jiménez',
      'Lic. Sebastián Eduardo Vargas',
      'Lic. Paola Cristina Aguilar',
      'Lic. Alejandro Daniel Ortega',
      'Lic. Mónica Isabel Delgado',
      'Lic. Javier Emilio Peña',
      'Lic. Carmen Lucía Sánchez',
      'Lic. Ricardo Mauricio Cruz',
      'Lic. Adriana Fernanda Ramos',
      'Lic. Óscar Guillermo Medina'
    ];

    const purposes = [
      'Audiencia en Juzgado Civil',
      'Firma de escrituras en notaría',
      'Reunión con cliente corporativo',
      'Diligencia en Registro Público',
      'Mediación familiar',
      'Consulta externa con perito',
      'Trabajo remoto - caso urgente',
      'Presentación de demanda',
      'Revisión de contratos',
      'Audiencia virtual'
    ];

    const initialLaptops: Laptop[] = [
      {
        id: 'LT-001',
        brand: 'Dell',
        model: 'Latitude 5520',
        serialNumber: 'DL5520001',
        biometricReader: true,
        biometricSerial: 'BIO-DL001',
        status: 'en-uso',
        currentUser: lawyers[0], // María Elena Rodríguez
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'LT-002',
        brand: 'HP',
        model: 'EliteBook 840',
        serialNumber: 'HP840002',
        biometricReader: false,
        status: 'en-uso',
        currentUser: lawyers[5], // Miguel Ángel Ramírez
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'LT-003',
        brand: 'Lenovo',
        model: 'ThinkPad E14',
        serialNumber: 'TP14003',
        biometricReader: true,
        biometricSerial: 'BIO-TP003',
        status: 'mantenimiento',
        currentUser: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'LT-004',
        brand: 'ASUS',
        model: 'VivoBook Pro',
        serialNumber: 'VP15004',
        biometricReader: false,
        status: 'disponible',
        currentUser: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'LT-005',
        brand: 'Acer',
        model: 'Aspire 5',
        serialNumber: 'AA5005',
        biometricReader: true,
        biometricSerial: 'BIO-AC005',
        status: 'en-uso',
        currentUser: lawyers[12], // Valeria Nicole Jiménez
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    // Generar historial de asignaciones
    const initialAssignments: Assignment[] = [
      // Asignaciones activas
      {
        id: '1',
        laptopId: 'LT-001',
        userName: lawyers[0],
        purpose: purposes[0],
        assignedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // Hace 2 horas
        returnedAt: null
      },
      {
        id: '2',
        laptopId: 'LT-002',
        userName: lawyers[5],
        purpose: purposes[1],
        assignedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // Hace 4 horas
        returnedAt: null
      },
      {
        id: '3',
        laptopId: 'LT-005',
        userName: lawyers[12],
        purpose: purposes[6],
        assignedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // Hace 1 hora
        returnedAt: null
      },
      // Historial de asignaciones pasadas
      {
        id: '4',
        laptopId: 'LT-001',
        userName: lawyers[3],
        purpose: purposes[2],
        assignedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // Hace 2 días
        returnedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(), // 3 horas después
        returnNotes: 'Equipo en perfecto estado'
      },
      {
        id: '5',
        laptopId: 'LT-004',
        userName: lawyers[8],
        purpose: purposes[3],
        assignedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // Hace 3 días
        returnedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000).toISOString(), // 5 horas después
        returnNotes: 'Sin novedad'
      },
      {
        id: '6',
        laptopId: 'LT-003',
        userName: lawyers[15],
        purpose: purposes[4],
        assignedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // Hace 5 días
        returnedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // Hace 4 días
        returnNotes: 'Lector biométrico presenta fallas intermitentes'
      },
      {
        id: '7',
        laptopId: 'LT-002',
        userName: lawyers[1],
        purpose: purposes[5],
        assignedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // Hace 1 semana
        returnedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // Hace 6 días
      },
      {
        id: '8',
        laptopId: 'LT-005',
        userName: lawyers[10],
        purpose: purposes[7],
        assignedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // Hace 10 días
        returnedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(), // Hace 9 días
      },
      {
        id: '9',
        laptopId: 'LT-004',
        userName: lawyers[18],
        purpose: purposes[8],
        assignedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(), // Hace 12 días
        returnedAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(), // Hace 11 días
      },
      {
        id: '10',
        laptopId: 'LT-001',
        userName: lawyers[21],
        purpose: purposes[9],
        assignedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // Hace 15 días
        returnedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // Hace 14 días
      }
    ];

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
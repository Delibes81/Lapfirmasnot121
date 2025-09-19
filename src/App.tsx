import React, { useState, useEffect } from 'react';
import { Eye, Settings, LogOut } from 'lucide-react';
import PublicView from './components/PublicView';
import AdminView from './components/AdminView';
import LoginModal from './components/LoginModal';
import { Laptop, ViewMode } from './types';
import { laptopService } from './services/laptopService';
import { useAuth } from './hooks/useAuth';

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('public');
  const [laptops, setLaptops] = useState<Laptop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { user, loading: authLoading, signOut, isAuthenticated } = useAuth();

  // Initialize data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Test Supabase connection first
      console.log('Testing Supabase connection...');
      const laptopsData = await laptopService.getAllLaptops();
      
      console.log('Laptops cargadas:', laptopsData); // Debug
      setLaptops(laptopsData);
    } catch (err) {
      console.error('Error loading data:', err);
      
      let errorMessage = 'Error al cargar los datos.';
      
      if (err instanceof Error) {
        if (err.message.includes('Missing Supabase environment variables')) {
          errorMessage = 'Error de configuración: Variables de entorno de Supabase no encontradas. Por favor, configura tu archivo .env con VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.';
        } else if (err.message.includes('Failed to fetch')) {
          errorMessage = 'Error de conexión: No se puede conectar a Supabase. Verifica tu URL de Supabase y tu conexión a internet.';
        } else {
          errorMessage = `Error: ${err.message}`;
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <img src="/Logo_Notaria121_ALTA.png" alt="Notaría 121" className="h-16 w-auto mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Cargando Sistema</h2>
          <p className="text-gray-600">Conectando con la base de datos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <img src="/Logo_Notaria121_ALTA.png" alt="Notaría 121" className="h-16 w-auto mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error de Conexión</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadData}
            className="px-4 py-2 bg-notaria-600 text-white rounded-lg hover:bg-notaria-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const refreshData = () => {
    loadData();
  };

  const handleAdminClick = () => {
    if (isAuthenticated) {
      setViewMode('admin');
    } else {
      setShowLoginModal(true);
    }
  };

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    setViewMode('admin');
  };

  const handleSignOut = async () => {
    await signOut();
    setViewMode('public');
  };

  if (laptops.length === 0 && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <img src="/Logo_Notaria121_ALTA.png" alt="Notaría 121" className="h-16 w-auto mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Base de Datos Vacía</h2>
          <p className="text-gray-600 mb-4">No se encontraron laptops en la base de datos. Asegúrate de que las migraciones se hayan ejecutado correctamente.</p>
          <button
            onClick={refreshData}
            className="px-4 py-2 bg-notaria-600 text-white rounded-lg hover:bg-notaria-700 transition-colors"
          >
            Actualizar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <img src="/Logo_Notaria121_ALTA.png" alt="Notaría 121" className="h-10 w-auto" />
              <div>
                <h1 className="text-xl font-bold text-notaria-800">Sistema de Laptops</h1>
                <p className="text-sm text-notaria-600">Notaría 121 - Gestión de Equipos</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('public')}
                className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === 'public'
                    ? 'bg-notaria-100 text-notaria-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Eye className="h-4 w-4 mr-2" />
                Vista Pública
              </button>
              <button
                onClick={handleAdminClick}
                className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === 'admin'
                    ? 'bg-notaria-100 text-notaria-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Settings className="h-4 w-4 mr-2" />
                Administrador
              </button>
              
              {isAuthenticated && (
                <button
                  onClick={handleSignOut}
                  className="inline-flex items-center px-3 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-all"
                  title="Cerrar sesión"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {viewMode === 'public' ? (
          <PublicView laptops={laptops} />
        ) : (
          isAuthenticated ? (
            <AdminView 
              laptops={laptops}
              setLaptops={setLaptops}
              onDataChange={refreshData}
            />
          ) : (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-notaria-600 to-notaria-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Settings className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Acceso Restringido</h3>
                <p className="text-gray-600 mb-4">Necesitas iniciar sesión para acceder al panel de administración.</p>
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-notaria-600 to-notaria-700 text-white rounded-xl hover:from-notaria-700 hover:to-notaria-800 transition-all shadow-sm hover:shadow-md"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Iniciar Sesión
                </button>
              </div>
            </div>
          )
        )}
      </main>

      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </div>
  );
}

export default App;
import React, { useState } from 'react';
import { X, Lock, Mail, Eye, EyeOff, LogIn } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface LoginModalProps {
  onClose: () => void;
  onLoginSuccess: () => void;
}

export default function LoginModal({ onClose, onLoginSuccess }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      setError('Por favor, completa todos los campos');
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password
      });

      if (authError) {
        if (authError.message.includes('Invalid login credentials')) {
          setError('Credenciales incorrectas. Verifica tu email y contraseña.');
        } else {
          setError('Error al iniciar sesión. Inténtalo de nuevo.');
        }
        return;
      }

      if (data.user) {
        onLoginSuccess();
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('Error inesperado. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: 'email' | 'password', value: string) => {
    if (field === 'email') {
      setEmail(value);
    } else {
      setPassword(value);
    }
    
    if (error) {
      setError('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-notaria-600 to-notaria-700 rounded-xl flex items-center justify-center mr-3">
              <Lock className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Acceso de Administrador</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Logo */}
          <div className="text-center mb-6">
            <img 
              src="/Logo_Notaria121_ALTA.png" 
              alt="Notaría 121" 
              className="h-12 w-auto mx-auto mb-3" 
            />
            <p className="text-sm text-gray-600">
              Ingresa tus credenciales para acceder al panel de administración
            </p>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="h-4 w-4 inline mr-1" />
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-notaria-500 focus:border-notaria-500 transition-colors ${
                error ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="admin@notaria121.com"
              required
              disabled={isLoading}
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              <Lock className="h-4 w-4 inline mr-1" />
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={`w-full px-4 py-3 pr-12 border rounded-xl focus:outline-none focus:ring-2 focus:ring-notaria-500 focus:border-notaria-500 transition-colors ${
                  error ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="••••••••"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Info */}
          <div className="bg-notaria-50 rounded-lg p-4">
            <div className="flex items-start">
              <Lock className="h-5 w-5 text-notaria-600 mr-2 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-notaria-800">Acceso Restringido</h4>
                <p className="text-sm text-notaria-700 mt-1">
                  Solo el personal autorizado puede acceder al panel de administración.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading || !email.trim() || !password.trim()}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-notaria-600 to-notaria-700 text-white rounded-xl hover:from-notaria-700 hover:to-notaria-800 transition-all font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Iniciando sesión...
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4 mr-2" />
                  Iniciar Sesión
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { X, User, FileText, Calendar } from 'lucide-react';
import { Laptop } from '../types';

interface AssignmentModalProps {
  laptop: Laptop;
  isReturning: boolean;
  onAssign: (laptopId: string, userName: string, purpose: string) => void;
  onReturn: (laptopId: string, notes?: string) => void;
  onClose: () => void;
}

const LAWYERS = [
  'Lic. Victor Medina',
  'Lic. Edgar Magallan', 
  'Lic. Cesar Rocha',
  'Lic. Guadalupe Cruz',
  'Lic. Arturo Aguilar',
  'Lic. Rafael Angeles',
  'Lic. Ivan Ramirez',
  'Lic. Amando Mastachi',
  'Lic. Jorge Ramirez',
  'Lic. Humberto Montes',
  'Lic. Andrea Suarez',
  'Lic. Juan Moran',
  'Lic. Neftali Gracida',
  'Lic. Dulce Gomez',
  'Lic. Luis Meneses',
  'Lic. Adan Moctezuma',
  'Lic. Renato Toledo',
  'Lic. Armando Gomez',
  'Lic. Jannet Delgado',
  'Lic. Brayan Lara',
  'Lic. Luis Manjarrez',
  'Lic. Melissa Ortiz'
];

export default function AssignmentModal({ laptop, isReturning, onAssign, onReturn, onClose }: AssignmentModalProps) {
  const [userName, setUserName] = useState('');
  const [purpose, setPurpose] = useState('');
  const [returnNotes, setReturnNotes] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredLawyers, setFilteredLawyers] = useState(LAWYERS);

  const handleUserNameChange = (value: string) => {
    setUserName(value);
    if (value.trim()) {
      const filtered = LAWYERS.filter(lawyer => 
        lawyer.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredLawyers(filtered);
      setShowSuggestions(true);
    } else {
      setFilteredLawyers(LAWYERS);
      setShowSuggestions(false);
    }
  };

  const selectLawyer = (lawyer: string) => {
    setUserName(lawyer);
    setShowSuggestions(false);
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isReturning) {
      onReturn(laptop.id, returnNotes);
    } else {
      if (userName.trim() && purpose.trim()) {
        onAssign(laptop.id, userName.trim(), purpose.trim());
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {isReturning ? 'Devolver Laptop' : 'Asignar Laptop'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mr-3">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{laptop.id}</h3>
                  <p className="text-sm text-gray-500">{laptop.brand} {laptop.model}</p>
                </div>
              </div>
              {laptop.currentUser && (
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Usuario actual:</span> {laptop.currentUser}
                </p>
              )}
            </div>
          </div>

          {!isReturning ? (
            <>
              <div className="mb-4">
                <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="h-4 w-4 inline mr-1" />
                  Nombre del Abogado
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="userName"
                    value={userName}
                    onChange={(e) => handleUserNameChange(e.target.value)}
                    onFocus={() => setShowSuggestions(true)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ej: Lic. Victor Medina"
                    required
                  />
                  
                  {showSuggestions && filteredLawyers.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                      {filteredLawyers.map((lawyer, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => selectLawyer(lawyer)}
                          className="w-full text-left px-4 py-3 hover:bg-blue-50 hover:text-blue-700 transition-colors text-sm border-b border-gray-100 last:border-b-0"
                        >
                          {lawyer}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-2">
                  <FileText className="h-4 w-4 inline mr-1" />
                  Propósito/Destino
                </label>
                <input
                  type="text"
                  id="purpose"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: Firma en notaría, reunión con cliente"
                  required
                />
              </div>
            </>
          ) : (
            <div className="mb-6">
              <label htmlFor="returnNotes" className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="h-4 w-4 inline mr-1" />
                Notas de Devolución (Opcional)
              </label>
              <textarea
                id="returnNotes"
                value={returnNotes}
                onChange={(e) => setReturnNotes(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Estado del equipo, incidencias, etc."
              />
            </div>
          )}

          <div className="flex items-center text-sm text-gray-500 mb-6">
            <Calendar className="h-4 w-4 mr-1" />
            <span>Fecha y hora: {new Date().toLocaleString('es-ES')}</span>
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!isReturning && (!userName.trim() || !purpose.trim())}
              className={`flex-1 px-4 py-3 rounded-xl text-white font-medium transition-all shadow-sm hover:shadow-md ${
                isReturning
                  ? 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed'
              }`}
            >
              {isReturning ? 'Confirmar Devolución' : 'Asignar Laptop'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
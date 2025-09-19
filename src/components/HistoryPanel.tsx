import React, { useState, useMemo } from 'react';
import { Search, Filter, Download, Calendar, User, FileText, Clock, Laptop } from 'lucide-react';
import { Laptop as LaptopType, Assignment } from '../types';

interface HistoryPanelProps {
  laptops: LaptopType[];
  assignments: Assignment[];
}

export default function HistoryPanel({ laptops, assignments }: HistoryPanelProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLaptop, setFilterLaptop] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'laptop' | 'user'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredAndSortedAssignments = useMemo(() => {
    let filtered = assignments.filter(assignment => {
      const laptop = laptops.find(l => l.id === assignment.laptopId);
      const matchesSearch = 
        assignment.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (assignment.biometricSerial && assignment.biometricSerial.toLowerCase().includes(searchTerm.toLowerCase())) ||
        laptop?.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.laptopId.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesLaptop = !filterLaptop || assignment.laptopId === filterLaptop;
      
      return matchesSearch && matchesLaptop;
    });

    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.assignedAt).getTime() - new Date(b.assignedAt).getTime();
          break;
        case 'laptop':
          comparison = a.laptopId.localeCompare(b.laptopId);
          break;
        case 'user':
          comparison = a.userName.localeCompare(b.userName);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [assignments, laptops, searchTerm, filterLaptop, sortBy, sortOrder]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateDuration = (assignedAt: string, returnedAt: string | null) => {
    const start = new Date(assignedAt);
    const end = returnedAt ? new Date(returnedAt) : new Date();
    const diffMs = end.getTime() - start.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) {
      return `${diffDays}d ${diffHours % 24}h`;
    }
    return `${diffHours}h`;
  };

  const exportToCSV = () => {
    const headers = ['Laptop', 'Usuario', 'Propósito', 'Fecha Asignación', 'Fecha Devolución', 'Duración', 'Estado', 'Notas'];
    const csvData = filteredAndSortedAssignments.map(assignment => {
      const laptop = laptops.find(l => l.id === assignment.laptopId);
      return [
        assignment.laptopId,
        assignment.userName,
        assignment.purpose || 'Uso general',
        formatDate(assignment.assignedAt),
        assignment.returnedAt ? formatDate(assignment.returnedAt) : 'En uso',
        calculateDuration(assignment.assignedAt, assignment.returnedAt),
        assignment.returnedAt ? 'Devuelto' : 'En uso',
        assignment.returnNotes || ''
      ];
    });

    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `historial_laptops_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Filters and Search */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Buscar por usuario, propósito o laptop..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <select
            value={filterLaptop}
            onChange={(e) => setFilterLaptop(e.target.value)}
            className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Todas las laptops</option>
            {laptops.map(laptop => (
              <option key={laptop.id} value={laptop.id}>{laptop.id}</option>
            ))}
          </select>

          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [sort, order] = e.target.value.split('-');
              setSortBy(sort as 'date' | 'laptop' | 'user');
              setSortOrder(order as 'asc' | 'desc');
            }}
            className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="date-desc">Fecha (más reciente)</option>
            <option value="date-asc">Fecha (más antigua)</option>
            <option value="laptop-asc">Laptop (A-Z)</option>
            <option value="laptop-desc">Laptop (Z-A)</option>
            <option value="user-asc">Usuario (A-Z)</option>
            <option value="user-desc">Usuario (Z-A)</option>
          </select>

          <button
            onClick={exportToCSV}
            className="inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl hover:from-emerald-700 hover:to-green-700 transition-all shadow-sm hover:shadow-md font-medium"
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-gray-200/50">
          <div className="text-2xl font-bold text-blue-600">{assignments.length}</div>
          <div className="text-sm text-gray-600">Total Asignaciones</div>
        </div>
        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-gray-200/50">
          <div className="text-2xl font-bold text-orange-600">
            {assignments.filter(a => !a.returnedAt).length}
          </div>
          <div className="text-sm text-gray-600">Actualmente en Uso</div>
        </div>
        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-gray-200/50">
          <div className="text-2xl font-bold text-green-600">
            {assignments.filter(a => a.returnedAt).length}
          </div>
          <div className="text-sm text-gray-600">Devueltas</div>
        </div>
        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-gray-200/50">
          <div className="text-2xl font-bold text-purple-600">
            {new Set(assignments.map(a => a.userName)).size}
          </div>
          <div className="text-sm text-gray-600">Usuarios Únicos</div>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Laptop
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Biométrico
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Asignación
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Devolución
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duración
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAndSortedAssignments.map((assignment) => {
                const laptop = laptops.find(l => l.id === assignment.laptopId);
                return (
                  <tr key={assignment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Laptop className="h-4 w-4 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {assignment.laptopId}
                          </div>
                          <div className="text-sm text-gray-500">
                            {laptop?.brand} {laptop?.model}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-gray-400 mr-2" />
                        <div className="text-sm text-gray-900">{assignment.userName}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-start">
                        <FileText className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
                        <div className="text-sm text-gray-900">{assignment.purpose || 'Uso general'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <div className="text-sm text-gray-900">
                          {formatDate(assignment.assignedAt)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {assignment.returnedAt ? (
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                          <div className="text-sm text-gray-900">
                            {formatDate(assignment.returnedAt)}
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-orange-600 font-medium">En uso</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-gray-400 mr-2" />
                        <div className="text-sm text-gray-900">
                          {calculateDuration(assignment.assignedAt, assignment.returnedAt)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        assignment.returnedAt
                          ? 'bg-green-100 text-green-800'
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {assignment.returnedAt ? 'Devuelto' : 'En uso'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredAndSortedAssignments.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">No se encontraron registros que coincidan con los filtros.</div>
          </div>
        )}
      </div>
    </div>
  );
}
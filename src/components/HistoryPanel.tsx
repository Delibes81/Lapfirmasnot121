import React, { useState, useMemo, useEffect } from 'react';
import { Search, Download, Calendar, User, Clock, Laptop, History, ChevronLeft, ChevronRight } from 'lucide-react';
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Volver a la primera página cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterLaptop, sortBy, sortOrder]);

  const filteredAndSortedAssignments = useMemo(() => {
    let filtered = assignments.filter(assignment => {
      const laptop = laptops.find(l => l.id === assignment.laptopId);
      const matchesSearch = 
        (assignment.userName && assignment.userName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (assignment.assignedIntern && assignment.assignedIntern.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (assignment.biometricSerial && assignment.biometricSerial.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (laptop?.model.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (assignment.laptopId.toLowerCase().includes(searchTerm.toLowerCase()));
      
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
          const nameA = a.userName || a.assignedIntern || '';
          const nameB = b.userName || b.assignedIntern || '';
          comparison = nameA.localeCompare(nameB);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [assignments, laptops, searchTerm, filterLaptop, sortBy, sortOrder]);

  const totalPages = Math.ceil(filteredAndSortedAssignments.length / itemsPerPage);
  
  const paginatedAssignments = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedAssignments.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedAssignments, currentPage, itemsPerPage]);

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
    const headers = ['Laptop', 'Usuario', 'Pasante', 'Biométrico', 'Fecha Asignación', 'Fecha Devolución', 'Duración', 'Estado'];
    const csvData = filteredAndSortedAssignments.map(assignment => {
      return [
        assignment.laptopId,
        assignment.userName || '-',
        assignment.assignedIntern || '-',
        assignment.biometricSerial || '-',
        formatDate(assignment.assignedAt),
        assignment.returnedAt ? formatDate(assignment.returnedAt) : 'En uso',
        calculateDuration(assignment.assignedAt, assignment.returnedAt),
        assignment.returnedAt ? 'Devuelto' : 'En uso'
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
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Filters and Search - Glassmorphism */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-sm border border-white/50 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 group-focus-within:text-notaria-600 transition-colors" />
            <input
              type="text"
              placeholder="Buscar equipo, usuario, pasante..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-3 text-sm border border-gray-200 rounded-xl bg-white/70 backdrop-blur-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-notaria-500/50 focus:border-notaria-500 focus:bg-white transition-all"
            />
          </div>

          <select
            value={filterLaptop}
            onChange={(e) => setFilterLaptop(e.target.value)}
            className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-white/70 backdrop-blur-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-notaria-500/50 focus:border-notaria-500 focus:bg-white transition-all"
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
            className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-white/70 backdrop-blur-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-notaria-500/50 focus:border-notaria-500 focus:bg-white transition-all"
          >
            <option value="date-desc">Fecha (recientes)</option>
            <option value="date-asc">Fecha (antiguas)</option>
            <option value="laptop-asc">Laptop (A-Z)</option>
            <option value="laptop-desc">Laptop (Z-A)</option>
            <option value="user-asc">Usuario (A-Z)</option>
            <option value="user-desc">Usuario (Z-A)</option>
          </select>

          <button
            onClick={exportToCSV}
            className="flex items-center justify-center px-4 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white text-sm rounded-xl hover:from-emerald-700 hover:to-green-700 transition-all shadow-sm hover:shadow-md font-medium"
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </button>
        </div>
      </div>

      {/* Bento Grid Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-2">
        {/* Total Registros */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 border border-white shadow-md shadow-gray-200/40 relative overflow-hidden group hover:-translate-y-0.5 transition-transform duration-300">
          <div className="absolute -right-4 -top-4 w-16 h-16 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-full blur-xl group-hover:bg-blue-100 transition-colors"></div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-blue-500/30 mb-2">
              <History className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-0.5">Total Asignaciones</p>
              <p className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-gray-900 to-gray-700 leading-tight">{assignments.length}</p>
            </div>
          </div>
        </div>

        {/* Currently in Use */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 border border-white shadow-md shadow-orange-200/30 relative overflow-hidden group hover:-translate-y-0.5 transition-transform duration-300">
          <div className="absolute -right-4 -top-4 w-16 h-16 bg-gradient-to-br from-orange-50 to-amber-100 rounded-full blur-xl group-hover:bg-orange-100 transition-colors"></div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-md shadow-orange-500/30 mb-2 text-white">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-0.5">En Uso Activo</p>
              <p className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-gray-900 to-gray-700 leading-tight">
                {assignments.filter(a => !a.returnedAt).length}
              </p>
            </div>
          </div>
        </div>

        {/* Returned */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 border border-white shadow-md shadow-emerald-200/30 relative overflow-hidden group hover:-translate-y-0.5 transition-transform duration-300">
          <div className="absolute -right-4 -top-4 w-16 h-16 bg-gradient-to-br from-emerald-50 to-teal-100 rounded-full blur-xl group-hover:bg-emerald-100 transition-colors"></div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-md shadow-emerald-500/30 mb-2 text-white">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-0.5">Devueltas</p>
              <p className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-gray-900 to-gray-700 leading-tight">
                {assignments.filter(a => a.returnedAt).length}
              </p>
            </div>
          </div>
        </div>

        {/* Unique Users */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 border border-white shadow-md shadow-purple-200/30 relative overflow-hidden group hover:-translate-y-0.5 transition-transform duration-300">
          <div className="absolute -right-4 -top-4 w-16 h-16 bg-gradient-to-br from-purple-50 to-fuchsia-100 rounded-full blur-xl group-hover:bg-purple-100 transition-colors"></div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-fuchsia-600 rounded-xl flex items-center justify-center shadow-md shadow-purple-500/30 mb-2 text-white">
              <User className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-0.5">Usuarios Únicos</p>
              <p className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-gray-900 to-gray-700 leading-tight">
                {new Set(assignments.map(a => a.userName || a.assignedIntern)).size}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* History Table - Glassmorphism */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg shadow-gray-200/30 border border-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50/80">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">
                  Equipo
                </th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">
                  Asignado a
                </th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">
                  Fecha Asignación
                </th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">
                  Estado y Devolución
                </th>
              </tr>
            </thead>
            <tbody className="bg-transparent divide-y divide-gray-100">
              {paginatedAssignments.map((assignment) => {
                const laptop = laptops.find(l => l.id === assignment.laptopId);
                return (
                  <tr key={assignment.id} className="hover:bg-blue-50/40 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300 mr-3">
                          <Laptop className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <div className="text-sm font-extrabold text-gray-900">
                            {assignment.laptopId}
                          </div>
                          <div className="text-xs font-medium text-gray-500">
                            {laptop?.brand} {laptop?.model}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex flex-col space-y-1.5 align-middle justify-center">
                        {assignment.userName && assignment.userName !== 'Asignación Temporal' && (
                          <div className="flex items-center">
                            <div className="w-5 h-5 rounded-md bg-notaria-50 text-notaria-600 flex items-center justify-center shrink-0 mr-2 border border-notaria-100">
                              <User className="h-3 w-3" />
                            </div>
                            <span className="text-sm font-bold text-notaria-900 truncate">
                              {assignment.userName}
                            </span>
                          </div>
                        )}
                        {assignment.assignedIntern && (
                          <div className="flex items-center mt-1">
                            <div className="w-5 h-5 rounded-md bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mr-2 border border-purple-100">
                              <User className="h-3 w-3" />
                            </div>
                            <span className="text-xs font-bold text-purple-900 truncate">
                              {assignment.assignedIntern}
                            </span>
                          </div>
                        )}
                        {(!assignment.userName || assignment.userName === 'Asignación Temporal') && !assignment.assignedIntern && (
                          <span className="text-xs text-gray-400 font-medium">-</span>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="flex items-center text-sm font-semibold text-gray-900">
                          <Calendar className="h-3.5 w-3.5 text-gray-400 mr-1.5" />
                          {formatDate(assignment.assignedAt)}
                        </div>
                        <div className="flex items-center text-xs text-gray-500 mt-1 font-medium">
                          <Clock className="h-3 w-3 text-gray-400 mr-1" />
                          Duración: {calculateDuration(assignment.assignedAt, assignment.returnedAt)}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col items-start gap-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          assignment.returnedAt
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200 shadow-sm'
                        }`}>
                          {assignment.returnedAt ? 'Devuelto' : 'En uso'}
                        </span>
                        {assignment.returnedAt && (
                          <div className="text-xs text-gray-500 mt-1 flex items-center font-medium">
                            <Calendar className="h-3.5 w-3.5 text-gray-400 mr-1.5" />
                            {formatDate(assignment.returnedAt)}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredAndSortedAssignments.length === 0 && (
             <div className="col-span-full py-16 text-center text-gray-500 bg-gray-50/50 backdrop-blur-sm">
               <Search className="h-10 w-10 mx-auto mb-3 text-gray-300" />
               <p className="text-sm font-medium">No se encontraron registros en el historial que coincidan con los filtros.</p>
             </div>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-100/50 bg-gray-50/30 backdrop-blur-sm">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-200 text-sm font-medium rounded-xl text-gray-700 bg-white shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Anterior
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-200 text-sm font-medium rounded-xl text-gray-700 bg-white shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Siguiente
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Mostrando <span className="font-bold text-gray-900">{(currentPage - 1) * itemsPerPage + 1}</span> a <span className="font-bold text-gray-900">{Math.min(currentPage * itemsPerPage, filteredAndSortedAssignments.length)}</span> de <span className="font-bold text-gray-900">{filteredAndSortedAssignments.length}</span> resultados
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-xl shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-xl border border-gray-200 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <span className="sr-only">Anterior</span>
                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    if (
                      page === 1 || 
                      page === totalPages || 
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-all ${
                            currentPage === page
                              ? 'z-10 bg-notaria-50 border-notaria-500 text-notaria-700 font-bold'
                              : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    }
                    
                    if (
                      page === currentPage - 2 || 
                      page === currentPage + 2
                    ) {
                      return <span key={page} className="relative inline-flex items-center px-4 py-2 border border-gray-200 bg-white text-sm font-medium text-gray-400">...</span>;
                    }
                    
                    return null;
                  })}

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-xl border border-gray-200 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <span className="sr-only">Siguiente</span>
                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
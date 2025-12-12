'use client';

import { useState } from "react";
import { Search, Trash2, Edit2, Calendar, MapPin, User, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { deleteAssignment } from "../../actions/assignment-actions";
import EditAssignmentModal from "../edit-assignment-modal";

interface Props {
    initialAssignments: any[];
    technicians: any[];
    serviceTypes: any[];
}

export default function AssignmentsTable({ initialAssignments, technicians, serviceTypes }: Props) {
    const [assignments, setAssignments] = useState(initialAssignments);
    const [filterTech, setFilterTech] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [editingItem, setEditingItem] = useState<any | null>(null);

    // Filtrado en tiempo real
    const filtered = initialAssignments.filter(a => {
        const matchesTech = filterTech ? a.technician_id === filterTech : true;
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
            a.client_name?.toLowerCase().includes(searchLower) || 
            a.machine_model?.toLowerCase().includes(searchLower) ||
            a.client_location?.toLowerCase().includes(searchLower);
        
        return matchesTech && matchesSearch;
    });

    const handleDelete = async (id: string) => {
        if (confirm("¿Estás seguro de eliminar esta tarea?")) {
            await deleteAssignment(id);
            window.location.reload(); 
        }
    };

    const getStatusBadge = (status: string) => {
        switch(status) {
            case 'finalizado': return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><CheckCircle className="w-3 h-3"/> Finalizado</span>;
            case 'en_progreso': return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><Clock className="w-3 h-3"/> En Progreso</span>;
            case 'cancelado': return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold flex items-center gap-1 w-fit">Cancelado</span>;
            default: return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><AlertCircle className="w-3 h-3"/> Abierto</span>;
        }
    };

    // --- FUNCIÓN A PRUEBA DE ZONAS HORARIAS ---
    // En lugar de convertir a fecha (que cambia la hora), manipulamos el texto.
    const formatDateSafe = (dateString: string) => {
        if (!dateString) return '-';
        // El string viene como "2025-12-15T14:00:00+00..."
        // Tomamos solo la parte de la fecha: "2025-12-15"
        const datePart = dateString.split('T')[0]; 
        if (!datePart) return dateString;

        // Separamos Año, Mes y Día
        const [year, month, day] = datePart.split('-');
        
        // Retornamos en formato argentino
        return `${day}/${month}/${year}`;
    };

    return (
        <div className="space-y-4">
            {/* Barra de Filtros */}
            <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                    <input 
                        type="text" 
                        placeholder="Buscar cliente, modelo o ciudad..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red/20 outline-none text-sm"
                    />
                </div>
                
                <div className="w-full md:w-64">
                    <div className="relative">
                        <User className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                        <select 
                            value={filterTech} 
                            onChange={(e) => setFilterTech(e.target.value)}
                            className="w-full pl-9 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red/20 outline-none text-sm bg-white appearance-none"
                        >
                            <option value="">Todos los Mecánicos</option>
                            {technicians.map(t => (
                                <option key={t.id} value={t.id}>{t.full_name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Tabla / Lista */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase tracking-wider text-xs">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Estado</th>
                                <th className="px-6 py-4 font-semibold">Cliente / Ubicación</th>
                                <th className="px-6 py-4 font-semibold">Máquina</th>
                                <th className="px-6 py-4 font-semibold">Técnico</th>
                                <th className="px-6 py-4 font-semibold text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filtered.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        {getStatusBadge(item.status)}
                                        <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {/* Usamos la función segura */}
                                            {formatDateSafe(item.assigned_at)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-gray-900">{item.client_name}</div>
                                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                            <MapPin className="w-3 h-3" /> {item.client_location || 'N/A'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium">{item.machine_model}</div>
                                        <div className="text-xs text-gray-500">SN: {item.machine_serial || '-'}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-red-100 text-brand-red flex items-center justify-center text-xs font-bold">
                                                {item.profiles?.full_name?.charAt(0) || '?'}
                                            </div>
                                            <span className="text-gray-700">{item.profiles?.full_name || 'Sin Asignar'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button 
                                                onClick={() => setEditingItem(item)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" 
                                                title="Editar"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(item.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                                                title="Eliminar"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-10 text-center text-gray-400">
                                        No se encontraron tareas con estos filtros.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal de Edición */}
            {editingItem && (
                <EditAssignmentModal 
                    assignment={editingItem} 
                    technicians={technicians}
                    serviceTypes={serviceTypes}
                    onClose={() => {
                        setEditingItem(null);
                        window.location.reload(); 
                    }} 
                />
            )}
        </div>
    );
}
'use client';

import { useState } from "react";
import { X, Save, Loader2, Calendar } from "lucide-react";
import { updateAssignment } from "../actions/assignment-actions";

interface Props {
    assignment: any; 
    technicians: { id: string, full_name: string }[];
    serviceTypes: { id: string, name: string }[];
    onClose: () => void;
}

export default function EditAssignmentModal({ assignment, technicians, serviceTypes, onClose }: Props) {
    const [loading, setLoading] = useState(false);
    
    // Función auxiliar para obtener formato YYYY-MM-DD compatible con input date
    const formatDate = (isoString: string | null) => {
        if (!isoString) return '';
        return new Date(isoString).toISOString().split('T')[0];
    };

    const [formData, setFormData] = useState({
        technician_id: assignment.technician_id,
        service_type_id: assignment.service_type_id,
        client_name: assignment.client_name,
        machine_model: assignment.machine_model,
        machine_serial: assignment.machine_serial || '',
        client_location: assignment.client_location || '',
        notes: assignment.notes || '',
        // Mapeamos assigned_at a start_date para el formulario
        start_date: formatDate(assignment.assigned_at), 
        due_date: formatDate(assignment.due_date),
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        
        // Validación básica: Fin no puede ser antes que Inicio
        if (formData.start_date && formData.due_date && formData.start_date > formData.due_date) {
            alert("La fecha de fin no puede ser anterior a la fecha de inicio.");
            setLoading(false);
            return;
        }

        await updateAssignment(assignment.id, formData);
        setLoading(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 relative animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    Editar Tarea <span className="text-gray-400 font-normal">#{assignment.id.slice(0,6)}</span>
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    
                    {/* Fila 1: Técnico y Servicio */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 block">Técnico</label>
                            <select name="technician_id" value={formData.technician_id} onChange={handleChange} className="w-full p-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-brand-red/20 outline-none text-sm">
                                {technicians.map(t => <option key={t.id} value={t.id}>{t.full_name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 block">Servicio</label>
                            <select name="service_type_id" value={formData.service_type_id} onChange={handleChange} className="w-full p-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-brand-red/20 outline-none text-sm">
                                {serviceTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Sección Fechas (NUEVO) */}
                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                        <div className="flex items-center gap-2 mb-2 text-orange-800">
                            <Calendar className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase">Reprogramación</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-semibold text-orange-700 mb-1 block">Fecha Inicio</label>
                                <input type="date" name="start_date" value={formData.start_date} onChange={handleChange} className="w-full p-2 border border-orange-200 rounded bg-white text-sm focus:outline-none focus:border-orange-400" />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-orange-700 mb-1 block">Fecha Fin</label>
                                <input type="date" name="due_date" value={formData.due_date} onChange={handleChange} className="w-full p-2 border border-orange-200 rounded bg-white text-sm focus:outline-none focus:border-orange-400" />
                            </div>
                        </div>
                    </div>

                    {/* Cliente */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">Cliente</label>
                        <input name="client_name" value={formData.client_name} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-brand-red/20 outline-none" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-1">Modelo</label>
                            <input name="machine_model" value={formData.machine_model} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-brand-red/20 outline-none" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-1">Serie</label>
                            <input name="machine_serial" value={formData.machine_serial} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-brand-red/20 outline-none" />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">Ubicación</label>
                        <input name="client_location" value={formData.client_location} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-brand-red/20 outline-none" />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">Notas</label>
                        <textarea name="notes" value={formData.notes} onChange={handleChange} rows={3} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-brand-red/20 outline-none" />
                    </div>

                    <button disabled={loading} className="w-full btn-primary py-3 flex justify-center items-center gap-2 shadow-md hover:shadow-lg transition-all">
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> Guardar Cambios</>}
                    </button>
                </form>
            </div>
        </div>
    );
}
'use client';

import { useState } from "react";
import { User, Wrench, Factory, MapPin, Calendar, Send, Loader2, Map as MapIcon } from "lucide-react";
import { AssignmentData } from "@/lib/schemas/assignment-schema";
import { createAssignment } from "../actions/assignment-actions"; 
import { calculateDistanceMock } from "@/app/dashboard/actions/map-actions";

interface FormProps {
    technicians: { id: string, full_name: string }[];
    serviceTypes: { id: string, name: string }[];
}

interface FormDataState {
    technician_id: string;
    service_type_id: string;
    client_name: string;
    machine_model: string;
    machine_serial: string;
    client_location: string;
    origin_location: string;
    distance_km: number;
    notes: string;
    due_date: string;
}

// Interfaz para la respuesta de la Server Action
interface CreateAssignmentResponse {
    error?: boolean;
    success?: boolean;
    message: string;
    errors?: Record<string, string[] | undefined>;
}

export default function CreateAssignmentForm({ technicians, serviceTypes }: FormProps) {
    const [formData, setFormData] = useState<FormDataState>({
        technician_id: '',
        service_type_id: '',
        client_name: '',
        machine_model: '',
        machine_serial: '',
        client_location: '',
        origin_location: 'Planta Crucianelli, Armstrong', 
        distance_km: 0,
        notes: '',
        due_date: '',
    });
    
    const [loading, setLoading] = useState(false);
    const [calculatingMap, setCalculatingMap] = useState(false);
    const [errors, setErrors] = useState<Record<string, string[] | undefined>>({});
    const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: undefined }));
        setStatusMessage(null);
    };

    const handleCalculateDistance = async () => {
        if (!formData.client_location) {
            setErrors(prev => ({ ...prev, client_location: ["Ingrese una ubicación para calcular."] }));
            return;
        }

        setCalculatingMap(true);
        const result = await calculateDistanceMock(formData.origin_location, formData.client_location);
        
        if (result.error) {
            setStatusMessage({ type: 'error', message: "Error al calcular distancia." });
        } else {
            setFormData(prev => ({ ...prev, distance_km: result.km }));
        }
        setCalculatingMap(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        setStatusMessage(null);

        // --- CORRECCIÓN AQUÍ ---
        // client_location y origin_location NO pueden ser null porque el Schema espera string.
        // Solo machine_serial y due_date son opcionales (nullable).
        const assignmentData: AssignmentData = {
            ...formData,
            machine_serial: formData.machine_serial || null,
            due_date: formData.due_date || null,
            // Estos campos deben ir tal cual (string), Zod validará si están vacíos.
            client_location: formData.client_location, 
            origin_location: formData.origin_location,
        };

        const result = (await createAssignment(assignmentData)) as CreateAssignmentResponse;

        if (result.error) {
            if (result.errors) {
                setErrors(result.errors);
                setStatusMessage({ type: 'error', message: "Revisa los campos con errores." });
            } else {
                setStatusMessage({ type: 'error', message: result.message });
            }
        } else {
            setStatusMessage({ type: 'success', message: result.message });
            // Reset parcial
            setFormData(prev => ({
                ...prev,
                client_name: '',
                machine_model: '',
                machine_serial: '',
                client_location: '',
                distance_km: 0,
                notes: '',
                due_date: '',
            }));
        }

        setLoading(false);
    };

    const inputClass = (name: keyof FormDataState) => `w-full p-2.5 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red outline-none transition-all ${errors[name] ? 'border-status-error' : 'border-gray-300'}`;
    const errorText = (name: keyof FormDataState) => errors[name] ? <p className="text-xs text-status-error mt-1">{errors[name]![0]}</p> : null;

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            
            {statusMessage && (
                <div className={`p-3 rounded-lg text-sm font-medium ${statusMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-status-error'}`}>
                    {statusMessage.message}
                </div>
            )}

            {/* 1. Asignación */}
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                        <User className="w-4 h-4 text-brand-red" /> Técnico
                    </label>
                    <select name="technician_id" value={formData.technician_id} onChange={handleChange} className={inputClass('technician_id')}>
                        <option value="">Seleccionar...</option>
                        {technicians.map((t) => (
                            <option key={t.id} value={t.id}>{t.full_name}</option>
                        ))}
                    </select>
                    {errorText('technician_id')}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                        <Wrench className="w-4 h-4 text-brand-red" /> Servicio
                    </label>
                    <select name="service_type_id" value={formData.service_type_id} onChange={handleChange} className={inputClass('service_type_id')}>
                        <option value="">Seleccionar...</option>
                        {serviceTypes.map((t) => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                    </select>
                    {errorText('service_type_id')}
                </div>
            </div>

            {/* 2. Cliente y Máquina */}
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider pt-2 border-t border-gray-100">Cliente</h3>
            
            <div>
                <input type="text" name="client_name" value={formData.client_name} onChange={handleChange} className={inputClass('client_name')} placeholder="Razón Social / Nombre" />
                {errorText('client_name')}
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <input type="text" name="machine_model" value={formData.machine_model} onChange={handleChange} className={inputClass('machine_model')} placeholder="Modelo Máquina" />
                    {errorText('machine_model')}
                </div>
                <div>
                    <input type="text" name="machine_serial" value={formData.machine_serial} onChange={handleChange} className={inputClass('machine_serial')} placeholder="N° Serie (Opcional)" />
                </div>
            </div>

            {/* 3. LOGÍSTICA Y MAPAS (SECCIÓN NUEVA FASE 4) */}
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 space-y-3">
                <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider flex items-center gap-2">
                    <MapIcon className="w-4 h-4" /> Logística (Calculadora)
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                        <label className="text-xs text-blue-700 font-semibold mb-1 block">Origen</label>
                        <input type="text" name="origin_location" value={formData.origin_location} onChange={handleChange} className="w-full p-2 bg-white border border-blue-200 rounded text-sm" />
                    </div>
                    <div>
                        <label className="text-xs text-blue-700 font-semibold mb-1 block">Destino / Ubicación Cliente</label>
                        <input type="text" name="client_location" value={formData.client_location} onChange={handleChange} className="w-full p-2 bg-white border border-blue-200 rounded text-sm" placeholder="Ej: Pergamino, Buenos Aires" />
                        {errorText('client_location')}
                    </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                    <button 
                        type="button" 
                        onClick={handleCalculateDistance}
                        disabled={calculatingMap || !formData.client_location}
                        className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 transition-colors flex items-center gap-1 disabled:opacity-50 shadow-sm"
                    >
                        {calculatingMap ? <Loader2 className="w-3 h-3 animate-spin" /> : <MapIcon className="w-3 h-3" />}
                        {calculatingMap ? 'Calculando...' : 'Calcular Ruta'}
                    </button>

                    <div className="flex items-center gap-2 text-blue-900">
                        <span className="text-xs uppercase tracking-wide opacity-70">Distancia Est.:</span>
                        <span className="text-lg font-bold">{formData.distance_km} km</span>
                    </div>
                </div>
            </div>

            {/* Notas */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
                <textarea name="notes" value={formData.notes} onChange={handleChange} className={inputClass('notes')} rows={2} placeholder="Descripción de la tarea..." />
                {errorText('notes')}
            </div>

            {/* Fecha Límite */}
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Límite</label>
                <input type="date" name="due_date" value={formData.due_date} onChange={handleChange} className={inputClass('due_date')} />
            </div>

            <button type="submit" disabled={loading} className="w-full btn-primary py-3 flex items-center justify-center gap-2 font-bold tracking-wide shadow-md shadow-red-200">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                {loading ? 'Creando Asignación...' : 'Confirmar Asignación'}
            </button>
        </form>
    );
}
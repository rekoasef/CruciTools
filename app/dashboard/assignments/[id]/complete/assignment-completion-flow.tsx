'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Link as LinkIcon, AlertTriangle, Loader2, CheckCircle, Clock, Wrench, Calendar, Play } from "lucide-react";
import { updateAssignmentStatus, linkReportToAssignment } from "../../../actions/assignment-actions";
import { ServiceReportRow, AssignmentRow } from "../../../actions/service-queries";
import { format } from "date-fns";
import { es } from "date-fns/locale";

// --- Tipado de Datos ---
type AssignmentDetailRow = AssignmentRow & {
    profiles: { full_name: string } | null;
    service_types: { name: string } | null;
};

type UnlinkedReportRow = Pick<ServiceReportRow, 'id' | 'client_name' | 'machine_model' | 'created_at'>;

interface FlowProps {
    assignment: AssignmentDetailRow;
    unlinkedReports: UnlinkedReportRow[];
}

export default function AssignmentCompletionFlow({ assignment: initialAssignment, unlinkedReports }: FlowProps) {
    // Inicializamos el estado
    const [assignment, setAssignment] = useState<AssignmentDetailRow | null>(initialAssignment);
    const [selectedReportId, setSelectedReportId] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const router = useRouter();

    // ---------------------------------------------------------
    // 1. GUARDRAIL DE SEGURIDAD
    // ---------------------------------------------------------
    if (!assignment) {
        return (
            <div className="p-8 bg-red-50 border border-red-200 rounded-xl text-center text-red-700">
                <AlertTriangle className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p className="font-semibold">Error al cargar la asignación</p>
                <p className="text-sm">No se encontraron los datos. Intente volver al menú.</p>
                <button 
                    onClick={() => router.push('/dashboard')}
                    className="mt-4 px-4 py-2 bg-white border border-red-200 rounded text-sm hover:bg-red-50 font-medium"
                >
                    Volver al Dashboard
                </button>
            </div>
        );
    }
    
    // ---------------------------------------------------------
    // 2. LÓGICA DE ESTADO
    // ---------------------------------------------------------
    const isCompleted = assignment?.status === 'finalizado';
    const isInProgress = assignment?.status === 'en_progreso';
    const isAbierto = assignment?.status === 'abierto';


    // --- Manejadores ---
    const handleStartWork = async () => {
        setLoading(true);
        setMessage(null);
        
        const result = await updateAssignmentStatus(assignment.id, 'en_progreso');
        
        if (result.success) {
            setMessage({ type: 'success', text: 'Estado actualizado: En Progreso.' });
            setAssignment(prev => prev ? ({ ...prev, status: 'en_progreso' }) : null);
        } else {
            setMessage({ type: 'error', text: result.message });
        }
        setLoading(false);
    };

    const handleCompleteAssignment = async () => {
        if (!selectedReportId) {
            setMessage({ type: 'error', text: 'Debe seleccionar un reporte finalizado para adjuntar.' });
            return;
        }
        setLoading(true);
        setMessage(null);
        
        const result = await linkReportToAssignment(assignment.id, selectedReportId);

        if (result.success) {
            setMessage({ type: 'success', text: 'Tarea finalizada y reporte adjuntado con éxito.' });
            setAssignment(prev => prev ? ({ ...prev, status: 'finalizado', finished_report_id: selectedReportId }) : null);
            
            setTimeout(() => {
                router.refresh(); 
                router.push('/dashboard');
            }, 2000); 
        } else {
            setMessage({ type: 'error', text: result.message });
        }
        setLoading(false);
    };

    // --- Vista ---
    return (
        <>
            {message && (
                <div className={`p-3 rounded-lg flex items-center gap-2 text-sm font-medium ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-status-error'}`}>
                    {message.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                    {message.text}
                </div>
            )}

            {/* Panel de Información */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 space-y-4">
                <h2 className="text-xl font-bold border-b pb-2 mb-4 text-gray-800">Detalles del Servicio</h2>
                
                <p className="text-sm text-gray-600 flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-brand-red" /> 
                    <strong>Tipo:</strong> {assignment.service_types?.name || 'No especificado'}
                </p>
                <div className="text-sm text-gray-600 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-brand-red" /> 
                    <strong>Asignada el:</strong> 
                    {/* CORRECCIÓN: suppressHydrationWarning para evitar error de zona horaria */}
                    <span suppressHydrationWarning className="ml-1">
                        {assignment.assigned_at ? format(new Date(assignment.assigned_at), 'dd/MM/yyyy', { locale: es }) : 'N/A'}
                    </span>
                </div>
                {assignment.due_date && (
                    <div className="text-sm text-red-600 font-semibold flex items-center gap-2">
                        <Calendar className="w-4 h-4" /> 
                        <strong>Fecha Límite:</strong> 
                        {/* CORRECCIÓN: suppressHydrationWarning */}
                        <span suppressHydrationWarning className="ml-1">
                            {format(new Date(assignment.due_date), 'dd/MM/yyyy', { locale: es })}
                        </span>
                    </div>
                )}

                <div className="pt-4 border-t">
                    <p className="font-semibold text-gray-700 mb-2">Notas del Coordinador:</p>
                    <p className="text-gray-600 italic bg-gray-50 p-3 rounded-lg border border-gray-100">
                        {assignment.notes || 'Sin notas adicionales.'}
                    </p>
                </div>
            </div>

            {/* -------------------------------------- */}
            {/* ETAPA DE EJECUCIÓN */}
            {/* -------------------------------------- */}
            
            <h2 className="text-2xl font-bold text-gray-800 pt-4">Flujo de Trabajo</h2>

            {/* 1. Botón Iniciar Tarea (Si está 'abierto') */}
            {isAbierto && !isCompleted && (
                <div className="p-5 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between shadow-sm">
                    <div className="flex flex-col">
                        <p className="font-semibold text-blue-800">Tarea Pendiente de Inicio</p>
                        <p className="text-xs text-blue-600">Confirma que has comenzado a trabajar.</p>
                    </div>
                    <button 
                        onClick={handleStartWork}
                        disabled={loading}
                        className="btn-primary py-2 px-6 flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
                        {loading ? 'Actualizando...' : 'Iniciar Trabajo'}
                    </button>
                </div>
            )}

            {/* 2. COMPLETAR TAREA (Si está 'en_progreso') */}
            {isInProgress && !isCompleted && (
                <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-xl space-y-4 shadow-sm">
                    <p className="font-semibold text-yellow-800 flex items-center gap-2">
                        <Clock className="w-5 h-5" /> Estado Actual: En Progreso
                    </p>
                    
                    <div className="pt-4 border-t border-yellow-200">
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            Adjuntar Reporte Finalizado
                        </label>
                        <p className="text-xs text-gray-500 mb-3">
                            Selecciona el reporte técnico que valida este trabajo. Solo aparecen reportes Finalizados y no enlazados.
                        </p>

                        {/* Selector de Reportes Finalizados */}
                        <div className="flex flex-col md:flex-row gap-3">
                            <select
                                value={selectedReportId}
                                onChange={(e) => setSelectedReportId(e.target.value)}
                                className="flex-1 p-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red outline-none transition-all"
                            >
                                <option value="">-- Seleccionar Reporte --</option>
                                {unlinkedReports.map((report) => (
                                    <option key={report.id} value={report.id}>
                                        {/* También protegemos la fecha en el option aunque es menos crítico */}
                                        {report.client_name} | {report.machine_model} | {format(new Date(report.created_at), 'dd/MM')}
                                    </option>
                                ))}
                            </select>

                            <button 
                                onClick={handleCompleteAssignment}
                                disabled={loading || !selectedReportId}
                                className="md:w-auto w-full btn-primary py-2.5 px-6 flex items-center justify-center gap-2 shadow-md"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <LinkIcon className="w-5 h-5" />}
                                {loading ? 'Finalizando...' : 'Finalizar Tarea'}
                            </button>
                        </div>
                        {unlinkedReports.length === 0 && (
                            <p className="text-xs text-red-500 mt-2">
                                ⚠️ No tienes reportes finalizados disponibles. Crea uno primero desde Nuevo Checklist.
                            </p>
                        )}
                    </div>
                </div>
            )}
            
            {/* 3. Tarea Completada */}
            {isCompleted && (
                <div className="p-5 bg-green-50 border border-green-200 rounded-xl text-green-700 flex items-center gap-3 font-semibold shadow-sm">
                    <CheckCircle className="w-6 h-6" />
                    <div>
                        <p>Tarea Completada Exitosamente</p>
                        <p className="text-xs font-normal text-green-600">El reporte ha sido vinculado.</p>
                    </div>
                </div>
            )}
        </>
    );
}
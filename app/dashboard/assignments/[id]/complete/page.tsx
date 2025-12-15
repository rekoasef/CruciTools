import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { 
    ArrowLeft, 
    Calendar as CalendarIcon, 
    Clock, 
    MapPin, 
    User, 
    Wrench, 
    FileText, 
    CheckCircle,
    ArrowRight,
    ClipboardList
} from "lucide-react";

import StartAssignmentButton from "./start-button";
import FinishTaskForm from "./finish-form";

const formatDateSafe = (isoString: string | null) => {
    if (!isoString) return '-';
    const datePart = isoString.split('T')[0]; 
    if (!datePart) return '-';
    const [year, month, day] = datePart.split('-');
    return `${day}/${month}/${year}`;
};

// CORRECCIÓN NEXT.JS 15+: params es ahora una Promesa
export default async function AssignmentCompletePage({ params }: { params: Promise<{ id: string }> }) {
    
    // 1. Esperamos a que se resuelvan los parámetros (id de la url)
    const { id } = await params;

    // CORRECCIÓN: Agregamos 'await' aquí
    const supabase = await createClient();
    
    // 2. Usamos el 'id' ya resuelto en la consulta
    const { data: assignment, error } = await supabase
        .from('assignments')
        .select(`
            *,
            profiles ( full_name ),
            service_types ( name )
        `)
        .eq('id', id)
        .single();

    if (error || !assignment) {
        return notFound();
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
            
            {/* Cabecera */}
            <div>
                <Link 
                    href="/dashboard/services" 
                    className="text-sm text-gray-500 hover:text-brand-red mb-4 inline-flex items-center gap-1 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Volver a Mis Tareas
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">
                    Ejecutar Tarea: <span className="text-brand-red">{assignment.client_name}</span>
                </h1>
            </div>

            {/* Tarjeta de Detalles */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <h2 className="font-bold text-gray-800 text-lg">Detalles del Servicio</h2>
                </div>
                
                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-gray-700">
                                <Wrench className="w-5 h-5 text-brand-red" />
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase">Tipo de Servicio</p>
                                    <p className="font-medium">{assignment.service_types?.name}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-gray-700">
                                <Clock className="w-5 h-5 text-brand-red" />
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase">Fecha de Inicio</p>
                                    <p className="font-medium">{formatDateSafe(assignment.assigned_at)}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-gray-700">
                                <User className="w-5 h-5 text-brand-red" />
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase">Técnico</p>
                                    <p className="font-medium">{assignment.profiles?.full_name}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-gray-700">
                                <MapPin className="w-5 h-5 text-brand-red" />
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase">Ubicación</p>
                                    <p className="font-medium">{assignment.client_location || 'No especificada'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {assignment.notes && (
                        <div className="mt-4 bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                            <p className="text-xs font-bold text-yellow-700 uppercase mb-1">Notas:</p>
                            <p className="text-sm text-gray-700 italic">{assignment.notes}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* --- FLUJO DE TRABAJO --- */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900">Gestión de Tarea</h2>
                
                {/* 1. TAREA ABIERTA: BOTÓN INICIAR */}
                {assignment.status === 'abierto' && (
                    <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
                        <div>
                            <h3 className="font-bold text-blue-900">Tarea Pendiente de Inicio</h3>
                            <p className="text-sm text-blue-700">Confirma que estás en el lugar o comenzando el trabajo.</p>
                        </div>
                        <StartAssignmentButton assignmentId={assignment.id} />
                    </div>
                )}

                {/* 2. EN PROGRESO: CREAR O VINCULAR */}
                {assignment.status === 'en_progreso' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* TARJETA A: IR A CREAR CHECKLIST */}
                        <div className="bg-white p-6 rounded-xl border-2 border-dashed border-gray-300 hover:border-brand-red/50 transition-colors flex flex-col justify-center items-center text-center space-y-4">
                            <div className="bg-gray-100 p-4 rounded-full">
                                <ClipboardList className="w-8 h-8 text-gray-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">1. Completar Checklist</h3>
                                <p className="text-sm text-gray-500 max-w-xs mx-auto">
                                    Ve a la sección de checklists, selecciona el modelo y llénalo.
                                </p>
                            </div>
                            <Link 
                                href="/dashboard/checklists" 
                                className="text-brand-red font-bold hover:underline flex items-center gap-1"
                            >
                                Ir a Checklists <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>

                        {/* TARJETA B: VINCULAR Y FINALIZAR */}
                        <FinishTaskForm assignmentId={assignment.id} />

                    </div>
                )}

                {/* 3. FINALIZADO */}
                {assignment.status === 'finalizado' && (
                    <div className="bg-green-50 border border-green-100 p-8 rounded-xl flex flex-col items-center justify-center text-center shadow-sm animate-in zoom-in-95">
                        <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                        <h3 className="font-bold text-green-900 text-2xl">¡Tarea Finalizada!</h3>
                        <p className="text-green-700 mb-6">
                            El reporte ha sido vinculado correctamente a esta asignación.
                        </p>
                        <div className="flex gap-4">
                            <Link href="/dashboard/services" className="bg-white border border-green-200 text-green-700 px-4 py-2 rounded-lg font-medium hover:bg-green-50 transition-colors">
                                Volver al listado
                            </Link>
                            {assignment.finished_report_id && (
                                <Link href={`/dashboard/reports/${assignment.finished_report_id}`} className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2">
                                    <FileText className="w-4 h-4" /> Ver Reporte
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
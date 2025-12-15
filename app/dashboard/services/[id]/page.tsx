import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, MapPin, User, Wrench, FileText, CheckCircle } from "lucide-react";

// Helper para formato de fecha
const formatDateSafe = (isoString: string | null) => {
    if (!isoString) return '-';
    const datePart = isoString.split('T')[0]; 
    if (!datePart) return '-';
    const [year, month, day] = datePart.split('-');
    return `${day}/${month}/${year}`;
};

// CORRECCIÓN NEXT.JS 15+: params es Promise
export default async function ServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
    
    // 1. Await params
    const { id } = await params;

    // CORRECCIÓN: Agregamos 'await' aquí
    const supabase = await createClient();
    
    // 2. Consulta de la asignación/servicio
    const { data: assignment, error } = await supabase
        .from('assignments')
        .select(`
            *,
            profiles ( full_name, email, role ),
            service_types ( name )
        `)
        .eq('id', id)
        .single();

    if (error || !assignment) {
        return notFound();
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
            {/* Header */}
            <div>
                <Link 
                    href="/dashboard/services" 
                    className="text-sm text-gray-500 hover:text-brand-red mb-4 inline-flex items-center gap-1 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Volver al listado
                </Link>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Detalle de Servicio
                    </h1>
                    
                    {/* Badge de Estado */}
                    <span className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide w-fit ${
                        assignment.status === 'finalizado' ? 'bg-green-100 text-green-700' :
                        assignment.status === 'en_progreso' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                    }`}>
                        {assignment.status.replace('_', ' ')}
                    </span>
                </div>
            </div>

            {/* Tarjeta Principal */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="font-bold text-gray-800 text-lg">{assignment.client_name}</h2>
                    <span className="text-xs text-gray-500 font-mono">ID: {assignment.id.slice(0,8)}</span>
                </div>
                
                <div className="p-6 space-y-8">
                    {/* Grid de Datos */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2">Información Técnica</h3>
                            
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-red-50 rounded-lg text-brand-red"><Wrench className="w-5 h-5"/></div>
                                <div>
                                    <p className="text-xs text-gray-500">Tipo de Servicio</p>
                                    <p className="font-medium text-gray-900">{assignment.service_types?.name}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-red-50 rounded-lg text-brand-red"><User className="w-5 h-5"/></div>
                                <div>
                                    <p className="text-xs text-gray-500">Técnico Asignado</p>
                                    <p className="font-medium text-gray-900">{assignment.profiles?.full_name}</p>
                                    <p className="text-xs text-gray-400">{assignment.profiles?.email}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2">Ubicación y Fechas</h3>
                            
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><MapPin className="w-5 h-5"/></div>
                                <div>
                                    <p className="text-xs text-gray-500">Lugar / Distancia</p>
                                    <p className="font-medium text-gray-900">{assignment.client_location || 'N/A'}</p>
                                    {assignment.distance_km && <p className="text-xs text-gray-400">{assignment.distance_km} km</p>}
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Calendar className="w-5 h-5"/></div>
                                <div>
                                    <p className="text-xs text-gray-500">Fechas</p>
                                    <p className="font-medium text-gray-900">Inicio: {formatDateSafe(assignment.assigned_at)}</p>
                                    <p className="text-xs text-gray-400">Fin: {formatDateSafe(assignment.due_date)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Datos de Máquina */}
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <h3 className="text-sm font-bold text-gray-700 mb-2">Máquina</h3>
                        <div className="flex gap-4">
                            <div>
                                <p className="text-xs text-gray-400 uppercase">Modelo</p>
                                <p className="font-bold">{assignment.machine_model}</p>
                            </div>
                            {assignment.machine_serial && (
                                <div>
                                    <p className="text-xs text-gray-400 uppercase">Serie</p>
                                    <p className="font-bold">{assignment.machine_serial}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Notas */}
                    {assignment.notes && (
                        <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 text-sm text-yellow-800">
                            <strong>Notas:</strong> {assignment.notes}
                        </div>
                    )}
                </div>

                {/* Footer con Acciones */}
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex flex-wrap gap-3">
                    {/* Botón para ver reporte si está finalizado */}
                    {assignment.status === 'finalizado' && assignment.finished_report_id && (
                        <Link 
                            href={`/dashboard/reports/${assignment.finished_report_id}`}
                            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-700 transition-colors"
                        >
                            <FileText className="w-4 h-4" /> Ver Reporte Vinculado
                        </Link>
                    )}

                    {/* Botón para ir a ejecutar si soy el mecánico (y no está finalizado) */}
                    {assignment.status !== 'finalizado' && (
                        <Link 
                            href={`/dashboard/assignments/${assignment.id}/complete`}
                            className="flex items-center gap-2 bg-brand-red text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-700 transition-colors"
                        >
                            <Wrench className="w-4 h-4" /> Ir a Panel de Trabajo
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
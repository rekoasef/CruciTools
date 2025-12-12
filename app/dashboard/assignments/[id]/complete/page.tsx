import { createClient } from "@/utils/supabase/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { 
    ArrowLeft, 
    Calendar as CalendarIcon, 
    Clock, 
    MapPin, 
    User, 
    Wrench, 
    FileText, 
    Play,
    CheckCircle
} from "lucide-react";

// --- FUNCIÓN HELPER PARA FECHAS (Evita el error de zona horaria) ---
const formatDateSafe = (isoString: string | null) => {
    if (!isoString) return '-';
    // Tomamos la parte "YYYY-MM-DD" y la cortamos manualmente
    // Esto evita que 'new Date()' reste 3 horas y cambie el día
    const datePart = isoString.split('T')[0]; 
    if (!datePart) return '-';
    
    const [year, month, day] = datePart.split('-');
    return `${day}/${month}/${year}`;
};

export default async function AssignmentCompletePage({ params }: { params: { id: string } }) {
    const supabase = createClient();
    
    // 1. Obtener detalles de la asignación
    const { data: assignment, error } = await supabase
        .from('assignments')
        .select(`
            *,
            profiles ( full_name ),
            service_types ( name )
        `)
        .eq('id', params.id)
        .single();

    if (error || !assignment) {
        return notFound();
    }

    // 2. Determinar el link del checklist según el modelo (simplificado)
    // En el futuro esto podría ser dinámico basado en la base de datos
    const checklistLink = assignment.machine_model?.toLowerCase().includes('drill') 
        ? '/dashboard/checklists/startup/drillor' 
        : '/dashboard/checklists/startup/plantor';

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
                    
                    {/* Info Principal */}
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
                                    {/* USAMOS LA FUNCIÓN SEGURA */}
                                    <p className="font-medium">{formatDateSafe(assignment.assigned_at)}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-gray-700">
                                <CalendarIcon className="w-5 h-5 text-brand-red" />
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase">Fecha Límite (Fin)</p>
                                    {/* USAMOS LA FUNCIÓN SEGURA */}
                                    <p className="font-medium text-brand-red">{formatDateSafe(assignment.due_date)}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-gray-700">
                                <User className="w-5 h-5 text-brand-red" />
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase">Técnico Asignado</p>
                                    <p className="font-medium">{assignment.profiles?.full_name}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-gray-700">
                                <MapPin className="w-5 h-5 text-brand-red" />
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase">Ubicación</p>
                                    <p className="font-medium">{assignment.client_location || 'No especificada'}</p>
                                    {assignment.distance_km && (
                                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full mt-1 inline-block">
                                            {assignment.distance_km} km
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Notas */}
                    {assignment.notes && (
                        <div className="mt-4 bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                            <p className="text-xs font-bold text-yellow-700 uppercase mb-1">Notas del Coordinador:</p>
                            <p className="text-sm text-gray-700 italic">{assignment.notes}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Flujo de Trabajo (Botones) */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900">Flujo de Trabajo</h2>
                
                {assignment.status === 'abierto' && (
                    <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl flex items-center justify-between shadow-sm">
                        <div>
                            <h3 className="font-bold text-blue-900">Tarea Pendiente de Inicio</h3>
                            <p className="text-sm text-blue-700">Confirma que has comenzado a trabajar para cambiar el estado.</p>
                        </div>
                        {/* Nota: Aquí iría un botón conectado a una Server Action para cambiar estado a 'en_progreso' */}
                        <button className="bg-brand-red text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-200 flex items-center gap-2">
                            <Play className="w-4 h-4 fill-current" /> Iniciar Trabajo
                        </button>
                    </div>
                )}

                {assignment.status === 'en_progreso' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Link href={checklistLink} className="group">
                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:border-brand-red hover:shadow-md transition-all flex items-center gap-4">
                                <div className="bg-red-100 p-3 rounded-full text-brand-red group-hover:scale-110 transition-transform">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 group-hover:text-brand-red">Llenar Checklist</h3>
                                    <p className="text-xs text-gray-500">Completar formulario técnico de {assignment.machine_model || 'la máquina'}.</p>
                                </div>
                            </div>
                        </Link>
                    </div>
                )}

                {assignment.status === 'finalizado' && (
                    <div className="bg-green-50 border border-green-100 p-6 rounded-xl flex flex-col items-center justify-center text-center shadow-sm">
                        <CheckCircle className="w-12 h-12 text-green-500 mb-2" />
                        <h3 className="font-bold text-green-900 text-lg">Tarea Finalizada</h3>
                        <p className="text-sm text-green-700">El reporte ha sido generado y vinculado exitosamente.</p>
                        <Link href="/dashboard/services" className="mt-4 text-sm font-medium text-green-700 underline hover:text-green-900">
                            Volver al listado
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
import { createClient } from "@/utils/supabase/server";
import { Wrench, FileText, CheckCircle, Clock, ClipboardList } from "lucide-react";
import Link from "next/link";
// Importamos las funciones de consulta y el componente de tarjeta
import { getServiceReports, getProfileInfo, getAssignmentsList, ServiceReportRow, AssignmentRow } from "@/app/dashboard/actions/service-queries"; 
import AssignmentCard from "../components/assignment-card";

// Función para formatear la fecha a un formato legible
const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).replace('.', ''); 
};

export default async function ServicesPage() {
    // 1. Obtener datos del usuario
    const { user, profile } = await getProfileInfo();
    
    // Si no hay usuario, mostrar mensaje simple (el middleware o layout ya protegen)
    if (!user) return null;

    // 2. Consultar Reportes Finalizados y Asignaciones Pendientes
    const [{ reports, error: reportsError }, { assignments, error: assignmentsError }] = await Promise.all([
        getServiceReports(),
        getAssignmentsList(user.id) // Pasamos el ID para filtrar solo las tareas de este técnico
    ]);

    // Manejo de errores
    if (reportsError || assignmentsError) {
        return (
            <div className="p-6 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg">
                <h1 className="text-xl font-bold mb-2">Error al cargar datos</h1>
                <p>Hubo un problema al conectar con la base de datos. Intente recargar.</p>
            </div>
        );
    }

    const completedReports = reports || [];
    
    // Filtramos las tareas activas (Abiertas o En Progreso)
    const activeAssignments = assignments ? assignments.filter(a => 
        a.status === 'abierto' || a.status === 'en_progreso'
    ) : [];

    return (
        <div className="max-w-5xl mx-auto space-y-10 pb-10">
            
            {/* Cabecera */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Servicios</h1>
                <p className="text-gray-500">
                    Bienvenido, <span className="font-semibold text-gray-800">{profile?.full_name}</span>. 
                    Aquí tienes tus tareas pendientes y tu historial.
                </p>
            </div>

            {/* SECCIÓN 1: TAREAS PENDIENTES (NUEVA SECCIÓN) */}
            <section>
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2 border-b border-gray-200 pb-2">
                    <ClipboardList className="w-6 h-6 text-brand-red" />
                    Tareas Asignadas ({activeAssignments.length})
                </h2>
                
                {activeAssignments.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                        {activeAssignments.map((assignment) => (
                            // showTechnician=false porque el mecánico sabe que son suyas
                            <AssignmentCard key={assignment.id} assignment={assignment} showTechnician={false} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-blue-50 p-8 rounded-xl border border-blue-100 text-center">
                        <Clock className="w-10 h-10 text-blue-300 mx-auto mb-3" />
                        <h3 className="text-lg font-semibold text-blue-800">Todo al día</h3>
                        <p className="text-blue-600">No tienes órdenes de servicio pendientes en este momento.</p>
                    </div>
                )}
            </section>

            {/* SECCIÓN 2: HISTORIAL DE REPORTES */}
            <section>
                <div className="flex justify-between items-end mb-4 border-b border-gray-200 pb-2">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <FileText className="w-6 h-6 text-gray-400" />
                        Historial de Reportes ({completedReports.length})
                    </h2>
                    <Link href="/dashboard/checklists" className="text-sm font-semibold text-brand-red hover:underline">
                        + Nuevo Reporte
                    </Link>
                </div>
                
                {completedReports.length === 0 ? (
                    <div className="text-center p-12 bg-white rounded-xl border border-gray-200 border-dashed text-gray-400">
                        Aún no has finalizado ningún reporte de servicio.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {completedReports.map((report: ServiceReportRow) => (
                            <div key={report.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all group">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700 flex items-center gap-1">
                                        <CheckCircle className="w-3 h-3" /> Finalizado
                                    </span>
                                    <span className="text-xs text-gray-400 group-hover:text-gray-600 transition-colors">
                                        {formatDate(report.created_at)}
                                    </span>
                                </div>
                                
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 capitalize mb-1">
                                            {report.type.replace(/_/g, ' ')}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium text-gray-800">{report.client_name}</span> • {report.machine_model}
                                        </p>
                                    </div>
                                    
                                    <Link 
                                        href={`/dashboard/services/${report.id}`} 
                                        className="btn-primary bg-white text-brand-red border border-brand-red hover:bg-red-50 px-4 py-2 text-sm"
                                    >
                                        Ver
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
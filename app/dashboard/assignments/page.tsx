import { createClient } from "@/utils/supabase/server";
import { getTechnicians, getServiceTypes } from "../actions/service-queries";
import CreateAssignmentForm from "./create-assignment-form";
import AssignmentCard from "../components/assignment-card";
import { ClipboardList, History, LayoutList, Calendar as CalendarIcon, ArrowRight } from "lucide-react";
import Link from "next/link";

// ⚠️ IMPORTANTE: Esto obliga a la página a recargarse siempre desde el servidor
// Si el problema era caché, esto lo soluciona.
export const dynamic = 'force-dynamic';

export default async function AssignmentsPage() {
    const supabase = createClient();
    
    console.log("\n================ INICIO DEBUG PANEL ASIGNACIONES ================");

    // 1. Cargas paralelas de datos
    const [{ data: technicians }, { data: serviceTypes }, responseAssignments] = await Promise.all([
        getTechnicians(),
        getServiceTypes(),
        supabase
            .from('assignments')
            .select(`
                *,
                profiles ( full_name ),
                service_types ( name )
            `)
            .order('created_at', { ascending: false }) // Ordenamos por creación, lo más nuevo arriba
            .limit(50) // Aumentamos el límite por si tienes muchas pruebas viejas
    ]);

    const { data: assignments, error } = responseAssignments;

    // --- LOGS DE DEBUG ---
    if (error) {
        console.error("❌ ERROR CRÍTICO SUPABASE:", error.message);
    } else {
        console.log("✅ Conexión DB Exitosa.");
        console.log(`📊 Tareas totales traídas (Raw): ${assignments?.length || 0}`);
        
        if (assignments && assignments.length > 0) {
            // Mostramos las primeras 3 para ver qué status tienen
            console.log("🔍 Muestreo de las primeras 3 tareas (Las más nuevas):");
            assignments.slice(0, 3).forEach((a, index) => {
                console.log(`   [${index}] Cliente: ${a.client_name} | Status: "${a.status}" | ID: ${a.id}`);
            });
        }
    }

    const allAssignments = assignments || [];
    
    // Filtro Permisivo
    const activeAssignments = allAssignments.filter(a => a.status !== 'finalizado' && a.status !== 'cancelado');
    const historyAssignments = allAssignments.filter(a => a.status === 'finalizado' || a.status === 'cancelado');

    console.log(`📉 Filtros aplicados:`);
    console.log(`   - Activas (No finalizado/cancelado): ${activeAssignments.length}`);
    console.log(`   - Historial: ${historyAssignments.length}`);
    console.log("================ FIN DEBUG =================\n");

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <ClipboardList className="w-7 h-7 text-brand-red" />
                        Panel de Asignaciones
                    </h1>
                    <p className="text-gray-500 text-sm">Gestiona y asigna nuevas tareas de servicio.</p>
                </div>
                
                <div className="flex gap-3">
                    <Link 
                        href="/dashboard/calendar" 
                        className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:text-brand-red transition-colors flex items-center gap-2 text-sm font-medium shadow-sm"
                    >
                        <CalendarIcon className="w-4 h-4" />
                        Ver Agenda
                    </Link>
                    <Link 
                        href="/dashboard/assignments/list" 
                        className="px-4 py-2 bg-brand-red text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 text-sm font-medium shadow-md shadow-red-200"
                    >
                        <LayoutList className="w-4 h-4" />
                        Gestión Completa
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* COLUMNA IZQUIERDA */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 sticky top-4">
                        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-brand-red"></div>
                            Crear Nueva Tarea
                        </h2>
                        
                        <CreateAssignmentForm 
                            technicians={technicians || []} 
                            serviceTypes={serviceTypes || []} 
                        />
                    </div>
                </div>

                {/* COLUMNA DERECHA */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* Tareas Activas */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                Tareas Activas <span className="text-sm font-normal text-gray-400">({activeAssignments.length})</span>
                            </h2>
                        </div>

                        {activeAssignments.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {activeAssignments.map((assignment) => (
                                    <AssignmentCard key={assignment.id} assignment={assignment} />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-gray-400">
                                <ClipboardList className="w-10 h-10 mb-2 opacity-20" />
                                <p className="text-sm">No hay tareas activas.</p>
                                <p className="text-xs mt-2">Revisa la terminal para ver los logs de debug.</p>
                            </div>
                        )}
                    </div>

                    {/* Historial */}
                    <div>
                        <div className="flex items-center justify-between mb-4 border-t border-gray-100 pt-6">
                            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <History className="w-5 h-5 text-gray-400" />
                                Historial Reciente
                            </h2>
                            <Link href="/dashboard/assignments/list" className="text-xs font-medium text-brand-red hover:underline flex items-center gap-1">
                                Ver todos <ArrowRight className="w-3 h-3" />
                            </Link>
                        </div>

                        {historyAssignments.length > 0 ? (
                            <div className="space-y-3">
                                {historyAssignments.map((assignment) => (
                                    <AssignmentCard key={assignment.id} assignment={assignment} />
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-400 italic">No hay historial reciente.</p>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
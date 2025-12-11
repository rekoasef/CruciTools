// RUTA: /app/dashboard/assignments/page.tsx
import { redirect } from "next/navigation";
import { getProfileInfo, getTechniciansList, getServiceTypesList, getAssignmentsList } from "../actions/service-queries";
import { ClipboardList, PlusCircle, Wrench, Factory, MapPin, Calendar, ClipboardCheck } from "lucide-react";
import CreateAssignmentForm from "./create-assignment-form";
import AssignmentCard from "../components/assignment-card"; // <-- Nuevo componente

// Componente principal (Server Component)
export default async function AssignmentsPage() {
    // 1. Guardrail de Seguridad: Verificar rol
    const { profile } = await getProfileInfo();

    if (profile?.role !== 'coordinador') {
        return redirect("/dashboard");
    }

    // 2. Consulta de datos: Técnicos, Tipos de Servicio y TODAS las Asignaciones
    const [{ technicians }, { serviceTypes }, { assignments }] = await Promise.all([
        getTechniciansList(),
        getServiceTypesList(),
        getAssignmentsList() // <-- Sin ID, trae todas las asignaciones
    ]);

    // Filtramos las tareas abiertas y en progreso (las 'activas') para mostrar primero
    const activeAssignments = assignments.filter(a => 
        a.status === 'abierto' || a.status === 'en_progreso'
    );
    // Tareas finalizadas o canceladas
    const completedAssignments = assignments.filter(a => 
        a.status === 'finalizado' || a.status === 'cancelado'
    );


    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <ClipboardList className="w-8 h-8 text-brand-red" />
                Panel de Asignaciones
            </h1>
            <p className="text-gray-500">
                Gestiona y asigna nuevas tareas de servicio a los técnicos en campo.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Columna 1: Formulario de Nueva Asignación (Fase 3.2) */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 sticky top-4">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2 flex items-center gap-2">
                            <PlusCircle className="w-5 h-5 text-brand-red" />
                            Crear Nueva Tarea
                        </h2>
                        
                        <CreateAssignmentForm 
                            technicians={technicians}
                            serviceTypes={serviceTypes}
                        />
                    </div>
                </div>

                {/* Columna 2 & 3: Lista de Asignaciones (Fase 3.3) */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* Tareas Activas */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                            Tareas Activas ({activeAssignments.length})
                        </h2>
                        {activeAssignments.length > 0 ? (
                            <div className="space-y-4">
                                {activeAssignments.map(assignment => (
                                    <AssignmentCard key={assignment.id} assignment={assignment} />
                                ))}
                            </div>
                        ) : (
                            <div className="p-6 bg-gray-50 rounded-xl border border-gray-200 text-gray-500 text-center">
                                <ClipboardList className="w-8 h-8 mx-auto mb-2" />
                                <p>No hay tareas abiertas o en progreso.</p>
                            </div>
                        )}
                    </section>

                    {/* Tareas Finalizadas / Canceladas */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                            Historial ({completedAssignments.length})
                        </h2>
                        {completedAssignments.length > 0 ? (
                            <div className="space-y-4 opacity-70">
                                {completedAssignments.map(assignment => (
                                    <AssignmentCard key={assignment.id} assignment={assignment} />
                                ))}
                            </div>
                        ) : (
                            <div className="p-6 bg-gray-50 rounded-xl border border-gray-200 text-gray-500 text-center">
                                <p>El historial de tareas finalizadas aparecerá aquí.</p>
                            </div>
                        )}
                    </section>

                </div>
            </div>
        </div>
    );
}
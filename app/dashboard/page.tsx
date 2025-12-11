import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
// Importamos getAssignmentsList para poder mostrar las tareas
import { getProfileInfo, getTechnicianKPIs, getServiceReports, getAssignmentsList, AssignmentRow } from "./actions/service-queries"; 
import { Truck, Users, Activity, Wrench, ClipboardList, ClipboardCheck } from "lucide-react"; 
import AssignmentCard from "./components/assignment-card"; // Asegúrate de tener este componente (Fase 3.3)

// Helper Capitalize
const capitalize = (s: string) => {
    if (!s) return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
};

// Componente para listar tareas (Mismo que definimos en Fase 3.3)
function AssignedTasksList({ assignments }: { assignments: AssignmentRow[] }) {
    if (assignments.length === 0) {
        return (
            <div className="p-6 text-center bg-white rounded-xl shadow-sm border border-gray-200 text-gray-500">
                <p className="font-semibold">¡Genial! No tienes tareas pendientes.</p>
                <p className="text-sm mt-1">Espera la asignación de nuevas órdenes de servicio.</p>
            </div>
        );
    }
    
    return (
        <div className="space-y-4">
            {assignments.map(assignment => (
                <AssignmentCard key={assignment.id} assignment={assignment} showTechnician={false} /> 
            ))}
        </div>
    );
}

export default async function DashboardPage() {
  const { user, profile } = await getProfileInfo();
  
  if (!user || !profile) {
    return redirect("/login");
  }

  const isCoordinator = profile.role === 'coordinador';

  // Si es coordinador, redirigimos a su panel específico (Opcional, según prefieras)
  // if (isCoordinator) return redirect("/dashboard/assignments");

  // CONSULTA DE DATOS PARALELA
  // Traemos KPIs, Reportes y ASIGNACIONES
  const [{ monthlyCount, monthName }, { reports }, { assignments }] = await Promise.all([
      getTechnicianKPIs(),
      getServiceReports(),
      getAssignmentsList(user.id) // <--- ESTO FALTABA: Traer las tareas del técnico
  ]);

  // Filtramos tareas activas
  const activeAssignments = assignments ? assignments.filter(a => 
      a.status === 'abierto' || a.status === 'en_progreso'
  ) : [];

  //@ts-ignore
  const capitalizedMonthName = capitalize(monthName); 

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      {/* Saludo */}
      <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-brand-red flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
            ¡Hola, {profile.full_name || 'Usuario'}!
            </h1>
            <p className="text-gray-500">
            Rol: <span className="font-semibold capitalize text-brand-red">{profile.role}</span>.
            </p>
        </div>
        {/* KPI Rápido */}
        <div className="text-right hidden sm:block">
            <p className="text-xs text-gray-400 uppercase tracking-wider">Desempeño Mensual</p>
            <p className="text-3xl font-bold text-gray-900">{monthlyCount} <span className="text-sm font-normal text-gray-500">servicios</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLUMNA IZQUIERDA: KPIs y Accesos */}
        <div className="lg:col-span-1 space-y-6">
            <section className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-sm font-bold text-gray-400 uppercase mb-4">Tu Actividad</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-50 text-green-600 rounded-lg"><ClipboardCheck className="w-5 h-5"/></div>
                            <span className="text-gray-700 font-medium">Finalizados</span>
                        </div>
                        <span className="font-bold text-gray-900">{monthlyCount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><ClipboardList className="w-5 h-5"/></div>
                            <span className="text-gray-700 font-medium">Pendientes</span>
                        </div>
                        <span className="font-bold text-gray-900">{activeAssignments.length}</span>
                    </div>
                </div>
            </section>

            {/* Accesos Rápidos */}
            {isCoordinator && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                    <p className="text-sm text-yellow-800 font-medium">Panel de Coordinación Activo</p>
                </div>
            )}
        </div>

        {/* COLUMNA CENTRAL/DERECHA: Tareas y Reportes */}
        <div className="lg:col-span-2 space-y-8">
            
            {/* SECCIÓN 1: MIS TAREAS (Lo que faltaba) */}
            <section>
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Wrench className="w-5 h-5 text-brand-red" />
                    Mis Tareas Asignadas
                </h2>
                <AssignedTasksList assignments={activeAssignments} />
            </section>

            {/* SECCIÓN 2: ÚLTIMOS REPORTES */}
            <section>
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-gray-400" />
                    Historial Reciente
                </h2>
                {reports && reports.length > 0 ? (
                    <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
                        {reports.slice(0, 3).map(report => ( // Solo mostramos los últimos 3
                            <div key={report.id} className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                                <div>
                                    <p className="font-semibold text-gray-800 text-sm">{report.client_name}</p>
                                    <p className="text-xs text-gray-500 capitalize">{report.type.replace(/_/g, ' ')}</p>
                                </div>
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                                    Finalizado
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-sm italic">No hay reportes recientes.</p>
                )}
            </section>

        </div>
      </div>
    </div>
  );
}
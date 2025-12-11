import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
// IMPORTACIONES ABSOLUTAS (Crucial para evitar errores de ruta)
import { 
  getAssignmentsList, 
  getUnlinkedReports, 
  getProfileInfo, 
  ServiceReportRow, 
  AssignmentRow 
} from "@/app/dashboard/actions/service-queries";
import AssignmentCompletionFlow from "./assignment-completion-flow";

// --- Tipado Local ---
// Definimos exactamente qué forma tiene la data que le pasamos al componente cliente
// Esto debe coincidir con los tipos definidos en assignment-completion-flow.tsx
type AssignmentDetailRow = AssignmentRow & {
    profiles: { full_name: string } | null;
    service_types: { name: string } | null;
};

// Tipo compatible con el prop 'unlinkedReports' del componente hijo
type UnlinkedReport = Pick<ServiceReportRow, 'id' | 'client_name' | 'machine_model' | 'created_at'>;

export default async function AssignmentCompletePage({ params }: { params: { id: string } }) {
    const assignmentId = params.id;
    
    // 1. Obtener la asignación específica
    // (Traemos todas y filtramos en memoria por simplicidad y robustez en esta fase)
    const { assignments } = await getAssignmentsList();
    
    // Buscamos la tarea específica y forzamos el tipado para que coincida con el componente cliente
    const assignment = assignments.find(a => a.id === assignmentId) as AssignmentDetailRow | undefined;

    // Si la asignación no existe o el ID es incorrecto, devolvemos 404
    if (!assignment) {
        return notFound();
    }
    
    // 2. Obtener los reportes del técnico actual
    // Necesitamos el ID del usuario actual para buscar sus reportes no enlazados
    const { user } = await getProfileInfo();
    
    // Buscamos reportes finalizados que no estén enlazados
    // Usamos '|| ""' para asegurar que siempre pasamos un string
    const { reports: unlinkedReports } = await getUnlinkedReports(user?.id || '');

    // 3. Renderizar la vista
    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-10">
            <header className="border-b border-gray-200 pb-4">
                <Link 
                    href="/dashboard" 
                    className="text-sm text-gray-500 hover:text-brand-red mb-2 inline-flex items-center gap-1 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Volver a Mis Tareas
                </Link>
                <h1 className="text-3xl font-bold text-gray-900 mt-2">
                    Ejecutar Tarea: {assignment.client_name}
                </h1>
            </header>

            {/* Inyectamos los datos del servidor al componente cliente */}
            <AssignmentCompletionFlow 
                assignment={assignment} 
                unlinkedReports={unlinkedReports as UnlinkedReport[]} 
            />
        </div>
    );
}
import { createClient } from "@/utils/supabase/server";
import { getTechnicians, getServiceTypes } from "@/app/dashboard/actions/service-queries";
import AssignmentsTable from "./assignments-table";
import Link from "next/link";
import { ArrowLeft, LayoutList } from "lucide-react";

export default async function AssignmentsListPage() {
    const supabase = createClient();
    
    // 1. Obtener todas las asignaciones con sus relaciones
    // Ordenadas por fecha de creación descendente
    const { data: assignments } = await supabase
        .from('assignments')
        .select(`
            *,
            profiles ( id, full_name ),
            service_types ( id, name )
        `)
        .order('created_at', { ascending: false });

    // 2. Obtener datos para los filtros y modal
    const [{ data: technicians }, { data: serviceTypes }] = await Promise.all([
        getTechnicians(),
        getServiceTypes()
    ]);

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <Link href="/dashboard/assignments" className="text-sm text-gray-500 hover:text-brand-red flex items-center gap-1 mb-2">
                        <ArrowLeft className="w-4 h-4" /> Volver al panel
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <LayoutList className="w-7 h-7 text-brand-red" />
                        Listado Maestro de Tareas
                    </h1>
                </div>
            </div>

            <AssignmentsTable 
                initialAssignments={assignments || []} 
                technicians={technicians || []}
                serviceTypes={serviceTypes || []}
            />
        </div>
    );
}
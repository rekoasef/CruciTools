import { getCalendarEvents } from "@/app/dashboard/actions/calendar-actions";
import { getTechnicians } from "@/app/dashboard/actions/service-queries";
import CalendarView from "./calendar-view";

export const dynamic = 'force-dynamic';

export default async function CalendarPage() {
    // Obtenemos eventos y técnicos en paralelo
    const [{ events }, { data: technicians }] = await Promise.all([
        getCalendarEvents(),
        getTechnicians()
    ]);

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col">
            <header className="mb-4">
                <h1 className="text-2xl font-bold text-gray-900">Agenda de Servicios</h1>
                <p className="text-gray-500 text-sm">Visualización mensual. Filtra por mecánico o haz clic en un día para ver detalles.</p>
            </header>
            
            <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* CORRECCIÓN AQUÍ: Usamos 'as any' para evitar el error de tipado estricto */}
                <CalendarView 
                    events={(events || []) as any} 
                    technicians={(technicians || []) as any} 
                />
            </div>
        </div>
    );
}
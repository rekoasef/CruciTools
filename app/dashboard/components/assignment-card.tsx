import { ClipboardList, Wrench, Factory, User, Calendar, MapPin, Clock, Route } from "lucide-react";
import { AssignmentRow } from "../actions/service-queries";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from "next/link"; 

interface AssignmentCardProps {
    assignment: AssignmentRow;
    showTechnician?: boolean; 
}

const statusColors: Record<string, string> = {
    'abierto': 'bg-blue-100 text-blue-700 border-blue-300',
    'en_progreso': 'bg-yellow-100 text-yellow-700 border-yellow-300',
    'cancelado': 'bg-gray-100 text-gray-500 border-gray-300',
    'finalizado': 'bg-green-100 text-green-700 border-green-300',
};

const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'N/A';
    try {
        const date = new Date(dateStr);
        return format(date, 'dd MMM yyyy', { locale: es }); 
    } catch (e) {
        return 'Fecha inválida';
    }
};

export default function AssignmentCard({ assignment, showTechnician = true }: AssignmentCardProps) {
    const statusClass = statusColors[assignment.status] || 'bg-gray-100 text-gray-700 border-gray-300';
    const href = `/dashboard/assignments/${assignment.id}/complete`;

    // Verificamos si hay datos de distancia (Fase 4)
    // Usamos 'as any' temporalmente si TypeScript no ha refrescado el tipo AssignmentRow globalmente aún,
    // pero idealmente AssignmentRow ya tiene distance_km gracias a la actualización de service-queries.ts
    const distance = (assignment as any).distance_km;
    const origin = (assignment as any).origin_location;

    return (
        <Link href={href} className="block group">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 group-hover:shadow-md group-hover:border-brand-red/30 transition-all cursor-pointer space-y-3 relative overflow-hidden">
                
                {/* Banda lateral de estado */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${statusClass.split(' ')[0].replace('bg-', 'bg-')}`} />

                {/* Cabecera */}
                <div className="flex justify-between items-start border-b pb-2 mb-2 pl-2">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase text-gray-400 flex items-center gap-1 tracking-wider">
                            <ClipboardList className="w-3 h-3" /> Tarea #{assignment.id.substring(0, 6).toUpperCase()}
                        </span>
                        <h3 className="text-lg font-bold text-gray-800 group-hover:text-brand-red transition-colors truncate max-w-[200px] sm:max-w-xs">
                            {assignment.client_name}
                        </h3>
                    </div>
                    
                    <span className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded border ${statusClass}`}>
                        {assignment.status.replace('_', ' ')}
                    </span>
                </div>

                {/* Detalles */}
                <div className="space-y-1.5 text-sm text-gray-600 pl-2">
                    <div className="flex items-center gap-2">
                        <Wrench className="w-4 h-4 text-brand-red/70 flex-shrink-0" />
                        <span>{assignment.service_types?.name || 'Tipo Desconocido'}</span>
                    </div>

                    {showTechnician && (
                        <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-brand-red/70 flex-shrink-0" />
                            <span className="truncate">Asignado a: <span className="font-medium text-gray-800">{assignment.profiles?.full_name || 'Sin Asignar'}</span></span>
                        </div>
                    )}
                    
                    <div className="flex items-center gap-2">
                        <Factory className="w-4 h-4 text-brand-red/70 flex-shrink-0" />
                        <span>Modelo: {assignment.machine_model}</span>
                    </div>
                    
                    {assignment.client_location && (
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-brand-red/70 flex-shrink-0" />
                            <span className="truncate max-w-[250px]">{assignment.client_location}</span>
                        </div>
                    )}

                    {/* NUEVO: Mostrar Distancia si existe */}
                    {distance > 0 && (
                        <div className="flex items-center gap-2 text-blue-700 bg-blue-50 w-fit px-2 py-0.5 rounded text-xs mt-1">
                            <Route className="w-3 h-3 flex-shrink-0" />
                            <span className="font-semibold">{distance} km</span>
                            <span className="text-blue-400 mx-1">|</span>
                            <span className="truncate max-w-[150px] opacity-80" title={origin}>Desde: {origin?.split(',')[0]}</span>
                        </div>
                    )}
                </div>

                {/* Fechas */}
                <div className="flex justify-between items-center text-xs text-gray-400 pt-3 mt-1 border-t border-gray-50 pl-2">
                    <div className="flex items-center gap-1" suppressHydrationWarning>
                        <Clock className="w-3 h-3" />
                        {formatDate(assignment.assigned_at)}
                    </div>
                    {assignment.due_date && (
                        <div className="flex items-center gap-1 font-medium text-red-500 bg-red-50 px-2 py-0.5 rounded" suppressHydrationWarning>
                            <Calendar className="w-3 h-3" />
                            {formatDate(assignment.due_date)}
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
}
'use client';

import { X, MapPin, User, Wrench, Calendar } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Event {
    id: string;
    title: string;
    machine: string;
    location: string | null;
    start: string;
    end: string;
    status: string;
    technicianName: string;
    serviceType: string;
}

interface Props {
    date: Date;
    events: Event[];
    onClose: () => void;
}

export default function DayDetailsModal({ date, events, onClose }: Props) {
    
    const getStatusColor = (status: string) => {
        switch(status) {
            case 'finalizado': return 'bg-green-100 text-green-700 border-green-200';
            case 'en_progreso': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'cancelado': return 'bg-gray-100 text-gray-700 border-gray-200';
            default: return 'bg-blue-100 text-blue-700 border-blue-200';
        }
    };

    return (
        // Z-INDEX 100 PARA QUE ESTÉ SIEMPRE ARRIBA
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Fondo oscuro con backdrop-blur */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose} // Cerrar si haces clic afuera
            />
            
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 relative animate-in fade-in zoom-in-95 max-h-[85vh] flex flex-col z-[101]">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-50 p-1 rounded-full hover:bg-gray-100 transition-colors">
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-xl font-bold text-gray-900 mb-1 capitalize flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-brand-red" />
                    {format(date, 'EEEE d, MMMM', { locale: es })}
                </h2>
                <p className="text-sm text-gray-500 mb-4 border-b border-gray-100 pb-4">
                    {events.length} {events.length === 1 ? 'servicio programado' : 'servicios programados'}
                </p>

                <div className="space-y-3 overflow-y-auto pr-2 flex-1">
                    {events.length === 0 ? (
                        <div className="text-center py-10 text-gray-400 border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/50">
                            No hay servicios asignados para este día.
                        </div>
                    ) : (
                        events.map(event => (
                            <div key={event.id} className="p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all bg-white group">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-gray-900 group-hover:text-brand-red transition-colors">{event.title}</h3>
                                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${getStatusColor(event.status)}`}>
                                        {event.status.replace('_', ' ')}
                                    </span>
                                </div>
                                
                                <div className="space-y-1.5 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <Wrench className="w-3.5 h-3.5 text-brand-red" />
                                        <span>{event.serviceType} <span className="text-gray-300">|</span> {event.machine}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <User className="w-3.5 h-3.5 text-brand-red" />
                                        <span className="font-medium text-gray-800">{event.technicianName}</span>
                                    </div>
                                    {event.location && (
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-3.5 h-3.5 text-brand-red" />
                                            <span>{event.location}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                    <button onClick={onClose} className="text-sm text-gray-500 hover:text-gray-900 font-medium">
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
}
'use client';

import { useState } from 'react';
import { 
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, 
  eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, 
  isWithinInterval, startOfDay, endOfDay 
} from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Filter, Calendar as CalendarIcon } from 'lucide-react';
import DayDetailsModal from './day-details-modal';

interface Event {
    client_name: string;
    id: string;
    title: string;
    machine: string;
    location: string | null;
    start: string;
    end: string;
    status: string;
    technicianId: string;
    technicianName: string;
    serviceType: string;
}

interface Technician {
    id: string;
    full_name: string;
}

interface Props {
    events: Event[];
    technicians: Technician[];
}

export default function CalendarView({ events, technicians }: Props) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedTech, setSelectedTech] = useState<string>('all');
    const [selectedDay, setSelectedDay] = useState<{ date: Date, events: Event[] } | null>(null);

    const startDate = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 1 });
    const endDate = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

    const filteredEvents = selectedTech === 'all' 
        ? events 
        : events.filter(e => e.technicianId === selectedTech);

    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
    const today = () => setCurrentDate(new Date());

    // --- FUNCIÓN MÁGICA PARA FECHAS ---
    // Convierte "2025-12-17T..." en un objeto Date Local exacto (sin restar horas)
    const parseLocal = (isoString: string) => {
        if (!isoString) return new Date();
        const datePart = isoString.split('T')[0]; // "2025-12-17"
        const [y, m, d] = datePart.split('-').map(Number);
        return new Date(y, m - 1, d); // Mes es base 0 en JS
    };

    const getEventsForDay = (day: Date) => {
        return filteredEvents.filter(event => {
            // Usamos parseLocal para comparar manzanas con manzanas
            const start = parseLocal(event.start);
            const end = parseLocal(event.end);
            
            // Comparamos ignorando horas
            return day >= start && day <= end;
        });
    };

    const getEventStyle = (event: Event, day: Date) => {
        const start = parseLocal(event.start);
        const end = parseLocal(event.end);
        
        const isStart = isSameDay(day, start);
        const isEnd = isSameDay(day, end);
        
        let styleClass = "h-6 mb-1 text-[10px] flex items-center shadow-sm cursor-pointer transition-all hover:brightness-95 text-white "; 
        
        if (event.status === 'finalizado') styleClass += "bg-emerald-500 "; 
        else if (event.status === 'en_progreso') styleClass += "bg-amber-500 "; 
        else styleClass += "bg-blue-500 "; 

        if (isStart && isEnd) styleClass += "rounded mx-1 px-2";
        else if (isStart) styleClass += "rounded-l ml-1 mr-0 pl-2";
        else if (isEnd) styleClass += "rounded-r mr-1 ml-0 pr-2";
        else styleClass += "mx-0 px-0 rounded-none opacity-90"; 

        return styleClass;
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between p-5 border-b border-gray-100 bg-white gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-red-50 rounded-lg text-brand-red">
                        <CalendarIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 capitalize">
                            {format(currentDate, 'MMMM yyyy', { locale: es })}
                        </h2>
                        <p className="text-xs text-gray-500 font-medium">
                            {technicians.length} técnicos disponibles
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-200">
                        <button onClick={prevMonth} className="p-1.5 hover:bg-white hover:shadow-sm rounded-md transition-all text-gray-600"><ChevronLeft className="w-4 h-4" /></button>
                        <button onClick={today} className="text-xs font-bold px-3 py-1.5 hover:bg-white hover:shadow-sm rounded-md transition-all text-gray-700 mx-1">HOY</button>
                        <button onClick={nextMonth} className="p-1.5 hover:bg-white hover:shadow-sm rounded-md transition-all text-gray-600"><ChevronRight className="w-4 h-4" /></button>
                    </div>

                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <select 
                            value={selectedTech}
                            onChange={(e) => setSelectedTech(e.target.value)}
                            className="pl-9 pr-8 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red appearance-none cursor-pointer font-medium text-gray-700 shadow-sm hover:border-gray-300 transition-colors"
                        >
                            <option value="all">Todos los Técnicos</option>
                            {technicians.map(tech => (
                                <option key={tech.id} value={tech.id}>{tech.full_name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Días */}
            <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50/50">
                {weekDays.map(day => (
                    <div key={day} className="py-3 text-center text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                        {day}
                    </div>
                ))}
            </div>

            {/* Grilla */}
            <div className="grid grid-cols-7 flex-1 auto-rows-fr bg-white overflow-y-auto">
                {days.map((day, idx) => {
                    const dayEvents = getEventsForDay(day);
                    const isToday = isSameDay(day, new Date());
                    const isCurrentMonth = isSameMonth(day, currentDate);
                    const borderClass = "border-b border-r border-gray-100"; 

                    return (
                        <div 
                            key={day.toString()} 
                            onClick={() => setSelectedDay({ date: day, events: dayEvents })}
                            className={`min-h-[120px] relative group transition-colors hover:bg-gray-50/80 cursor-pointer ${borderClass} ${!isCurrentMonth ? 'bg-gray-50/30' : 'bg-white'}`}
                        >
                            <div className="p-2 flex justify-between items-start pointer-events-none z-10 relative">
                                <span className={`text-xs font-semibold w-7 h-7 flex items-center justify-center rounded-full transition-all ${isToday ? 'bg-brand-red text-white shadow-md scale-110' : isCurrentMonth ? 'text-gray-700 group-hover:bg-gray-200' : 'text-gray-300'}`}>
                                    {format(day, 'd')}
                                </span>
                            </div>
                            
                            <div className="flex flex-col mt-1 absolute inset-x-0 top-8 px-0"> 
                                {dayEvents.slice(0, 4).map((event) => {
                                    const start = parseLocal(event.start);
                                    const isStart = isSameDay(day, start);
                                    const isMonday = format(day, 'i') === '1';
                                    const showText = isStart || isMonday;

                                    return (
                                        <div 
                                            key={`${event.id}-${day.toString()}`} 
                                            className={getEventStyle(event, day)}
                                        >
                                            {showText && (
                                                <span className="truncate font-semibold px-1">
                                                     {event.technicianName.split(' ')[0]}: {event.client_name || event.title}
                                                </span>
                                            )}
                                        </div>
                                    );
                                })}
                                {dayEvents.length > 4 && (
                                    <div className="mx-1 px-2 text-[10px] font-medium text-gray-400">
                                        + {dayEvents.length - 4} más...
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Modal */}
            {selectedDay && (
                <DayDetailsModal 
                    date={selectedDay.date} 
                    events={selectedDay.events} 
                    onClose={() => setSelectedDay(null)} 
                />
            )}
        </div>
    );
}
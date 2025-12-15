import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, User, Wrench, CheckCircle2, MapPin } from "lucide-react";

// CORRECCIÓN: params es Promise
export default async function ReportDetailPage({ params }: { params: Promise<{ id: string }> }) {
    
    // 1. Esperamos los params
    const { id } = await params;

    // CORRECCIÓN: Agregamos 'await' aquí
    const supabase = await createClient();

    // 2. Usamos el ID
    const { data: report, error } = await supabase
        .from('service_reports')
        .select(`
            *,
            profiles ( full_name, email )
        `)
        .eq('id', id)
        .single();

    if (error || !report) {
        return notFound();
    }

    // Casteamos el JSON para que TypeScript no se queje
    const checklistData = report.checklist_data as Record<string, any>;

    return (
        <div className="max-w-4xl mx-auto pb-10 space-y-8">
            
            {/* Header */}
            <div className="flex flex-col gap-4">
                <Link 
                    href="/dashboard/services" 
                    className="text-gray-500 hover:text-brand-red flex items-center gap-2 text-sm font-medium transition-colors w-fit"
                >
                    <ArrowLeft className="w-4 h-4" /> Volver a Reportes
                </Link>

                <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Finalizado
                            </span>
                            <span className="text-gray-400 text-sm">#{report.id.slice(0, 8)}</span>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">{report.client_name}</h1>
                        <p className="text-gray-500 text-lg">{report.machine_model} {report.machine_serial ? `• ${report.machine_serial}` : ''}</p>
                    </div>
                    
                    <div className="text-right space-y-1">
                        <div className="flex items-center justify-end gap-2 text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span className="font-medium">{new Date(report.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center justify-end gap-2 text-gray-600">
                            <User className="w-4 h-4" />
                            <span className="font-medium">{report.profiles?.full_name}</span>
                        </div>
                         <div className="flex items-center justify-end gap-2 text-gray-600">
                            <Wrench className="w-4 h-4" />
                            <span className="font-medium">{report.type}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Checklist Content */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="font-bold text-gray-800">Datos del Checklist</h2>
                    <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Lectura de Sensores</span>
                </div>
                
                <div className="divide-y divide-gray-100">
                    {Object.entries(checklistData).map(([key, value]) => {
                        // Ignoramos campos vacíos o nulos
                        if (value === null || value === '' || value === false) return null;
                        
                        // Formateamos la clave (ej: "presion_hidraulica" -> "Presion Hidraulica")
                        const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                        
                        // Formateamos el valor
                        let displayValue = value;
                        if (value === true) displayValue = "Sí / Correcto";

                        return (
                            <div key={key} className="p-4 sm:px-6 hover:bg-gray-50 transition-colors flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4">
                                <span className="text-sm font-medium text-gray-500">{label}</span>
                                <span className="text-sm font-bold text-gray-900">{String(displayValue)}</span>
                            </div>
                        );
                    })}
                    
                    {Object.keys(checklistData).length === 0 && (
                        <div className="p-8 text-center text-gray-500 italic">
                            No hay datos registrados en este checklist.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
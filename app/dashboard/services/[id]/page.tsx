import { ArrowLeft, User, Factory, ClipboardCheck, AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getReportDetails } from "@/app/dashboard/actions/service-queries";

// Definición de Tipos para las respuestas dentro del JSONB
type AnswerState = "ok" | "no_aplica" | "observacion";
type ReportAnswer = { state: AnswerState; note?: string };
type ReportChecklistData = Record<string, ReportAnswer>;

// Importamos el schema para obtener los nombres de las preguntas
import { CHECKLISTS_DATA } from "@/lib/checklist-data";

// Función para obtener el nombre de la pregunta y la categoría usando el Schema
const getChecklistItem = (model: string, id: string) => {
    const checklist = CHECKLISTS_DATA[model.toLowerCase()];
    if (!checklist) return { label: `[ERROR: Schema no encontrado para ${model}]`, category: 'Error' };
    
    const item = checklist.items.find(item => item.id === id);
    if (!item) return { label: `[ID ${id} - Pregunta no mapeada]`, category: 'No Mapeado' };
    
    return { label: item.label, category: item.category };
};


// Función para formatear la fecha
const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-AR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};


export default async function ReportDetailPage({ params }: { params: { id: string } }) {
    const { id } = params;

    const { report, error } = await getReportDetails(id);

    if (error || !report) {
        if (error?.includes("Row not found")) return notFound();
        return (
            <div className="p-6 bg-red-100 border-l-4 border-status-error text-status-error rounded-lg">
                <h1 className="text-xl font-bold mb-2">Error de Acceso o Reporte No Encontrado</h1>
                <p>Verifique sus permisos o si el ID del reporte es correcto.</p>
            </div>
        );
    }
    
    // Extracción de datos (el tipo 'report' es una mezcla de service_reports + profiles)
    const technicianName = (report as any)?.profiles?.full_name || "Técnico Desconocido";
    const reportModel = report.machine_model;

    // Procesar las respuestas: Obtenemos el texto de la pregunta y la agrupamos
    const checklistData = report.checklist_data as ReportChecklistData;
    
    const groupedChecklist = Object.keys(checklistData).reduce((acc, itemId) => {
        const { label, category } = getChecklistItem(reportModel, itemId);
        const answer = checklistData[itemId];

        if (!acc[category]) acc[category] = [];
        acc[category].push({ id: itemId, label, answer });
        return acc;
    }, {} as Record<string, Array<{ id: string, label: string, answer: ReportAnswer }>>);


    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-10">
            
            <header className="border-b border-gray-200 pb-4">
                <Link href="/dashboard/services" className="text-sm text-gray-500 hover:text-brand-red mb-2 inline-flex items-center gap-1 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Volver al Historial
                </Link>
                <h1 className="text-3xl font-bold text-gray-900 mt-2">
                    Reporte de {report.type.replace(/_/g, ' ')}
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                    ID: {report.id.slice(0, 8)}... | Fecha: {formatDate(report.created_at)}
                </p>
            </header>

            {/* Panel de Datos Clave */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                    <User className="w-5 h-5 text-brand-red mb-2" />
                    <p className="text-sm text-gray-500">Técnico</p>
                    <p className="font-semibold text-gray-900">{technicianName}</p>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                    <Factory className="w-5 h-5 text-brand-red mb-2" />
                    <p className="text-sm text-gray-500">Máquina</p>
                    <p className="font-semibold text-gray-900 capitalize">{report.machine_model} ({report.machine_serial})</p>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                    <ClipboardCheck className="w-5 h-5 text-brand-red mb-2" />
                    <p className="text-sm text-gray-500">Cliente</p>
                    <p className="font-semibold text-gray-900">{report.client_name}</p>
                </div>
            </div>

            {/* Checklist Detallado */}
            <section className="pt-4 space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 border-b border-gray-200 pb-2">
                    Resultados del Checklist
                </h2>

                {Object.entries(groupedChecklist).map(([category, items]) => (
                    <div key={category} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                            <h3 className="font-bold text-gray-700">{category}</h3>
                        </div>
                        
                        <div className="divide-y divide-gray-100">
                            {items.map((item) => (
                                <div key={item.id} className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-start hover:bg-gray-50/30 transition-colors">
                                    
                                    {/* Item Label (Nombre de la pregunta del schema original) */}
                                    <div className= "md:col-span-8">
                                        <div className="flex gap-3">
                                            <span className="text-xs font-mono text-gray-400 mt-1">{item.id}</span>
                                            <p className="text-sm font-medium text-gray-900">{item.label}</p>
                                        </div>
                                    </div>

                                    {/* Resultado y Nota */}
                                    <div className="md:col-span-4 flex flex-col gap-1 items-end">
                                        <div className="flex items-center gap-2">
                                            <span className={`px-3 py-1 text-xs font-bold rounded-full 
                                                ${item.answer.state === 'ok' ? 'bg-green-100 text-green-700' : 
                                                  item.answer.state === 'observacion' ? 'bg-yellow-100 text-yellow-700' : 
                                                  'bg-gray-200 text-gray-600'}`
                                            }>
                                                {item.answer.state === 'ok' ? 'OK' : 
                                                 item.answer.state === 'no_aplica' ? 'N/A' : 'OBSERVACIÓN'}
                                            </span>
                                            {item.answer.state === 'ok' && <CheckCircle className="w-4 h-4 text-green-600" />}
                                            {item.answer.state === 'observacion' && <AlertCircle className="w-4 h-4 text-yellow-600" />}
                                        </div>
                                        {item.answer.note && (
                                            <p className="text-xs text-right text-yellow-800 bg-yellow-50 p-2 rounded-lg mt-1 w-full max-w-xs border border-yellow-200">
                                                **Nota:** {item.answer.note}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
}
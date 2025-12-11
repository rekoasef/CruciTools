/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { useState } from "react";
import { notFound, useParams, useRouter } from "next/navigation";
import Link from "next/link";
// Importaciones de librerías y datos de CruciTools
import { CHECKLISTS_DATA } from "@/lib/checklist-data";
import { StartupChecklistData } from "@/lib/schemas/checklist-schema"; 
import { submitStartupChecklist } from "@/app/dashboard/actions/checklist-actions"; 
// Íconos
import { CheckCircle2, AlertCircle, ArrowLeft, Loader2, Save } from "lucide-react";


// --- TIPOS ---
type AnswerState = "ok" | "no_aplica" | "observacion";
type Responses = Record<string, { state: AnswerState; note: string }>;

// Definimos la interfaz de respuesta de la Server Action para el casteo
interface ActionResponse {
    error?: boolean;
    success?: boolean;
    message: string;
    errors?: Record<string, string[] | undefined>;
}

export default function DynamicChecklistPage() {
  const params = useParams();
  const model = Array.isArray(params.model) ? params.model[0] : params.model;
  const checklist = CHECKLISTS_DATA[model];

  if (!checklist) return notFound();

  const router = useRouter();

  // ESTADOS
  const [responses, setResponses] = useState<Responses>({});
  const [clientData, setClientData] = useState({ name: "", serial: "" });
  const [loading, setLoading] = useState(false);
  const [, setSubmissionStatus] = useState<'success' | 'error' | null>(null);
  const [errors, setErrors] = useState<Record<string, string[] | undefined>>({}); // Para errores de Zod

  // Manejadores de Respuesta
  const handleResponse = (id: string, state: AnswerState) => {
    setResponses((prev) => ({
      ...prev,
      [id]: { state, note: prev[id]?.note || "" }, 
    }));
  };

  const handleNote = (id: string, note: string) => {
    setResponses((prev) => ({
      ...prev,
      [id]: { note, state: prev[id]?.state || 'observacion' }, 
    }));
  };
  
  // Lógica de Envío del Formulario
  const handleSubmit = async () => {
    setLoading(true);
    setSubmissionStatus(null);
    setErrors({}); // Limpiar errores anteriores

    // 1. Pre-procesar los datos para enviarlos a la Server Action
    const data: StartupChecklistData = {
      client_name: clientData.name,
      machine_serial: clientData.serial,
      machine_model: model as 'drillor' | 'plantor', // Casting seguro
      responses: responses,
      // --- CORRECCIÓN CRÍTICA AQUÍ ---
      // Debe coincidir con el ENUM de la base de datos y el Schema de Zod
      type: 'Puesta en Marcha' 
    };

    // 2. Llamar a la Server Action y castear la respuesta
    const result = (await submitStartupChecklist(data)) as ActionResponse;

    if (result.error) {
      setSubmissionStatus('error');
      
      if (result.errors) {
        setErrors(result.errors);
        alert(`Error de validación: Revise los datos del Cliente y el Checklist.`);
      } else {
        alert(result.message);
      }
    } else {
      setSubmissionStatus('success');
      alert(result.message);
      // Redirigir a la lista de servicios (Fase 2.5)
      router.push('/dashboard/services');
    }

    setLoading(false);
  };

  // Agrupar Ítems por Categoría
  const groupedItems = checklist.items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof checklist.items>);


  // RENDERIZADO
  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-24">
      
      {/* Cabecera de Navegación */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div>
           <Link 
             href="/dashboard/checklists/startup" 
             className="text-sm text-gray-500 hover:text-brand-red mb-2 inline-flex items-center gap-1 transition-colors"
           >
             <ArrowLeft className="w-4 h-4" /> Volver a selección
           </Link>
           <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
             {checklist.title}
           </h1>
        </div>
        <div className="hidden md:block bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold uppercase border border-yellow-200">
            Modo Edición
        </div>
      </div>

      {/* Tarjeta: Datos del Cliente */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 border-l-4 border-brand-red pl-3">
            Datos de la Unidad
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cliente / Razón Social
                </label>
                <input 
                    type="text" 
                    className={`w-full p-2.5 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red outline-none transition-all ${errors.client_name ? 'border-status-error' : 'border-gray-300'}`}
                    placeholder="Ej: Agropecuaria El Norte S.A."
                    value={clientData.name}
                    onChange={(e) => setClientData({...clientData, name: e.target.value})}
                />
                {errors.client_name && <p className="text-xs text-status-error mt-1">{errors.client_name[0]}</p>}
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número de Serie (Chasis)
                </label>
                <input 
                    type="text" 
                    className={`w-full p-2.5 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red outline-none transition-all ${errors.machine_serial ? 'border-status-error' : 'border-gray-300'}`}
                    placeholder="Ej: S-2024-001"
                    value={clientData.serial}
                    onChange={(e) => setClientData({...clientData, serial: e.target.value})}
                />
                {errors.machine_serial && <p className="text-xs text-status-error mt-1">{errors.machine_serial[0]}</p>}
            </div>
        </div>
      </div>

      {/* Lista del Checklist Dinámico */}
      <div className="space-y-8">
        {Object.entries(groupedItems).map(([category, items]) => (
            <div key={category} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Título de Categoría */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                        {category}
                    </h3>
                </div>
                
                <div className="divide-y divide-gray-100">
                    {items.map((item) => {
                        const current = responses[item.id] || { state: null, note: "" };
                        
                        return (
                            <div key={item.id} className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-start hover:bg-gray-50/30 transition-colors">
                                
                                {/* Columna Izquierda: Pregunta */}
                                <div className="md:col-span-7">
                                    <div className="flex gap-3">
                                        <span className="text-xs font-mono font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded h-fit">
                                            {item.id}
                                        </span>
                                        <p className="text-sm font-medium text-gray-900 leading-relaxed">
                                            {item.label}
                                        </p>
                                    </div>
                                </div>

                                {/* Columna Derecha: Botones y Observaciones */}
                                <div className="md:col-span-5 flex flex-col gap-3">
                                    {/* Botones */}
                                    <div className="flex justify-end gap-2 w-full">
                                        <button 
                                            onClick={() => handleResponse(item.id, 'ok')}
                                            className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all flex items-center justify-center gap-1
                                                ${current.state === 'ok' 
                                                    ? 'bg-green-100 border-green-200 text-green-700 shadow-inner' 
                                                    : 'bg-white border-gray-200 text-gray-400 hover:border-green-300 hover:text-green-600'}`}
                                        >
                                            <CheckCircle2 className="w-3.5 h-3.5" /> OK
                                        </button>
                                        
                                        <button 
                                            onClick={() => handleResponse(item.id, 'no_aplica')}
                                            className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all text-center
                                                ${current.state === 'no_aplica' 
                                                    ? 'bg-gray-200 border-gray-300 text-gray-700 shadow-inner' 
                                                    : 'bg-white border-gray-200 text-gray-400 hover:bg-gray-50'}`}
                                        >
                                            N/A
                                        </button>

                                        <button 
                                            onClick={() => handleResponse(item.id, 'observacion')}
                                            className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all flex items-center justify-center gap-1
                                                ${current.state === 'observacion' 
                                                    ? 'bg-yellow-100 border-yellow-200 text-yellow-700 shadow-inner' 
                                                    : 'bg-white border-gray-200 text-gray-400 hover:border-yellow-300 hover:text-yellow-600'}`}
                                        >
                                            <AlertCircle className="w-3.5 h-3.5" /> OBS
                                        </button>
                                    </div>

                                    {/* Input de Observaciones */}
                                    {(current.state === 'observacion' || current.note) && (
                                        <div className="animate-in fade-in slide-in-from-top-1">
                                            <input 
                                                type="text" 
                                                placeholder="Describa la observación técnica..."
                                                value={current.note}
                                                onChange={(e) => handleNote(item.id, e.target.value)}
                                                className="w-full text-xs p-2.5 border border-yellow-200 bg-yellow-50 rounded-lg focus:outline-none focus:ring-1 focus:ring-yellow-400 text-gray-700 placeholder-yellow-700/50"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        ))}
      </div>


      {/* Footer Fijo de Acciones */}
      <div className="fixed bottom-0 left-0 md:left-64 right-0 bg-white border-t border-gray-200 p-4 px-6 flex justify-between md:justify-end gap-4 z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <span className="text-xs text-gray-400 self-center hidden md:block">
            El reporte se guardará como finalizado.
        </span>
        <div className="flex gap-3 w-full md:w-auto">
            <button 
                disabled={loading}
                className="flex-1 md:flex-none px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
                 <Save className="w-4 h-4" /> Guardar Borrador
            </button>
            <button 
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 md:flex-none btn-primary py-2.5 px-8 shadow-lg shadow-red-200 rounded-lg font-bold tracking-wide flex items-center justify-center gap-2"
            >
                 {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                 ) : (
                    "Finalizar Reporte"
                 )}
            </button>
        </div>
      </div>

    </div>
  );
}
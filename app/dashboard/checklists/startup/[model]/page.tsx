'use client';

import { useParams, notFound, useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Save, FileText, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { CHECKLISTS_DATA } from "../../../../../lib/checklist-data";

export default function StartupChecklistPage() {
    const params = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState<Record<string, any>>({});

    // 1. Validamos params
    if (!params || !params.model) {
        return notFound();
    }

    // 2. Normalizamos el modelo
    const rawModel = Array.isArray(params.model) ? params.model[0] : params.model;
    const modelKey = rawModel ? rawModel.toLowerCase() : "";

    // 3. LA SOLUCIÓN DEFINITIVA (Casteo a 'any')
    // Esto le dice a TypeScript: "Confía en mí, ignora los tipos aquí".
    const checklist = (CHECKLISTS_DATA as any)[modelKey];

    // Si no existe, mostramos error visual
    if (!checklist) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
                <FileText className="w-12 h-12 text-gray-300 mb-4" />
                <h1 className="text-xl font-bold text-gray-900">Modelo "{modelKey}" no encontrado</h1>
                <p className="text-gray-500 mt-2">No existe un checklist configurado para este modelo.</p>
                <Link href="/dashboard/checklists" className="mt-6 bg-brand-red text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                    Volver a la lista
                </Link>
            </div>
        );
    }

    // 4. Agrupar items por categoría
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const groupedItems = useMemo(() => {
        const groups: Record<string, any[]> = {}; // Usamos any[] para evitar líos de tipos
        
        // Verificamos que checklist.items exista
        if (!checklist.items || !Array.isArray(checklist.items)) return {};
        
        checklist.items.forEach((item: any) => {
            const cat = item.category || 'General';
            if (!groups[cat]) {
                groups[cat] = [];
            }
            groups[cat].push(item);
        });
        return groups;
    }, [checklist]);

    // 5. Submit
    const handleSubmit = async () => {
        setLoading(true);
        const supabase = createClient();
        
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            alert("Usuario no autenticado");
            setLoading(false);
            return;
        }

        const { error } = await supabase.from('service_reports').insert({
            technician_id: user.id,
            client_name: formData['client_name'] || 'Cliente (Sin Nombre)',
            machine_model: checklist.title,
            type: 'Puesta en Marcha',
            checklist_data: formData,
            status: 'finalizado'
        });

        if (error) {
            alert("Error al guardar: " + error.message);
            setLoading(false);
        } else {
            router.push('/dashboard/services');
            router.refresh();
        }
    };

    const handleInputChange = (id: string, value: any) => {
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    return (
        <div className="max-w-3xl mx-auto pb-24 space-y-6">
            
            {/* Header */}
            <div>
                <Link href="/dashboard/checklists" className="text-gray-500 hover:text-brand-red flex items-center gap-2 text-sm mb-4">
                    <ArrowLeft className="w-4 h-4" /> Volver a Modelos
                </Link>
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-red-50 rounded-lg">
                        <FileText className="w-8 h-8 text-brand-red" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {checklist.title}
                        </h1>
                        <p className="text-gray-500 text-sm">
                            Modelo: <span className="uppercase font-bold">{checklist.model}</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Input Cliente */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <label className="block text-sm font-bold text-gray-700 mb-1">Nombre del Cliente / Estancia</label>
                <input 
                    type="text" 
                    placeholder="Ej: Agropecuaria El Sol"
                    className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-brand-red"
                    onChange={(e) => handleInputChange('client_name', e.target.value)}
                />
            </div>

            {/* Checklist */}
            <div className="space-y-8">
                {Object.entries(groupedItems).map(([categoryName, items]) => (
                    <div key={categoryName} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                            <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide">
                                {categoryName}
                            </h3>
                        </div>
                        
                        <div className="divide-y divide-gray-100">
                            {items.map((item) => (
                                <div key={item.id} className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-50 transition-colors">
                                    <div className="flex-1">
                                        <span className="text-xs font-mono text-gray-400 mr-2">{item.id}</span>
                                        <span className="text-sm font-medium text-gray-700">{item.label}</span>
                                    </div>
                                    
                                    <div className="flex gap-2 shrink-0">
                                        <button 
                                            onClick={() => handleInputChange(item.id, true)}
                                            className={`px-3 py-1.5 rounded-md text-xs font-bold border transition-all ${
                                                formData[item.id] === true 
                                                ? 'bg-green-600 text-white border-green-600 shadow-sm' 
                                                : 'bg-white text-gray-500 border-gray-200 hover:border-green-300'
                                            }`}
                                        >
                                            OK
                                        </button>
                                        <button 
                                            onClick={() => handleInputChange(item.id, false)}
                                            className={`px-3 py-1.5 rounded-md text-xs font-bold border transition-all ${
                                                formData[item.id] === false 
                                                ? 'bg-red-600 text-white border-red-600 shadow-sm' 
                                                : 'bg-white text-gray-500 border-gray-200 hover:border-red-300'
                                            }`}
                                        >
                                            NO
                                        </button>
                                        <button 
                                            onClick={() => handleInputChange(item.id, 'NA')}
                                            className={`px-3 py-1.5 rounded-md text-xs font-bold border transition-all ${
                                                formData[item.id] === 'NA' 
                                                ? 'bg-gray-600 text-white border-gray-600 shadow-sm' 
                                                : 'bg-white text-gray-400 border-gray-200 hover:border-gray-400'
                                            }`}
                                        >
                                            N/A
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer Fijo */}
            <div className="fixed bottom-4 left-0 right-0 px-4 md:static md:p-0 z-10">
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full md:w-full bg-brand-red text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-red-900/20 hover:bg-red-700 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin"/> : <Save className="w-5 h-5" />}
                    {loading ? "Guardando..." : "Finalizar y Guardar"}
                </button>
            </div>
        </div>
    );
}
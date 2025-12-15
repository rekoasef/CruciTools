'use client';

import { useState, useEffect } from "react";
import { getMyRecentReports, finalizeAssignment } from "@/app/dashboard/actions/assignment-actions";
import { CheckCircle, Loader2, FileText, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

export default function FinishTaskForm({ assignmentId }: { assignmentId: string }) {
    const [reports, setReports] = useState<any[]>([]);
    const [selectedReport, setSelectedReport] = useState("");
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const router = useRouter();

    // Cargar reportes al montar el componente
    const loadReports = async () => {
        setFetching(true);
        const data = await getMyRecentReports();
        setReports(data);
        setFetching(false);
    };

    useEffect(() => {
        loadReports();
    }, []);

    const handleFinish = async () => {
        if (!selectedReport) return;
        setLoading(true);
        const res = await finalizeAssignment(assignmentId, selectedReport);
        if (res.success) {
            router.refresh(); // Recargar para ver estado "finalizado"
        } else {
            alert("Error: " + res.message);
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-900">Vincular Reporte y Finalizar</h3>
                <button onClick={loadReports} title="Actualizar lista" className="text-gray-400 hover:text-blue-600">
                    <RefreshCw className={`w-4 h-4 ${fetching ? 'animate-spin' : ''}`} />
                </button>
            </div>

            <p className="text-sm text-gray-500">
                Selecciona el checklist que completaste para este cliente.
            </p>

            <div className="space-y-3">
                <select 
                    className="w-full p-3 border rounded-lg bg-gray-50 outline-none focus:border-brand-red"
                    value={selectedReport}
                    onChange={(e) => setSelectedReport(e.target.value)}
                    disabled={loading}
                >
                    <option value="">-- Seleccionar Checklist --</option>
                    {reports.map((r) => (
                        <option key={r.id} value={r.id}>
                            {new Date(r.created_at).toLocaleDateString()} - {r.machine_model} ({r.client_name})
                        </option>
                    ))}
                </select>

                <button 
                    onClick={handleFinish}
                    disabled={!selectedReport || loading}
                    className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                    {loading ? "Finalizando..." : "Confirmar y Cerrar Tarea"}
                </button>
            </div>
            
            {reports.length === 0 && !fetching && (
                <p className="text-xs text-red-500 text-center">
                    No tienes reportes recientes. Ve a Nuevo Checklist primero.
                </p>
            )}
        </div>
    );
}
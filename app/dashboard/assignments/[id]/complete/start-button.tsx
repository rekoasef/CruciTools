'use client';

import { useState } from "react";
import { updateAssignmentStatus } from "@/app/dashboard/actions/assignment-actions";
import { Play, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function StartAssignmentButton({ assignmentId }: { assignmentId: string }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleStart = async () => {
        setLoading(true);
        // Llamamos a la Server Action existente
        const res = await updateAssignmentStatus(assignmentId, 'en_progreso');
        
        if (res?.success) {
            // Refrescamos la página para que aparezca el Checklist
            router.refresh();
        } else {
            alert("Error al iniciar: " + res?.message);
            setLoading(false);
        }
    };

    return (
        <button 
            onClick={handleStart}
            disabled={loading}
            className="bg-brand-red text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
            {loading ? "Iniciando..." : "Iniciar Trabajo"}
        </button>
    );
}
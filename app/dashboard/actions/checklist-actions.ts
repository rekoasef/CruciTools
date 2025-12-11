'use server';

import { createClient } from "@/utils/supabase/server";
import { StartupChecklistSchema, StartupChecklistData } from "@/lib/schemas/checklist-schema";
import { revalidatePath } from "next/cache";
import { Database } from "@/lib/database.types"; 

// Tipos estrictos para la inserción
type ServiceReportInsert = Database['public']['Tables']['service_reports']['Insert'];

// Definición de la estructura de respuesta de la Server Action
interface ActionResponse {
    error?: boolean;
    success?: boolean;
    message: string;
    errors?: Record<string, string[] | undefined>;
}

export async function submitStartupChecklist(data: StartupChecklistData): Promise<ActionResponse> {
    
    // 1. VALIDACIÓN CON ZOD
    const validation = StartupChecklistSchema.safeParse(data);

    if (!validation.success) {
        const fieldErrors = validation.error.flatten().fieldErrors;
        return { 
            error: true, 
            message: "Error de validación en el formulario.", 
            errors: fieldErrors 
        };
    }

    const validatedData = validation.data;
    
    // 2. OBTENER ID DEL USUARIO
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: true, message: "No autenticado. Por favor, inicia sesión de nuevo." };
    }

    // 3. CONSTRUIR OBJETO PARA LA BASE DE DATOS
    const reportToInsert: ServiceReportInsert = {
        technician_id: user.id,
        client_name: validatedData.client_name,
        machine_model: validatedData.machine_model,
        machine_serial: validatedData.machine_serial,
        type: validatedData.type, // 'Puesta en Marcha'
        status: 'finalizado',
        checklist_data: validatedData.responses,
    };

    // 4. INSERCIÓN EN SUPABASE
    // CORRECCIÓN: Quitamos 'as never' porque ya actualizamos database.types.ts
    // Ahora TypeScript reconoce la tabla 'service_reports' y sus tipos.
    const { error } = await supabase
        .from('service_reports') 
        .insert(reportToInsert); 
    
    if (error) {
        console.error("Error al guardar reporte en DB:", error);
        return { error: true, message: `Error en la base de datos: ${error.message}` };
    }

    // 5. ÉXITO
    revalidatePath('/dashboard/services');
    return { success: true, message: "Reporte de Puesta en Marcha guardado con éxito." };
}
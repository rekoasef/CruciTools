'use server';

import { createClient } from "@/utils/supabase/server";
import { AssignmentSchema, AssignmentData } from "@/lib/schemas/assignment-schema";
import { revalidatePath } from "next/cache";

interface ActionResponse {
    error: boolean;
    message: string;
    errors?: Record<string, string[] | undefined>;
}

// =========================================================
// 1. CREAR ASIGNACIÓN
// =========================================================
export async function createAssignment(data: AssignmentData): Promise<ActionResponse | { success: true, message: string }> {
    
    // 1. VALIDACIÓN CON ZOD
    const validation = AssignmentSchema.safeParse(data);

    if (!validation.success) {
        const fieldErrors = validation.error.flatten().fieldErrors;
        return { 
            error: true, 
            message: "Error de validación en el formulario.", 
            errors: fieldErrors 
        };
    }

    const validatedData = validation.data;
    
    // 2. VERIFICAR ROL
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: true, message: "No autenticado. Permiso denegado." };
    }
    
    // 3. CONSTRUIR OBJETO PARA LA INSERCIÓN
    // Ahora TypeScript reconocerá validatedData.origin_location porque actualizamos el Schema
    const assignmentToInsert = {
        technician_id: validatedData.technician_id,
        service_type_id: validatedData.service_type_id,
        client_name: validatedData.client_name,
        machine_model: validatedData.machine_model,
        machine_serial: validatedData.machine_serial,
        
        // Datos de Logística
        client_location: validatedData.client_location,
        origin_location: validatedData.origin_location,
        distance_km: validatedData.distance_km,
        
        notes: validatedData.notes,
        due_date: validatedData.due_date ? new Date(validatedData.due_date).toISOString() : null,
    };

    // 4. INSERCIÓN EN SUPABASE
    const { error } = await supabase
        .from('assignments')
        //@ts-ignore 
        .insert(assignmentToInsert);
    
    if (error) {
        console.error("Error al crear asignación:", error);
        return { error: true, message: `Error en la base de datos: ${error.message}` };
    }

    revalidatePath('/dashboard/assignments'); 
    return { success: true, message: `Asignación creada (${validatedData.distance_km} km estimados).` };
}

// =========================================================
// 2. ACTUALIZAR ESTADO
// =========================================================
export async function updateAssignmentStatus(assignmentId: string, newStatus: 'en_progreso' | 'cancelado') {
    const supabase = createClient();
    
    const { error } = await supabase
        .from('assignments')
        //@ts-ignore
        .update({ status: newStatus })
        .eq('id', assignmentId);

    if (error) {
        return { error: true, message: `Error de DB: ${error.message}` };
    }

    revalidatePath('/dashboard');
    revalidatePath('/dashboard/assignments');
    return { success: true, message: `Estado actualizado a ${newStatus}.` };
}

// =========================================================
// 3. ENLAZAR REPORTE
// =========================================================
export async function linkReportToAssignment(assignmentId: string, reportId: string) {
    const supabase = createClient();

    const { error } = await supabase
        .from('assignments')
        //@ts-ignore
        .update({ status: 'finalizado', finished_report_id: reportId })
        .eq('id', assignmentId);

    if (error) {
        return { error: true, message: `Error al enlazar: ${error.message}` };
    }

    revalidatePath('/dashboard');
    revalidatePath('/dashboard/assignments');
    return { success: true, message: "Asignación completada." };
}
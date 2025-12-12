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
// 1. CREAR ASIGNACIÓN (CORREGIDO)
// =========================================================
export async function createAssignment(data: any): Promise<ActionResponse | { success: true, message: string }> {
    
    // 1. VALIDACIÓN
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
    
    // 2. AUTH
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: true, message: "No autenticado. Permiso denegado." };
    }
    
    // 3. CONSTRUIR OBJETO CON FECHAS SEGURAS
    
    // Función Helper para limpiar la fecha:
    // Si viene "2025-12-15T15:00:00..." -> lo corta a "2025-12-15"
    // Si viene "2025-12-15" -> lo deja igual
    const cleanDate = (date: string) => date ? String(date).split('T')[0] : null;

    // FECHA INICIO (assigned_at)
    let assignedAt = new Date().toISOString(); // Por defecto HOY
    if (data.assigned_at) {
        const dateStr = cleanDate(data.assigned_at);
        // Agregamos T12:00:00 al string limpio
        if (dateStr) assignedAt = new Date(dateStr + 'T12:00:00').toISOString();
    }

    // FECHA FIN (due_date)
    let dueDate = null;
    if (validatedData.due_date) {
        const dateStr = cleanDate(validatedData.due_date);
        // Agregamos T12:00:00 al string limpio
        if (dateStr) dueDate = new Date(dateStr + 'T12:00:00').toISOString();
    }

    const assignmentToInsert = {
        technician_id: validatedData.technician_id,
        service_type_id: validatedData.service_type_id,
        client_name: validatedData.client_name,
        machine_model: validatedData.machine_model,
        machine_serial: validatedData.machine_serial,
        client_location: validatedData.client_location,
        origin_location: validatedData.origin_location,
        distance_km: validatedData.distance_km,
        notes: validatedData.notes,
        
        status: 'abierto', 
        assigned_at: assignedAt,
        due_date: dueDate,
    };

    // 4. INSERTAR
    const { error } = await supabase
        .from('assignments')
        //@ts-ignore 
        .insert(assignmentToInsert);
    
    if (error) {
        console.error("Error al crear asignación:", error);
        return { error: true, message: `Error en la base de datos: ${error.message}` };
    }

    revalidatePath('/dashboard/assignments'); 
    revalidatePath('/dashboard/calendar');
    return { success: true, message: `Asignación creada correctamente.` };
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

    if (error) return { error: true, message: `Error de DB: ${error.message}` };

    revalidatePath('/dashboard/assignments');
    revalidatePath('/dashboard/calendar');
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

    if (error) return { error: true, message: `Error al enlazar: ${error.message}` };

    revalidatePath('/dashboard/assignments');
    revalidatePath('/dashboard/calendar');
    return { success: true, message: "Asignación completada." };
}

// =========================================================
// 4. ELIMINAR ASIGNACIÓN
// =========================================================
export async function deleteAssignment(id: string) {
    const supabase = createClient();
    
    const { error } = await supabase
        .from('assignments')
        .delete()
        .eq('id', id);

    if (error) return { error: true, message: `Error al eliminar: ${error.message}` };

    revalidatePath('/dashboard/assignments');
    revalidatePath('/dashboard/assignments/list');
    revalidatePath('/dashboard/calendar');
    return { success: true, message: "Tarea eliminada correctamente." };
}

// =========================================================
// 5. ACTUALIZAR ASIGNACIÓN (EDITAR)
// =========================================================
export async function updateAssignment(id: string, data: any) {
    const supabase = createClient();

    const cleanDate = (date: string) => date ? String(date).split('T')[0] : null;

    const updateData: any = {
        technician_id: data.technician_id,
        service_type_id: data.service_type_id,
        client_name: data.client_name,
        machine_model: data.machine_model,
        machine_serial: data.machine_serial,
        client_location: data.client_location,
        notes: data.notes,
    };

    // Manejo seguro de fechas para update
    if (data.due_date) {
        const clean = cleanDate(data.due_date);
        if (clean) updateData.due_date = new Date(clean + 'T12:00:00').toISOString();
    }

    if (data.start_date) {
        const clean = cleanDate(data.start_date);
        if (clean) updateData.assigned_at = new Date(clean + 'T12:00:00').toISOString();
    }

    const { error } = await supabase
        .from('assignments')
        .update(updateData)
        .eq('id', id);

    if (error) return { error: true, message: `Error al actualizar: ${error.message}` };

    revalidatePath('/dashboard/assignments');
    revalidatePath('/dashboard/assignments/list');
    revalidatePath('/dashboard/calendar');
    return { success: true, message: "Tarea actualizada correctamente." };
}
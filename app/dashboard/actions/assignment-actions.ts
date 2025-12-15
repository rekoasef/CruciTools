'use server';

import { createClient } from "@/utils/supabase/server";
import { AssignmentSchema } from "@/lib/schemas/assignment-schema";
import { revalidatePath } from "next/cache";

interface ActionResponse {
    error: boolean;
    message: string;
    errors?: Record<string, string[] | undefined>;
}

// =========================================================
// 1. CREAR ASIGNACIÓN
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
    // CORRECCIÓN: Agregado 'await'
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: true, message: "No autenticado. Permiso denegado." };
    }
    
    // 3. FECHAS SEGURAS (Evitar cambio de día por zona horaria)
    const cleanDate = (date: string) => date ? String(date).split('T')[0] : null;

    // FECHA INICIO (assigned_at)
    let assignedAt = new Date().toISOString(); 
    if (data.assigned_at) {
        const dateStr = cleanDate(data.assigned_at);
        if (dateStr) assignedAt = new Date(dateStr + 'T12:00:00').toISOString();
    }

    // FECHA FIN (due_date)
    let dueDate = null;
    if (validatedData.due_date) {
        const dateStr = cleanDate(validatedData.due_date);
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
    // @ts-ignore
    const { error } = await supabase.from('assignments').insert(assignmentToInsert);
    
    if (error) {
        console.error("Error al crear asignación:", error);
        return { error: true, message: `Error en la base de datos: ${error.message}` };
    }

    revalidatePath('/dashboard/assignments'); 
    revalidatePath('/dashboard/calendar');
    return { success: true, message: `Asignación creada correctamente.` };
}

// =========================================================
// 2. ACTUALIZAR ESTADO (Iniciar / Cancelar)
// =========================================================
export async function updateAssignmentStatus(assignmentId: string, newStatus: 'en_progreso' | 'cancelado') {
    // CORRECCIÓN: Agregado 'await'
    const supabase = await createClient();
    
    const { error } = await supabase
        .from('assignments')
        // @ts-ignore
        .update({ status: newStatus })
        .eq('id', assignmentId);

    if (error) return { error: true, message: `Error de DB: ${error.message}` };

    revalidatePath('/dashboard/assignments');
    revalidatePath('/dashboard/services'); // Mis Tareas
    revalidatePath(`/dashboard/assignments/${assignmentId}/complete`);
    return { success: true, message: `Estado actualizado a ${newStatus}.` };
}

// =========================================================
// 3. OBTENER REPORTES RECIENTES (Para el Dropdown)
// =========================================================
export async function getMyRecentReports() {
    // CORRECCIÓN: Agregado 'await'
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data } = await supabase
        .from('service_reports')
        .select('id, client_name, machine_model, created_at, type')
        .eq('technician_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

    return data || [];
}

// =========================================================
// 4. FINALIZAR TAREA Y VINCULAR REPORTE
// =========================================================
export async function finalizeAssignment(assignmentId: string, reportId: string) {
    // CORRECCIÓN: Agregado 'await'
    const supabase = await createClient();
    
    try {
        const { error } = await supabase
            .from('assignments')
            // @ts-ignore
            .update({ 
                status: 'finalizado',
                finished_report_id: reportId,
                due_date: new Date().toISOString() // Marcamos la fecha real de fin
            })
            .eq('id', assignmentId);

        if (error) throw error;

        revalidatePath('/dashboard/assignments');
        revalidatePath('/dashboard/services');
        revalidatePath(`/dashboard/assignments/${assignmentId}/complete`);
        
        return { success: true, message: "Tarea finalizada correctamente." };
    } catch (error: any) {
        console.error("Error al finalizar:", error);
        return { success: false, message: error.message || "Error al finalizar." };
    }
}

// =========================================================
// 5. ELIMINAR ASIGNACIÓN
// =========================================================
export async function deleteAssignment(id: string) {
    // CORRECCIÓN: Agregado 'await'
    const supabase = await createClient();
    
    const { error } = await supabase
        .from('assignments')
        .delete()
        .eq('id', id);

    if (error) return { error: true, message: `Error al eliminar: ${error.message}` };

    revalidatePath('/dashboard/assignments');
    revalidatePath('/dashboard/calendar');
    return { success: true, message: "Tarea eliminada correctamente." };
}

// =========================================================
// 6. EDITAR ASIGNACIÓN
// =========================================================
export async function updateAssignment(id: string, data: any) {
    // CORRECCIÓN: Agregado 'await'
    const supabase = await createClient();

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
        // @ts-ignore
        .update(updateData)
        .eq('id', id);

    if (error) return { error: true, message: `Error al actualizar: ${error.message}` };

    revalidatePath('/dashboard/assignments');
    revalidatePath('/dashboard/calendar');
    return { success: true, message: "Tarea actualizada correctamente." };
}
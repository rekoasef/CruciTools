'use server';

import { createClient } from "@/utils/supabase/server";
import { Database } from "@/lib/database.types"; 

// Tipos base necesarios, usando @ts-ignore por el problema de tipado persistente en el IDE
//@ts-ignore
export type ServiceReportRow = Database['public']['Tables']['service_reports']['Row'];
//@ts-ignore
export type ProfileRow = Database['public']['Tables']['profiles']['Row'];
//@ts-ignore
export type AssignmentBaseRow = Database['public']['Tables']['assignments']['Row'];

// Tipos extendidos para los JOINs en las consultas
//@ts-ignore
export type AssignmentRow = AssignmentBaseRow & {
    profiles: Pick<ProfileRow, 'full_name'> | null;
    service_types: { name: string } | null;
};
export type UnlinkedReportRow = Pick<ServiceReportRow, 'id' | 'client_name' | 'machine_model' | 'created_at'>;


// =========================================================
// 1. CONSULTAS DE REPORTE/PERFIL
// =========================================================

/**
 * Función que obtiene el historial de reportes de servicio del usuario logueado.
 */
export async function getServiceReports() {
    const supabase = createClient();

    const { data, error } = await supabase
    //@ts-ignore
        .from('service_reports')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching service reports:", error.message);
        return { reports: null, error: error.message };
    }

    return { reports: data as ServiceReportRow[], error: null };
}

/**
 * DEBUG: Función con Logs para detectar el fallo al obtener el perfil.
 */
export async function getProfileInfo() {
    console.log("--- INICIO DEBUG: getProfileInfo ---");
    
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        console.error("DEBUG: Error de Auth o No Usuario:", authError?.message);
        return { user: null, profile: null };
    }

    console.log("DEBUG: Usuario autenticado ID:", user.id);

    // Consulta de Perfil
    const { data: profile, error } = await supabase
        .from('profiles')
        .select('full_name, role')
        .eq('id', user.id)
        .single();
    
    if (error) {
        // AQUÍ ES DONDE VEREMOS SI PERSISTE ALGÚN ERROR EN LA TERMINAL
        console.error("!!! DEBUG ERROR CRÍTICO EN DB !!!:", error.message);
        console.error("Código de error:", error.code);
        return { user, profile: null };
    }
    
    console.log("DEBUG: Perfil obtenido correctamente:", profile);
    console.log("--- FIN DEBUG ---");

    //@ts-ignore
    return { user, profile: profile as ProfileRow | null };
}

/**
 * Función que obtiene un reporte específico por su ID.
 */
export async function getReportDetails(reportId: string) {
    const supabase = createClient();

    const { data: report, error } = await supabase
        .from('service_reports')
        //@ts-ignore
        .select('*, profiles (full_name)') 
        .eq('id', reportId)
        .single();
    
    if (error) {
        console.error(`Error fetching report ${reportId}:`, error.message);
        return { report: null, error: error.message };
    }

    return { report, error: null };
}

/**
 * Función que calcula los KPIs del mecánico logueado (Servicios del mes).
 */
export async function getTechnicianKPIs() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { monthlyCount: 0, error: "No autenticado" };
    }

    // Calcular el inicio y fin del mes actual
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString();
    
    // Contar servicios completados este mes
    const { count, error } = await supabase
        .from('service_reports')
        //@ts-ignore
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startOfMonth)
        .lte('created_at', endOfMonth);
    
    if (error) {
        console.error("Error fetching monthly KPI:", error.message);
        return { monthlyCount: 0, error: error.message };
    }

    return { 
        monthlyCount: count || 0, 
        error: null,
        monthName: now.toLocaleDateString('es-AR', { month: 'long' })
    };
}


// =========================================================
// 2. CONSULTAS DE ASIGNACIÓN/MAESTRAS
// =========================================================

/**
 * Obtiene la lista de todos los técnicos activos (para asignación de tareas).
 */
export async function getTechniciansList() {
    const supabase = createClient();

    // Solo seleccionamos usuarios con el rol 'mecanico' para las asignaciones
    const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('role', 'mecanico');

    if (error) {
        console.error("Error fetching technicians list:", error.message);
        return { technicians: [], error: error.message };
    }

    // Retornamos solo los que tienen nombre
    const technicians = data.filter(t => t.full_name) as { id: string, full_name: string }[];
    return { technicians, error: null };
}

/**
 * Obtiene la lista de tipos de servicio disponibles.
 */
export async function getServiceTypesList() {
    const supabase = createClient();
    
    const { data, error } = await supabase
        .from('service_types')
        .select('id, name');

    if (error) {
        console.error("Error fetching service types:", error.message);
        return { serviceTypes: [], error: error.message };
    }

    return { serviceTypes: data as { id: string, name: string }[], error: null };
}

/**
 * Obtiene la lista de asignaciones, opcionalmente filtrada por técnico.
 */
export async function getAssignmentsList(technicianId?: string) {
    const supabase = createClient();

    let query = supabase
        .from('assignments')
        //@ts-ignore
        .select(`
            id, client_name, machine_model, machine_serial, client_location, notes, status, assigned_at, due_date, technician_id, service_type_id,
            profiles (full_name), 
            service_types (name) 
        `)
        .order('assigned_at', { ascending: false });

    if (technicianId) {
        query = query.eq('technician_id', technicianId);
    }
    
    const { data, error } = await query;

    if (error) {
        console.error("Error fetching assignments list:", error.message);
        return { assignments: [], error: error.message };
    }

    return { assignments: data as AssignmentRow[], error: null };
}

/**
 * Obtiene los reportes finalizados del técnico actual que aún no han sido enlazados
 * a una asignación (ideal para el selector de 'Completar Tarea').
 */
export async function getUnlinkedReports(technicianId: string) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('service_reports')
        //@ts-ignore
        .select('id, client_name, machine_model, created_at')
        .eq('technician_id', technicianId)
        .eq('status', 'finalizado')
        .order('created_at', { ascending: false });


    if (error) {
        console.error("Error fetching unlinked reports:", error.message);
        return { reports: [], error: error.message };
    }
    
    return { reports: data as UnlinkedReportRow[], error: null };
}

// =========================================================
// 3. CONSULTAS DE COORDINADOR (FASE 3.5)
// =========================================================

/**
 * Obtiene todos los perfiles registrados en la aplicación.
 * (Solo accesible y útil para el Coordinador).
 */
export async function getAllProfiles() {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('full_name', { ascending: true });

    if (error) {
        console.error("Error fetching all profiles:", error.message);
        return { profiles: [], error: error.message };
    }

    return { profiles: data as ProfileRow[], error: null };
}
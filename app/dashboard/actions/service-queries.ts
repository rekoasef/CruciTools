'use server';

import { createClient } from "@/utils/supabase/server";
import { Database } from "@/lib/database.types"; 

// =========================================================
// TIPOS EXPORTADOS (Corrección Aquí)
// =========================================================

// Tipos base de tablas
export type ServiceReportRow = Database['public']['Tables']['service_reports']['Row'];
export type ProfileRow = Database['public']['Tables']['profiles']['Row'];
export type AssignmentBaseRow = Database['public']['Tables']['assignments']['Row'];

// Tipos extendidos con relaciones (JOINs)
export type AssignmentRow = AssignmentBaseRow & {
    profiles: { full_name: string | null } | null;
    service_types: { name: string } | null;
};

export type UnlinkedReportRow = Pick<ServiceReportRow, 'id' | 'client_name' | 'machine_model' | 'created_at'>;


// =========================================================
// 1. USUARIOS Y PERFILES
// =========================================================

/**
 * Obtiene información del perfil actual y el usuario auth
 */
export async function getProfileInfo() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { user: null, profile: null };

    const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
    
    if (error) {
        console.error("Error fetching profile:", error.message);
        return { user, profile: null };
    }
    
    return { user, profile: profile as ProfileRow };
}

/**
 * Obtiene todos los perfiles (Para gestión de usuarios - Coordinador)
 */
export async function getAllProfiles() {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('full_name', { ascending: true });

    if (error) return { profiles: [], error: error.message };

    return { profiles: data as ProfileRow[], error: null };
}

/**
 * Obtiene lista de técnicos (Alias para dropdowns de asignación)
 */
export async function getTechnicians() {
    const supabase = createClient();
    
    const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('role', 'mecanico')
        .order('full_name', { ascending: true });

    if (error) return { data: [], error: error.message };

    // Mapeamos para asegurar compatibilidad
    const technicians = data?.map(t => ({ id: t.id, full_name: t.full_name || 'Sin Nombre' })) || [];

    return { data: technicians, error: null };
}


// =========================================================
// 2. REPORTES DE SERVICIO
// =========================================================

/**
 * Historial de reportes (General)
 */
export async function getServiceReports() {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('service_reports')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) return { reports: null, error: error.message };

    return { reports: data as ServiceReportRow[], error: null };
}

/**
 * Detalles de un reporte específico
 */
export async function getReportDetails(reportId: string) {
    const supabase = createClient();

    const { data: report, error } = await supabase
        .from('service_reports')
        .select('*, profiles (full_name)') 
        .eq('id', reportId)
        .single();
    
    if (error) return { report: null, error: error.message };

    return { report, error: null };
}

/**
 * Reportes finalizados sin asignar (Para enlazar a tareas)
 */
export async function getUnlinkedReports(technicianId: string) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('service_reports')
        .select('id, client_name, machine_model, created_at')
        .eq('technician_id', technicianId)
        .eq('status', 'finalizado')
        .order('created_at', { ascending: false });

    if (error) return { reports: [], error: error.message };
    
    return { reports: data as UnlinkedReportRow[], error: null };
}

/**
 * KPI: Servicios del mes
 */
export async function getTechnicianKPIs() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { monthlyCount: 0, error: "No autenticado" };

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString();
    
    const { count, error } = await supabase
        .from('service_reports')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startOfMonth)
        .lte('created_at', endOfMonth);
    
    if (error) return { monthlyCount: 0, error: error.message };

    return { 
        monthlyCount: count || 0, 
        error: null,
        monthName: now.toLocaleDateString('es-AR', { month: 'long' })
    };
}


// =========================================================
// 3. TIPOS DE SERVICIO Y ASIGNACIONES
// =========================================================

/**
 * Obtiene tipos de servicio activos (Para dropdowns)
 */
export async function getServiceTypes() {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('service_types')
        .select('id, name')
        .eq('is_active', true)
        .order('name', { ascending: true });

    if (error) return { data: [], error: error.message };

    return { data: data || [], error: null };
}

/**
 * Lista de asignaciones (Legacy o uso general)
 */
export async function getAssignmentsList(technicianId?: string) {
    const supabase = createClient();

    let query = supabase
        .from('assignments')
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

    if (error) return { assignments: [], error: error.message };

    return { assignments: data as AssignmentRow[], error: null };
}
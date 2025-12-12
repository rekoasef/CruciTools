'use server';

import { createClient } from "@/utils/supabase/server";

export async function getCalendarEvents() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { events: [] };

    // Obtenemos el perfil para saber el rol
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    let query = supabase
        .from('assignments')
        .select(`
            id,
            client_name,
            machine_model,
            client_location,
            assigned_at, 
            due_date,
            status,
            technician_id,
            profiles ( full_name ),
            service_types ( name )
        `)
        .neq('status', 'cancelado')
        // --- CORRECCIÓN CLAVE: Ordenar siempre para evitar error de Hidratación ---
        .order('assigned_at', { ascending: true }); 

    // Si es mecánico, solo sus tareas. Si es coordinador, todas.
    if (profile?.role === 'mecanico') {
        query = query.eq('technician_id', user.id);
    }

    const { data, error } = await query;

    if (error) {
        console.error("Error fetching calendar:", error);
        return { events: [] };
    }

    // Mapeamos los datos y ASEGURAMOS que no haya nulls en campos de texto
    const events = (data as any[]).map(item => ({
        id: item.id,
        title: item.client_name || 'Sin Cliente', 
        machine: item.machine_model || 'N/A',
        location: item.client_location || null, 
        start: item.assigned_at, 
        end: item.due_date || item.assigned_at, 
        status: item.status || 'abierto',
        technicianId: item.technician_id,
        technicianName: item.profiles?.full_name || 'Sin Técnico', 
        serviceType: item.service_types?.name || 'Servicio General'
    }));

    return { events };
}
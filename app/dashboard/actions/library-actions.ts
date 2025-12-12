'use server';

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { Database } from "@/lib/database.types";

// Tipado estricto
type LibraryItem = Database['public']['Tables']['library_items']['Row'];
type LibraryType = Database['public']['Enums']['library_type'];

/**
 * Obtiene los ítems de una carpeta específica
 */
export async function getLibraryItems(folderId: string | null) {
    const supabase = createClient();
    
    let query = supabase
        .from('library_items')
        .select('*')
        .order('type', { ascending: true }) 
        .order('name', { ascending: true });

    if (folderId) {
        query = query.eq('parent_id', folderId);
    } else {
        query = query.is('parent_id', null);
    }

    const { data, error } = await query;

    if (error) {
        console.error("Error fetching library:", error);
        return { items: [], error: error.message };
    }

    return { items: data as LibraryItem[], error: null };
}

/**
 * Obtiene info de carpeta para breadcrumbs
 */
export async function getFolderDetails(folderId: string) {
    const supabase = createClient();
    const { data } = await supabase.from('library_items').select('id, name, parent_id').eq('id', folderId).single();
    return data;
}

/**
 * CREAR: Nueva carpeta o archivo
 */
export async function createLibraryItem(formData: FormData) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "No autenticado" };
    
    const name = formData.get('name') as string;
    const type = formData.get('type') as LibraryType;
    const url = formData.get('url') as string;
    const parentId = formData.get('parent_id') as string || null;

    if (!name || !type) return { error: "Faltan datos obligatorios" };
    if (type !== 'folder' && !url) return { error: "Los archivos requieren un enlace URL" };

    const { error } = await supabase.from('library_items').insert({
        name,
        type,
        url: type === 'folder' ? null : url,
        parent_id: parentId,
        created_by: user.id
    });

    if (error) return { error: error.message };

    revalidatePath('/dashboard/library');
    return { success: true };
}

// ==========================================
// NUEVAS ACCIONES (UPDATE / DELETE)
// ==========================================

/**
 * ELIMINAR: Borra un ítem (si es carpeta, borra todo su contenido por cascada)
 */
export async function deleteLibraryItem(itemId: string) {
    const supabase = createClient();
    
    // Verificar permisos (solo coordinador puede borrar, validado por RLS también)
    const { error } = await supabase
        .from('library_items')
        .delete()
        .eq('id', itemId);

    if (error) {
        return { error: error.message };
    }

    revalidatePath('/dashboard/library');
    return { success: true };
}

/**
 * ACTUALIZAR: Renombra un ítem
 */
export async function renameLibraryItem(itemId: string, newName: string) {
    const supabase = createClient();

    if (!newName || newName.trim().length === 0) {
        return { error: "El nombre no puede estar vacío" };
    }

    const { error } = await supabase
        .from('library_items')
        .update({ name: newName })
        .eq('id', itemId);

    if (error) {
        return { error: error.message };
    }

    revalidatePath('/dashboard/library');
    return { success: true };
}
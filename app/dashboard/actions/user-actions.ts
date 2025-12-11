'use server';

import { createAdminClient } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server"; // Cliente normal para verificar permisos
import { CreateUserSchema, CreateUserData } from "@/lib/schemas/user-schema";
import { revalidatePath } from "next/cache";

interface ActionResponse {
    error: boolean;
    message: string;
    errors?: Record<string, string[] | undefined>;
}

export async function createNewUser(data: CreateUserData): Promise<ActionResponse> {
    // 1. Validar permisos del usuario actual (Guardrail de seguridad)
    // Aunque la página está protegida, aseguramos la acción.
    const supabase = createClient();
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    
    if (!currentUser) {
        return { error: true, message: "No autenticado." };
    }

    // Verificar si es coordinador consultando su perfil
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', currentUser.id)
        .single();

    if (profile?.role !== 'coordinador') {
        return { error: true, message: "Acceso denegado. Solo los coordinadores pueden crear usuarios." };
    }

    // 2. Validar datos del formulario con Zod
    const validation = CreateUserSchema.safeParse(data);
    if (!validation.success) {
        return { 
            error: true, 
            message: "Datos inválidos.", 
            errors: validation.error.flatten().fieldErrors 
        };
    }

    const { email, password, fullName, role } = validation.data;

    // 3. Crear usuario usando el ADMIN Client
    const supabaseAdmin = createAdminClient();

    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true, // Confirmamos el email automáticamente para que pueda entrar ya
        user_metadata: {
            full_name: fullName, // Esto lo usará el Trigger para llenar la tabla profiles
            role: role // Guardamos el rol en metadata también por si acaso
        }
    });

    if (createError) {
        console.error("Error creating user:", createError);
        return { error: true, message: `Error al crear usuario: ${createError.message}` };
    }

    if (!newUser.user) {
        return { error: true, message: "No se pudo obtener el ID del nuevo usuario." };
    }

    // 4. Asegurar el rol en la tabla profiles
    // Aunque el trigger crea el perfil, por defecto pone 'mecanico'. 
    // Si elegimos 'coordinador', forzamos la actualización aquí.
    if (role === 'coordinador') {
        const { error: updateError } = await supabaseAdmin
            .from('profiles')
            .update({ role: 'coordinador' })
            .eq('id', newUser.user.id);

        if (updateError) {
            console.error("Error updating role:", updateError);
            // No retornamos error fatal porque el usuario ya se creó, solo avisamos.
        }
    }

    // 5. Finalizar
    revalidatePath('/dashboard/users');
    return { error: false, message: `Usuario ${fullName} creado exitosamente.` };
}
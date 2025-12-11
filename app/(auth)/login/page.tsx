// RUTA: /app/(auth)/login/page.tsx
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { signIn } from "../actions";
import TestLogin from "./TestLogin"; // <-- Componente de prueba forzada
import { createClient } from "@/utils/supabase/server";

export default async function LoginPage({
    searchParams,
}: {
    searchParams: { error: string };
}) {
    // Definición de la Server Action que se usa en el formulario
    const signInAction = async (formData: FormData) => {
        "use server";
        const result = await signIn(formData);
        if (result?.error) {
            redirect(`/login?error=${result.error}`);
        }
    };

    // Guardrail: Redirigir si ya está logueado
    const supabase = createClient();
    const { data } = await supabase.auth.getUser();

    if (data?.user) {
        redirect("/dashboard");
    }
    
    // Obtener el error del URL si existe
    const errorMessage = searchParams.error || null;

    return (
        <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">Iniciar Sesión</h1>
            
            <form
                className="flex flex-col w-full justify-center gap-4 text-foreground bg-white p-8 rounded-xl shadow-lg border border-gray-200"
                action={signInAction}
            >
                <label className="text-md text-gray-700" htmlFor="email">
                    Correo Electrónico
                </label>
                <input
                    className="rounded-md px-4 py-2 bg-inherit border focus:border-brand-red focus:ring-brand-red outline-none transition-colors"
                    name="email"
                    placeholder="you@example.com"
                    required
                />
                
                <label className="text-md text-gray-700" htmlFor="password">
                    Contraseña
                </label>
                <input
                    className="rounded-md px-4 py-2 bg-inherit border focus:border-brand-red focus:ring-brand-red outline-none transition-colors mb-4"
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    required
                />
                
                {/* Lógica de inicio de sesión normal */}
                <button 
                    className="bg-brand-red hover:bg-red-700 rounded-md px-4 py-3 text-white font-bold transition-colors mb-2"
                >
                    Iniciar Sesión
                </button>
                
                {/* Mensaje de error (si existe) */}
                {errorMessage && (
                    <p className="mt-4 p-3 bg-red-100 border border-status-error text-status-error text-sm rounded-md text-center">
                        {errorMessage}
                    </p>
                )}
                
                <p className="text-sm text-center text-gray-500">
                    ¿Aún no tienes cuenta? 
                    <Link href="/register" className="text-brand-red hover:underline ml-1">
                        Regístrate
                    </Link>
                </p>
            </form>

            {/* INYECCIÓN DEL BOTÓN DE PRUEBA FORZADO */}
            <TestLogin /> 
        </div>
    );
}
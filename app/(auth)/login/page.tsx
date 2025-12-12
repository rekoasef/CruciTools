// RUTA: /app/(auth)/login/page.tsx
import { redirect } from "next/navigation";
import { signIn } from "../actions";
import { createClient } from "@/utils/supabase/server";
import { Wrench } from "lucide-react"; // Agregamos un ícono para el logo

export default async function LoginPage({
    searchParams,
}: {
    searchParams: { error: string };
}) {
    // Definición de la Server Action
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
    
    const errorMessage = searchParams.error || null;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
            {/* Cabecera con Logo */}
            <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center mb-8">
                <div className="h-16 w-16 bg-red-100 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                    <Wrench className="h-8 w-8 text-brand-red" />
                </div>
                <h2 className="text-center text-3xl font-extrabold text-gray-900 tracking-tight">
                    CruciTools
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Gestión Postventa y Servicios Técnicos
                </p>
            </div>

            {/* Tarjeta del Formulario */}
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-10 shadow-2xl shadow-gray-200/50 rounded-2xl border border-gray-100">
                    <form className="space-y-6" action={signInAction}>
                        
                        {/* Input Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Correo Electrónico
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    placeholder="usuario@crucianelli.com"
                                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red sm:text-sm transition-all duration-200"
                                />
                            </div>
                        </div>

                        {/* Input Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Contraseña
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    placeholder="••••••••"
                                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red sm:text-sm transition-all duration-200"
                                />
                            </div>
                        </div>

                        {/* Botón */}
                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-brand-red/30 text-sm font-bold text-white bg-brand-red hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-red transition-all duration-200 transform hover:-translate-y-0.5"
                            >
                                Iniciar Sesión
                            </button>
                        </div>

                        {/* Mensaje de Error */}
                        {errorMessage && (
                            <div className="rounded-lg bg-red-50 p-4 border border-red-100 animate-in fade-in slide-in-from-top-2">
                                <div className="flex">
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-red-800">
                                            Error de autenticación
                                        </h3>
                                        <div className="mt-2 text-sm text-red-700">
                                            <p>{errorMessage}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}
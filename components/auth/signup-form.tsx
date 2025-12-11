"use client";

import { useState } from "react";
import { signUp } from "@/app/(auth)/actions"; // Importamos la acción del servidor
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignUpForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Llamamos a la Server Action
    const result = await signUp(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setSuccess("Cuenta creada. Redirigiendo...");
      // Opcional: Redirigir o mostrar mensaje de verificar email
      // router.push('/login'); 
      setLoading(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      
      {/* Mensajes de Alerta */}
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded text-sm border border-red-200">
          ⚠️ {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 text-green-600 p-3 rounded text-sm border border-green-200">
          ✅ {success}
        </div>
      )}

      {/* Nombre Completo */}
      <div>
        <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
          Nombre Completo
        </label>
        <input
          id="full_name"
          name="full_name"
          type="text"
          required
          placeholder="Ej. Juan Pérez"
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-brand-red/50 focus:border-brand-red"
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Correo Electrónico
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="coordinador@crucianelli.com"
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-brand-red/50 focus:border-brand-red"
        />
      </div>

      {/* Contraseña */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          placeholder="••••••••"
          minLength={6}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-brand-red/50 focus:border-brand-red"
        />
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="btn-primary w-full py-3 flex justify-center items-center"
      >
        {loading ? (
          <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
        ) : (
          "Registrar Coordinador"
        )}
      </button>

      <div className="mt-6 text-center text-sm">
        <span className="text-gray-500">¿Ya tienes cuenta? </span>
        <Link href="/login" className="text-brand-red font-medium hover:underline">
          Iniciar Sesión
        </Link>
      </div>
    </form>
  );
}
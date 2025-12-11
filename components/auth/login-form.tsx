"use client";

import { useState } from "react";
import { signIn } from "@/app/(auth)/actions";
// import Link from "next/link"; // <-- Ya no lo necesitamos visible

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    const result = await signIn(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-5">
      
      {/* Mensajes de Error */}
      {error && (
        <div className="bg-red-50 text-brand-red p-3 rounded text-sm border-l-4 border-brand-red flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          {error}
        </div>
      )}

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
          Correo Corporativo
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="usuario@crucianelli.com"
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all placeholder-gray-400"
        />
      </div>

      {/* Contraseña */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <label htmlFor="password" className="block text-xs font-bold text-gray-500 uppercase tracking-wide">
            Contraseña
          </label>
        </div>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="••••••••"
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all placeholder-gray-400"
        />
      </div>

      {/* Botón de envío */}
      <button 
        type="submit" 
        disabled={loading}
        className="btn-primary w-full py-3 mt-4 flex justify-center items-center text-sm font-bold uppercase tracking-wider shadow-lg hover:shadow-xl transform active:scale-95 transition-all"
      >
        {loading ? (
          <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
        ) : (
          "Acceder al Sistema"
        )}
      </button>

      {/* Mensaje de soporte en lugar de registro */}
      <div className="mt-6 text-center text-xs text-gray-400">
        ¿Problemas para ingresar? <br/>
        Contacta al <span className="text-gray-600 font-semibold cursor-pointer hover:text-brand-red">Administrador de Sistemas</span>
      </div>
    </form>
  );
}
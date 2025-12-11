// RUTA: /app/(auth)/login/TestLogin.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client'; // Importar el cliente de navegador

export default function TestLogin() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    setMessage('');

    const supabase = createClient(); // Cliente de Navegador
    
    // USUARIO DE PRUEBA CREADO POR ÚLTIMA VEZ EN SQL
    const email = 'admin.limpio@crucitools.com'; 
    const password = 'Clave.Segura'; // La última contraseña que definiste en SQL

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Fallo de autenticación de cliente:", error);
      setMessage(`Fallo crítico: ${error.message}.`);
    } else {
      setMessage('Éxito! Redirigiendo...');
      router.refresh(); // Forzar la recarga del Server Component
      router.push('/dashboard');
    }
    setLoading(false);
  };

  return (
    <div className="mt-8 p-4 border border-red-400 bg-red-50 rounded-lg">
      <h3 className="text-lg font-bold text-red-700">SOLUCIÓN DE PRUEBA DE INFRAESTRUCTURA</h3>
      <p className="text-sm text-red-600 mb-3">
        Usaremos el cliente de navegador para forzar el inicio de sesión y generar nuevas cookies limpias.
      </p>
      
      <button 
        onClick={handleLogin}
        disabled={loading}
        className="w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors"
      >
        {loading ? 'Intentando Conexión...' : 'FORZAR LOGIN (admin.limpio@crucitools.com)'}
      </button>
      {message && <p className="mt-2 text-sm italic text-red-600">{message}</p>}
    </div>
  );
}
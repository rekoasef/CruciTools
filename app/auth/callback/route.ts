import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // Obtenemos los parámetros de la URL
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  
  // Si hay un parámetro "next", lo usamos para redirigir después, sino vamos al dashboard
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    // CORRECCIÓN: Agregamos 'await' aquí
    const supabase = await createClient();
    
    // Intercambia el código por una sesión
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // Si todo salió bien, redirigimos al usuario a la página destino
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Si hubo error o no hay código, redirigimos a una página de error
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
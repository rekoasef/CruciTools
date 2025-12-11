import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  // next es a donde redirigir despues de loguear
  const next = requestUrl.searchParams.get("next") || "/dashboard";

  if (code) {
    const cookieStore = cookies();
    const supabase = createClient();
    
    // Intercambia el código por una sesión
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Redirigir al usuario
  return NextResponse.redirect(`${requestUrl.origin}${next}`);
}
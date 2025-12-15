import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

// AHORA ESTA FUNCIÓN ES ASYNC (Requerido por Next.js 15/16)
export async function createClient() {
  // 1. Esperamos a que carguen las cookies
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Adaptador para leer cookies
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        // Adaptador para escribir cookies
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // Ignorar error si se llama desde un componente de servidor
          }
        },
        // Adaptador para borrar cookies
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch (error) {
            // Ignorar error
          }
        },
      },
    }
  );
}
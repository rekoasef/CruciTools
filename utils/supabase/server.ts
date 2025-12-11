import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from '@/lib/database.types'

export function createClient() {
  const cookieStore = cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    // UTILIZA LA CLAVE SECRETA DE SERVICIO (SERVICE_ROLE_KEY o ANON_KEY),
    // NO LA CLAVE SECRETA 'PUBLIC' aquí. USAR ANON_KEY es lo estándar para el cliente de servidor.
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, 
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // Esto solo ocurre en Server Actions cuando se redirige.
            console.warn("Cookie set error during redirect:", error);
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            console.warn("Cookie remove error during redirect:", error);
          }
        },
      },
    }
  )
}
import { type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Coincidir con todas las rutas excepto:
     * 1. /_next/static (archivos estáticos de Next.js)
     * 2. /_next/image (imágenes optimizadas)
     * 3. /favicon.ico (icono del navegador)
     * 4. /auth/callback (ruta necesaria para confirmar emails o OAuth)
     * 5. Archivos con extensión (png, jpg, css, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|auth/callback|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
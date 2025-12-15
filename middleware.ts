import { type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  // Tu lógica actual de Supabase (no la cambies, solo copia la configuración de abajo)
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Coincidir con todas las rutas de solicitud excepto las que comienzan con:
     * - _next/static (archivos estáticos)
     * - _next/image (archivos de optimización de imágenes)
     * - favicon.ico (archivo favicon)
     * - sw.js (Service Worker PWA) -> ¡IMPORTANTE!
     * - workbox- (Scripts de Workbox PWA) -> ¡IMPORTANTE!
     * - manifest.json (Manifiesto PWA) -> ¡IMPORTANTE!
     * - icons/ (Iconos de la PWA en public)
     * - images/ (Si tienes imágenes públicas)
     */
    '/((?!_next/static|_next/image|favicon.ico|sw.js|workbox-|manifest.json|icons/).*)',
  ],
};
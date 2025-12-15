import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  
  workboxOptions: {
    disableDevLogs: true,
    skipWaiting: true,
    clientsClaim: true,
    cleanupOutdatedCaches: true,
    
    runtimeCaching: [
      // ============================================================
      // 1. SUPABASE (Datos del simulador, etc.)
      // ============================================================
      {
        urlPattern: ({ url }) => url.hostname.includes('supabase.co'),
        // Aquí SÍ usamos StaleWhileRevalidate porque estos datos JSON 
        // rara vez rompen la app si son viejos.
        handler: "StaleWhileRevalidate",
        options: {
          cacheName: "supabase-data",
          expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 },
          cacheableResponse: { statuses: [0, 200] },
        },
      },
      
      // ============================================================
      // 2. NEXT.JS RSC (El causante de la pantalla blanca)
      // ============================================================
      {
        urlPattern: ({ url }) => url.searchParams.has('_rsc'),
        // CAMBIO CRÍTICO: Usamos NetworkFirst.
        // Online: Va a la red -> Datos correctos -> No hay pantalla blanca.
        // Offline: Falla red -> Usa caché -> Funciona offline.
        handler: "NetworkFirst",
        options: {
          cacheName: "next-rsc-cache",
          expiration: { maxEntries: 200, maxAgeSeconds: 24 * 60 * 60 },
          networkTimeoutSeconds: 5, // Espera 5s a la red, si falla, usa caché
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },

      // ============================================================
      // 3. ASSETS (Imágenes, Fuentes, CSS)
      // ============================================================
      {
        urlPattern: /\.(?:png|jpg|jpeg|svg|webp|gif|css|js|woff|woff2)$/i,
        handler: "StaleWhileRevalidate",
        options: {
          cacheName: "static-assets",
          expiration: { maxEntries: 500, maxAgeSeconds: 30 * 24 * 60 * 60 },
        },
      },

      // ============================================================
      // 4. PÁGINAS HTML (Navegación base)
      // ============================================================
      {
        urlPattern: ({ request }) => request.mode === 'navigate',
        handler: "NetworkFirst",
        options: {
          cacheName: "pages",
          networkTimeoutSeconds: 3,
          expiration: { maxEntries: 32, maxAgeSeconds: 24 * 60 * 60 },
        },
      },
    ],
  },
});

export default withPWA({
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
});
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Branding Crucianelli
        brand: {
          red: "#E40613",      // Rojo principal
          black: "#000000",    // Negro puro
          dark: "#1A1A1A",     // Gris oscuro (fondos secundarios/texto)
          gray: "#F5F5F5",     // Gris claro (fondos de tarjetas)
          white: "#FFFFFF",
        },
        // Semánticos para la UI
        status: {
          success: "#10B981", // Verde éxito
          warning: "#F59E0B", // Alerta
          error: "#EF4444",   // Error crítico
        }
      },
      fontFamily: {
        // Usaremos la fuente por defecto de Next.js (Inter) por ahora, 
        // pero preparada para cambiar si se requiere una fuente industrial.
        sans: ['var(--font-inter)'],
      },
    },
  },
  plugins: [],
};
export default config;
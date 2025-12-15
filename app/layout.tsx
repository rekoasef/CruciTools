import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CruciTools",
  description: "Plataforma de Asistencia Técnica",
  manifest: "/manifest.json", // <--- AGREGAR ESTO
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "CruciTools",
  },
};

// <--- AGREGAR ESTO TAMBIÉN
export const viewport: Viewport = {
  themeColor: "#e11d2b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Se siente más nativa si no se puede hacer zoom
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
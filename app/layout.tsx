import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "CruciTools | Gestión Postventa",
  description: "Herramientas digitales para mecánicos y coordinadores de Crucianelli.",
  manifest: "/manifest.json", // <--- ESTA LÍNEA ES CLAVE
  themeColor: "#E40613",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={cn(inter.variable, "bg-brand-gray min-h-screen font-sans")}>
        {children}
      </body>
    </html>
  );
}
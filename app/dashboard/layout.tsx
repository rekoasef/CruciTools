import Sidebar from "@/components/dashboard/sidebar";
import MobileNav from "@/components/dashboard/mobile-nav";
import { getProfileInfo } from "./actions/service-queries"; // Usamos la función que ya creamos

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Obtenemos el perfil en el servidor (Layout)
  const { profile } = await getProfileInfo();
  const role = profile?.role || 'mecanico'; // Por defecto mecanico si falla

  return (
    <div className="h-full relative">
      {/* Pasamos el rol como prop al Sidebar Desktop */}
      <Sidebar userRole={role} />

      {/* Pasamos el rol como prop al Nav Mobile */}
      <MobileNav userRole={role} />

      {/* Contenido Principal */}
      <main className="md:pl-64 min-h-screen bg-gray-50">
        <div className="container-main py-6">
          {children}
        </div>
      </main>
    </div>
  );
}
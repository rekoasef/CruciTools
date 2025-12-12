"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Calculator, 
  ClipboardCheck, 
  ClipboardList, 
  LogOut, 
  Wrench,
  Users,
  Briefcase,
  BookOpen // Nuevo ícono para biblioteca
} from "lucide-react";
import { signOut } from "@/app/(auth)/actions";

// Definimos los menús por rol
const MENU_ITEMS = {
  coordinador: [
    { name: "Inicio", href: "/dashboard", icon: LayoutDashboard },
    { name: "Gestión de Usuarios", href: "/dashboard/users", icon: Users },
    { name: "Asignaciones", href: "/dashboard/assignments", icon: Briefcase },
    { name: "Reportes Globales", href: "/dashboard/services", icon: ClipboardList },
    { name: "Biblioteca Técnica", href: "/dashboard/library", icon: BookOpen }, // Nuevo
  ],
  mecanico: [
    { name: "Inicio", href: "/dashboard", icon: LayoutDashboard },
    { name: "Mis Tareas", href: "/dashboard/services", icon: ClipboardList },
    { name: "Nuevo Checklist", href: "/dashboard/checklists", icon: ClipboardCheck },
    { name: "Calculadoras", href: "/dashboard/calculators/seeds", icon: Calculator },
    { name: "Biblioteca Técnica", href: "/dashboard/library", icon: BookOpen }, // Nuevo
  ]
};

interface SidebarProps {
  userRole?: 'coordinador' | 'mecanico' | string | null;
}

export default function Sidebar({ userRole = 'mecanico' }: SidebarProps) {
  const pathname = usePathname();
  
  // Seleccionamos el menú según el rol (fallback a mecanico si es null)
  const navItems = userRole === 'coordinador' ? MENU_ITEMS.coordinador : MENU_ITEMS.mecanico;

  return (
    <div className="hidden md:flex h-full w-64 flex-col fixed inset-y-0 z-50 bg-white border-r border-gray-200">
      {/* Logo Area */}
      <div className="flex h-16 items-center px-6 border-b border-gray-100">
        <div className="flex items-center gap-2 text-brand-red">
            <div className="bg-red-50 p-1.5 rounded-lg">
                <Wrench className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900 uppercase">CruciTools</span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 flex flex-col gap-1 p-4 overflow-y-auto">
        <div className="mb-2 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Menú {userRole === 'coordinador' ? 'Coordinación' : 'Técnico'}
        </div>
        
        {navItems.map((item) => {
          // Lógica para detectar activo (exacto o subruta, excepto dashboard root)
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(`${item.href}/`));
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                isActive 
                  ? "bg-red-50 text-brand-red shadow-sm"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive ? "text-brand-red" : "text-gray-400")} />
              {item.name}
            </Link>
          );
        })}
      </div>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-gray-100 bg-gray-50/50">
        <form action={signOut}>
            <button className="flex w-full items-center gap-3 px-4 py-2 text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
            <LogOut className="w-5 h-5" />
            Cerrar Sesión
            </button>
        </form>
      </div>
    </div>
  );
}
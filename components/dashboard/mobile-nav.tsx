"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, X, LayoutDashboard, Calculator, ClipboardCheck, ClipboardList, LogOut, Wrench, Users, Briefcase, BookOpen, Calendar } from "lucide-react";
import { signOut } from "@/app/(auth)/actions";

const MENU_ITEMS = {
  coordinador: [
    { name: "Inicio", href: "/dashboard", icon: LayoutDashboard },
    { name: "Gestión de Usuarios", href: "/dashboard/users", icon: Users },
    { name: "Asignaciones", href: "/dashboard/assignments", icon: Briefcase },
    { name: "Reportes Globales", href: "/dashboard/services", icon: ClipboardList },
    { name: "Biblioteca Técnica", href: "/dashboard/library", icon: BookOpen }, // Nuevo
    { name: "Agenda", href: "/dashboard/calendar", icon: Calendar },
  ],
  mecanico: [
    { name: "Inicio", href: "/dashboard", icon: LayoutDashboard },
    { name: "Mis Tareas", href: "/dashboard/services", icon: ClipboardList },
    { name: "Nuevo Checklist", href: "/dashboard/checklists", icon: ClipboardCheck },
    { name: "Calculadoras", href: "/dashboard/calculators/seeds", icon: Calculator },
    { name: "Biblioteca Técnica", href: "/dashboard/library", icon: BookOpen }, // Nuevo
    { name: "Agenda", href: "/dashboard/calendar", icon: Calendar },
  ]
};

interface MobileNavProps {
  userRole?: 'coordinador' | 'mecanico' | string | null;
}

export default function MobileNav({ userRole = 'mecanico' }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const navItems = userRole === 'coordinador' ? MENU_ITEMS.coordinador : MENU_ITEMS.mecanico;

  return (
    <div className="md:hidden bg-white sticky top-0 z-50 shadow-sm border-b border-gray-200">
      {/* Barra Superior */}
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
            <div className="bg-red-50 p-1.5 rounded-lg text-brand-red">
                <Wrench className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-gray-900 uppercase">CruciTools</span>
        </div>
        
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-gray-500 hover:bg-gray-100 rounded-md transition-colors"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Menú Desplegable */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-white border-b border-gray-200 shadow-xl animate-in slide-in-from-top-2">
          <div className="p-4 bg-gray-50 text-xs font-semibold text-gray-400 uppercase">
             Menú {userRole === 'coordinador' ? 'Coordinación' : 'Técnico'}
          </div>
          <nav className="flex flex-col p-4 pt-2 gap-2">
            {navItems.map((item) => {
               const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(`${item.href}/`));
               return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg",
                    isActive 
                      ? "bg-red-50 text-brand-red" 
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <item.icon className={cn("w-5 h-5", isActive ? "text-brand-red" : "text-gray-400")} />
                  {item.name}
                </Link>
              );
            })}
            
            <div className="border-t border-gray-100 my-2 pt-2">
                <form action={signOut}>
                    <button className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg">
                        <LogOut className="w-5 h-5" />
                        Salir
                    </button>
                </form>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}
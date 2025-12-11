import Link from "next/link";
import { Tractor, ArrowRight, Lock } from "lucide-react";

export default function StartupSelectionPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-gray-900">Puesta en Marcha</h1>
        <p className="text-gray-500">Selecciona el modelo de sembradora para iniciar el protocolo.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* DRILLOR - Activo */}
        <Link href="/dashboard/checklists/startup/drillor" className="group">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-brand-red/50 hover:shadow-md transition-all h-full relative">
            <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Tractor className="w-6 h-6 text-brand-red" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Drillor</h3>
            <p className="text-xs text-gray-500 mt-2 mb-4">Checklist IS22008-0</p>
            <div className="flex items-center text-sm font-semibold text-brand-red">
               Iniciar <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </div>
        </Link>

        {/* PLANTOR - Activo */}
        <Link href="/dashboard/checklists/startup/plantor" className="group">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-brand-red/50 hover:shadow-md transition-all h-full relative">
            <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Tractor className="w-6 h-6 text-brand-red" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Plantor</h3>
            <p className="text-xs text-gray-500 mt-2 mb-4">Checklist IS22003-0</p>
            <div className="flex items-center text-sm font-semibold text-brand-red">
               Iniciar <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </div>
        </Link>

        {/* PIONERA - Inactivo */}
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 opacity-60 grayscale cursor-not-allowed">
            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                <Lock className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-500">Pionera</h3>
            <p className="text-xs text-gray-400 mt-2 mb-4">Próximamente</p>
        </div>

        {/* GRINGA - Inactivo */}
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 opacity-60 grayscale cursor-not-allowed">
            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                <Lock className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-500">Gringa</h3>
            <p className="text-xs text-gray-400 mt-2 mb-4">Próximamente</p>
        </div>

      </div>
    </div>
  );
}
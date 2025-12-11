import Link from "next/link";
import { Sprout, Settings2, ArrowRight } from "lucide-react";

export default function CalculatorsMenuPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-gray-900">Centro de Herramientas</h1>
        <p className="text-gray-500">Selecciona la calculadora técnica que necesitas.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Tarjeta 1: Semillas (Activa) */}
        <Link href="/dashboard/calculators/seeds" className="group">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-brand-red/30 hover:shadow-md transition-all cursor-pointer h-full relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Sprout className="w-24 h-24 text-brand-red" />
            </div>
            
            <div className="relative z-10">
                <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Sprout className="w-6 h-6 text-brand-red" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-brand-red transition-colors">
                Calculadora de Siembra
                </h3>
                <p className="text-sm text-gray-500 mt-2 mb-4">
                Conversión de densidad: Semillas/metro ↔ Hectárea y distancia entre semillas.
                </p>
                <div className="flex items-center text-sm font-semibold text-brand-red">
                    Usar herramienta <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
            </div>
          </div>
        </Link>

        {/* Tarjeta 2: Transmisión (Próximamente) */}
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 opacity-70 cursor-not-allowed grayscale">
          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
            <Settings2 className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-500">
            Caja de Transmisión
          </h3>
          <p className="text-sm text-gray-400 mt-2">
            Cálculo de engranajes y relación de transmisión.
          </p>
          <span className="inline-block mt-4 px-2 py-1 bg-gray-200 text-gray-500 text-xs font-medium rounded">
            En desarrollo
          </span>
        </div>

      </div>
    </div>
  );
}
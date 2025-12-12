import Link from "next/link";
import { Calculator, Gauge, ArrowRight, Sprout } from "lucide-react";

export default function ToolsMenuPage() {
    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Sprout className="w-8 h-8 text-brand-red" />
                    Centro de Herramientas
                </h1>
                <p className="text-gray-500 text-sm">Selecciona la utilidad que necesitas para el trabajo de hoy.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* TARJETA 1: CONVERTIDOR DE DENSIDAD */}
                <Link href="/dashboard/tools/density" className="group">
                    <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-brand-red/30 transition-all h-full flex flex-col">
                        <div className="bg-blue-50 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Calculator className="w-7 h-7 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-700">Calculadora de Densidad</h3>
                        <p className="text-gray-500 text-sm mb-6 flex-1">
                            Convierte fácilmente entre <strong>Semillas por Metro</strong> y <strong>Semillas por Hectárea</strong> según la distancia entre líneas.
                        </p>
                        <div className="flex items-center text-blue-600 font-bold text-sm">
                            Usar herramienta <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </Link>

                {/* TARJETA 2: SIMULADOR DE VELOCIDAD */}
                <Link href="/dashboard/tools/velocity" className="group">
                    <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-brand-red/30 transition-all h-full flex flex-col">
                        <div className="bg-orange-50 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Gauge className="w-7 h-7 text-orange-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-700">Simulador de Velocidad</h3>
                        <p className="text-gray-500 text-sm mb-6 flex-1">
                            Verifica si la configuración de placa y cultivo soporta la velocidad de siembra deseada. (Base de Datos Ingeniería).
                        </p>
                        <div className="flex items-center text-orange-600 font-bold text-sm">
                            Usar herramienta <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </Link>

            </div>
        </div>
    );
}
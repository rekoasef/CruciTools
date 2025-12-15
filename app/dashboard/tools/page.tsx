import Link from 'next/link';

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-24">
      {/* Encabezado */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Herramientas</h1>
        <p className="text-gray-500 text-sm mt-1">
          Selecciona una herramienta para realizar cálculos.
        </p>
      </div>

      {/* Grid de Herramientas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        
        {/* 1. SIMULADOR DE VELOCIDAD */}
        <Link href="/dashboard/tools/velocity" className="block group">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer h-full group-hover:border-blue-200">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 p-3 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                {/* Icono Velocímetro */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /> {/* Icono genérico de reloj/velocidad */}
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 text-lg group-hover:text-blue-700">Velocidad</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Calcular velocidad de siembra y avance.
                </p>
              </div>
            </div>
          </div>
        </Link>

        {/* 2. SIMULADOR DE DENSIDAD */}
        <Link href="/dashboard/tools/density" className="block group">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer h-full group-hover:border-green-200">
            <div className="flex items-start gap-4">
              <div className="bg-green-100 p-3 rounded-lg text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
                {/* Icono Semillas/Grid */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 text-lg group-hover:text-green-700">Densidad</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Cálculo de semillas por metro y hectárea.
                </p>
              </div>
            </div>
          </div>
        </Link>

        {/* 3. CALCULADORA CV (NUEVO) */}
        <Link href="/dashboard/tools/cv-calculator" className="block group">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer h-full group-hover:border-purple-200">
            <div className="flex items-start gap-4">
              <div className="bg-purple-100 p-3 rounded-lg text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                {/* Icono Estadística */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 14.25h14.25M5.106 18.844c.405-.443.38-1.16-.073-1.571a.75.75 0 10-1.033 1.104 2.25 2.25 0 012.633.253c.42.365.438.995.068 1.401a.75.75 0 101.125 1.002c.708-.792.674-2.008-.135-2.71a3.75 3.75 0 00-4.639-.084z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 6.75a.75.75 0 100 1.5.75.75 0 000-1.5zM12.75 9a.75.75 0 100 1.5.75.75 0 000-1.5zM10.5 11.25a.75.75 0 100 1.5.75.75 0 000-1.5z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 text-lg group-hover:text-purple-700">Calculadora CV</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Coeficiente de variación y uniformidad.
                </p>
              </div>
            </div>
          </div>
        </Link>

      </div>
    </div>
  );
}
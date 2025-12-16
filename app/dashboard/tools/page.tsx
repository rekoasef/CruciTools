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

        {/* 4. VUELTAS DE RUEDA (NUEVO) */}
        <Link href="/dashboard/tools/wheel-turns" className="block group">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer h-full group-hover:border-orange-200">
            <div className="flex items-start gap-4">
              <div className="bg-orange-100 p-3 rounded-lg text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                {/* Icono Rueda/Engranaje */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 text-lg group-hover:text-orange-700">Rueda de Mando</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Vueltas para 1/10 de hectárea.
                </p>
              </div>
            </div>
          </div>
        </Link>

        {/* 5. CONTROL DE DOSIS (NUEVO) */}
        <Link href="/dashboard/tools/dose-control" className="block group">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer h-full group-hover:border-teal-200">
            <div className="flex items-start gap-4">
              <div className="bg-teal-100 p-3 rounded-lg text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                {/* Icono Balanza/Peso */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A5.99 5.99 0 0121.385 8.93C21.777 10.606 20.936 12.375 19.25 13.5M5.25 4.97a5.99 5.99 0 00-2.635 3.96c-.392 1.676.449 3.445 2.135 4.57" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 text-lg group-hover:text-teal-700">Control de Dosis</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Metros a recorrer para control Kg/Ha.
                </p>
              </div>
            </div>
          </div>
        </Link>

      </div>
    </div>
  );
}
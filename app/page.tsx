import Link from 'next/link';

export default function DashboardHome() {
  return (
    // Usamos un gris de fondo un poco más oscuro para que las tarjetas blancas resalten más
    <div className="min-h-screen bg-gray-100 relative overflow-hidden">
      
      {/* --- FONDO AMBIENTAL --- */}
      {/* Degradado superior oscuro que se funde hacia abajo */}
      <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-gray-900 via-gray-800 to-transparent z-0"></div>
      
      {/* Patrón de rejilla sutil para toque "técnico/ingeniería" (Opcional) */}
      <div className="absolute top-0 left-0 w-full h-[50vh] opacity-10 z-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>


      {/* --- CONTENIDO PRINCIPAL --- */}
      <div className="relative z-10 p-6 flex flex-col justify-center max-w-lg mx-auto h-full pt-20">
        
        {/* ENCABEZADO */}
        <div className="mb-10">
          <p className="text-gray-300 text-sm font-medium uppercase tracking-wider mb-2 opacity-80">
            Panel de Operaciones
          </p>
          <h1 className="text-5xl font-extrabold text-white tracking-tight leading-tight">
            Hola, <br />
            <span className="text-red-500 drop-shadow-sm">Renzo.</span>
          </h1>
        </div>

        {/* MENÚ DE NAVEGACIÓN (TARJETAS FLOTANTES) */}
        <div className="space-y-5">
          
          {/* 1. HERRAMIENTAS - Tarjeta Principal */}
          <Link href="/dashboard/tools" className="block group">
            <div className="bg-white p-6 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center gap-6 border-l-[6px] border-red-600 group-hover:-translate-y-1">
              {/* Icono grande y limpio, sin fondo cuadrado */}
              <div className="text-red-600 group-hover:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
                  <path fillRule="evenodd" d="M12 2.25a.75.75 0 01.75.75v.756a9.006 9.006 0 017.188 6.37l.343 1.202a.75.75 0 01-.508.937l-1.949.557c.113.716.173 1.45.173 2.196 0 3.53-2.02 6.586-4.954 8.14a.75.75 0 11-.714-1.349 7.506 7.506 0 004.168-6.79c0-.627-.048-1.246-.142-1.854l-1.386.397a.75.75 0 01-.938-.508l-.612-2.143a.75.75 0 01.508-.937l1.743-.498A7.505 7.505 0 0012 4.5v-.75A.75.75 0 0112 2.25zM4.003 8.562a.75.75 0 01-.229-.037l-1.949-.557a.75.75 0 01-.508-.937l.343-1.202A9.006 9.006 0 018.85 1.756V2.5a.75.75 0 01-1.5 0v-.75A7.505 7.505 0 004.82 5.793l1.743.498a.75.75 0 01.508.937l-.612 2.143a.75.75 0 01-.938.508l-1.386-.397c-.094.608-.142 1.227-.142 1.854 0 2.836 1.55 5.33 3.879 6.585a.75.75 0 01-.714 1.35A9.006 9.006 0 012.25 13.125c0-.746.06-1.48.173-2.196l-1.949-.557a.75.75 0 01-.508-.937l.343-1.202a9.006 9.006 0 017.188-6.37V.75a.75.75 0 011.5 0v.756a9.006 9.006 0 017.188 6.37l.343 1.202a.75.75 0 01-.508.937l-1.949.557c.113.716.173 1.45.173 2.196 0 3.53-2.02 6.586-4.954 8.14a.75.75 0 11-.714-1.349 7.506 7.506 0 004.168-6.79c0-.627-.048-1.246-.142-1.854l-1.386.397a.75.75 0 01-.938-.508l-.612-2.143a.75.75 0 01.508-.937l1.743-.498A7.505 7.505 0 0012 4.5v-.75A.75.75 0 0112 2.25z" clipRule="evenodd" />
                  <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-extrabold text-gray-900 group-hover:text-red-700 transition-colors">HERRAMIENTAS</h2>
                <p className="text-gray-500 font-medium mt-1">Calculadoras de siembra</p>
              </div>
              {/* Flecha de acción sutil */}
              <div className="text-gray-300 group-hover:text-red-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </div>
            </div>
          </Link>

          {/* 2. BIBLIOTECA - Estilo Secundario (Gris oscuro) */}
          <Link href="/dashboard/library" className="block group">
            <div className="bg-white p-6 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-6 border-l-[6px] border-gray-800 group-hover:-translate-y-1">
              <div className="text-gray-800 group-hover:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
                  <path d="M11.25 4.533A9.707 9.707 0 006 3.75a9.706 9.706 0 00-6 3.75c0 4.598 3.424 8.418 7.756 9.487V12.75a.75.75 0 111.5 0v4.27A9.706 9.706 0 0018 18a9.707 9.707 0 006-3.75 9.706 9.706 0 00-6-3.75 9.707 9.707 0 00-5.25.783zM12.75 4.533c1.62.48 3.177 1.198 4.5 2.083V7.5a.75.75 0 101.5 0v-.917c1.323-.885 2.88-1.603 4.5-2.083A9.706 9.706 0 0018 3.75a9.707 9.707 0 00-5.25.783z" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-extrabold text-gray-900 group-hover:text-gray-700 transition-colors">BIBLIOTECA</h2>
                <p className="text-gray-500 font-medium mt-1">Manuales Técnicos</p>
              </div>
               <div className="text-gray-300 group-hover:text-gray-800 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </div>
            </div>
          </Link>

          {/* 3. CHECKLISTS - Estilo Terciario (Gris medio) */}
          <Link href="/dashboard/checklists" className="block group">
            <div className="bg-white p-6 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-6 border-l-[6px] border-gray-500 group-hover:-translate-y-1">
              <div className="text-gray-500 group-hover:scale-110 transition-transform duration-300">
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
                  <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-extrabold text-gray-900 group-hover:text-gray-600 transition-colors">CHECKLISTS</h2>
                <p className="text-gray-500 font-medium mt-1">Controles de rutina</p>
              </div>
               <div className="text-gray-300 group-hover:text-gray-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </div>
            </div>
          </Link>

        </div>
        
        {/* Pie de página sutil */}
        <div className="mt-16 text-center opacity-50">
           <span className="text-[11px] text-white tracking-[0.2em] uppercase font-semibold">
             Crucitools Official App v1.0
           </span>
        </div>
      </div>
    </div>
  );
}
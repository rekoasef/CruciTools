import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full border-t-4 border-brand-red">
        <h1 className="text-3xl font-bold text-brand-dark mb-2">
          CruciTools
        </h1>
        <p className="text-gray-500 mb-6">
          Plataforma de Gestión Postventa
        </p>
        
        <div className="space-y-4">
          <div className="p-4 bg-brand-gray rounded text-sm text-left">
            <p className="font-semibold text-brand-red">Estado del Sistema:</p>
            <ul className="list-disc list-inside text-gray-700 mt-2">
              <li>Next.js 13.5.6: <span className="text-status-success">Activo</span></li>
              <li>Tailwind Branding: <span className="text-status-success">Configurado</span></li>
              <li>Base de Datos: <span className="text-status-warning">Pendiente</span></li>
            </ul>
          </div>

          <button className="btn-primary w-full">
            Iniciar Sistema
          </button>
        </div>
      </div>
      
      <footer className="mt-12 text-xs text-gray-400">
        © {new Date().getFullYear()} Crucianelli S.A. - Desarrollo Interno
      </footer>
    </main>
  );
}
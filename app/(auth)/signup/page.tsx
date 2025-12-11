import SignUpForm from "@/components/auth/signup-form";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-gray p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden border-t-4 border-brand-red">
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-brand-dark">Crear Cuenta</h2>
            <p className="text-sm text-gray-500 mt-1">
              Acceso exclusivo para Coordinadores
            </p>
          </div>

          {/* Insertamos el componente cliente aquí */}
          <SignUpForm />
          
        </div>
      </div>
    </div>
  );
}
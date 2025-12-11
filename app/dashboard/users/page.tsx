import { redirect } from "next/navigation";
import { getAllProfiles, getProfileInfo, ProfileRow } from "../actions/service-queries";
import { Users, User, Settings, Mail, PlusCircle, AlertTriangle } from "lucide-react";
import CreateUserForm from "./create-user-form"; // <--- Importamos el componente real

// Componente principal (Server Component)
export default async function UserManagementPage() {
    const { profile } = await getProfileInfo();

    if (profile?.role !== 'coordinador') {
        return redirect("/dashboard");
    }

    const { profiles, error } = await getAllProfiles();

    if (error) {
        return (
            <div className="p-6 bg-red-100 border-l-4 border-status-error text-status-error rounded-lg">
                <p>Error al cargar la lista de usuarios: {error}</p>
            </div>
        );
    }

    const coordinators = profiles.filter(p => p.role === 'coordinador');
    const technicians = profiles.filter(p => p.role === 'mecanico');

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <Users className="w-8 h-8 text-brand-red" />
                Gestión de Usuarios
            </h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Columna 1: Formulario de Creación */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 sticky top-4">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2 flex items-center gap-2">
                            <PlusCircle className="w-5 h-5 text-brand-red" />
                            Alta de Usuario
                        </h2>
                        
                        {/* Componente del Formulario */}
                        <CreateUserForm />
                    </div>
                </div>

                {/* Columna 2 & 3: Listas */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* Lista de Coordinadores */}
                    <section>
                        <h2 className="text-xl font-bold text-gray-700 mb-3 border-b border-gray-200 pb-1">
                            Coordinadores ({coordinators.length})
                        </h2>
                        {coordinators.map(p => (
                             <UserCard key={p.id} profile={p} />
                        ))}
                    </section>
                    
                    {/* Lista de Técnicos */}
                    <section>
                        <h2 className="text-xl font-bold text-gray-700 mb-3 border-b border-gray-200 pb-1">
                            Técnicos ({technicians.length})
                        </h2>
                        {technicians.length > 0 ? (
                            <div className="space-y-3">
                                {technicians.map(p => (
                                    <UserCard key={p.id} profile={p} />
                                ))}
                            </div>
                        ) : (
                            <div className="p-6 bg-yellow-50 rounded-xl border border-yellow-200 text-yellow-800 text-center text-sm">
                                <AlertTriangle className="w-6 h-6 mx-auto mb-2 opacity-50" />
                                <p>No hay técnicos registrados aún.</p>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
}

function UserCard({ profile }: { profile: ProfileRow }) {
    const isCoordinator = profile.role === 'coordinador';
    
    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${isCoordinator ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-brand-red'}`}>
                    <User className="w-5 h-5" />
                </div>
                <div>
                    <p className="font-semibold text-gray-900 text-sm">{profile.full_name || 'Sin Nombre'}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">{profile.email}</p>
                </div>
            </div>
            <span className={`px-2 py-1 text-[10px] uppercase font-bold tracking-wider rounded border ${isCoordinator ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                {profile.role}
            </span>
        </div>
    );
}
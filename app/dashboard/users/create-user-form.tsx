'use client';

import { useState } from "react";
import { User, Mail, Lock, Briefcase, UserPlus, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { createNewUser } from "../actions/user-actions";

export default function CreateUserForm() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        role: 'mecanico' as 'mecanico' | 'coordinador'
    });
    
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const result = await createNewUser(formData);

        if (result.error) {
            setMessage({ type: 'error', text: result.message });
        } else {
            setMessage({ type: 'success', text: result.message });
            // Limpiar formulario
            setFormData({ fullName: '', email: '', password: '', role: 'mecanico' });
        }
        setLoading(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            
            {message && (
                <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {message.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    {message.text}
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        name="fullName"
                        required
                        value={formData.fullName}
                        onChange={handleChange}
                        className="pl-9 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red outline-none"
                        placeholder="Ej: Juan Pérez"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="pl-9 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red outline-none"
                        placeholder="tecnico@crucianelli.com"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <input
                            type="text" // Visible para que el coordinador sepa qué clave asignó
                            name="password"
                            required
                            minLength={6}
                            value={formData.password}
                            onChange={handleChange}
                            className="pl-9 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red outline-none"
                            placeholder="Mín. 6 caracteres"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                    <div className="relative">
                        <Briefcase className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="pl-9 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red outline-none bg-white"
                        >
                            <option value="mecanico">Mecánico</option>
                            <option value="coordinador">Coordinador</option>
                        </select>
                    </div>
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-2 flex items-center justify-center gap-2 font-bold"
            >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                {loading ? 'Creando...' : 'Crear Usuario'}
            </button>
        </form>
    );
}
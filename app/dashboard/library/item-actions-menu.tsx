'use client';

import { useState } from "react";
import { MoreVertical, Trash2, Edit2, Loader2, X, Check } from "lucide-react";
import { deleteLibraryItem, renameLibraryItem } from "@/app/dashboard/actions/library-actions";

interface Props {
    itemId: string;
    currentName: string;
}

export default function ItemActionsMenu({ itemId, currentName }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState(currentName);
    const [loading, setLoading] = useState(false);

    // Manejador de Eliminación
    const handleDelete = async () => {
        if (!confirm("¿Estás seguro de eliminar este elemento? Si es una carpeta, se borrará todo su contenido.")) return;
        
        setLoading(true);
        await deleteLibraryItem(itemId);
        setLoading(false);
        setIsOpen(false);
    };

    // Manejador de Renombrado
    const handleRename = async () => {
        if (newName === currentName) {
            setIsEditing(false);
            return;
        }
        
        setLoading(true);
        await renameLibraryItem(itemId, newName);
        setLoading(false);
        setIsEditing(false);
        setIsOpen(false);
    };

    // --- MODO EDICIÓN ---
    if (isEditing) {
        return (
            <div className="absolute top-2 right-2 left-2 z-20 flex items-center gap-1 bg-white shadow-lg rounded-md p-1 animate-in fade-in zoom-in">
                <input 
                    type="text" 
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full text-xs p-1 border border-gray-300 rounded focus:outline-none focus:border-brand-red"
                    autoFocus
                />
                <button onClick={handleRename} disabled={loading} className="p-1 bg-green-100 text-green-700 rounded hover:bg-green-200">
                    {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                </button>
                <button onClick={() => setIsEditing(false)} disabled={loading} className="p-1 bg-gray-100 text-gray-500 rounded hover:bg-gray-200">
                    <X className="w-3 h-3" />
                </button>
            </div>
        );
    }

    // --- MODO MENÚ ---
    return (
        <div className="absolute top-2 right-2 z-10" onClick={(e) => e.stopPropagation() /* Evitar entrar a la carpeta */}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
                <MoreVertical className="w-4 h-4" />
            </button>

            {isOpen && (
                <>
                    {/* Overlay invisible para cerrar al hacer clic afuera */}
                    <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
                    
                    <div className="absolute right-0 mt-1 w-32 bg-white rounded-lg shadow-xl border border-gray-100 z-20 overflow-hidden animate-in fade-in slide-in-from-top-2">
                        <button 
                            onClick={() => { setIsEditing(true); setIsOpen(false); }}
                            className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                            <Edit2 className="w-3 h-3" /> Renombrar
                        </button>
                        <button 
                            onClick={handleDelete}
                            disabled={loading}
                            className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                            {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                            Eliminar
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
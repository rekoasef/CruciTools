'use client';

import { useState } from "react";
import { Plus, FolderPlus, FilePlus, X, Loader2 } from "lucide-react";
import { createLibraryItem } from "@/app/dashboard/actions/library-actions";

export default function CreateItemModal({ parentId }: { parentId: string | null }) {
    const [isOpen, setIsOpen] = useState(false);
    const [type, setType] = useState<'folder' | 'file'>('folder');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        if (parentId) formData.append('parent_id', parentId);
        
        await createLibraryItem(formData);
        
        setLoading(false);
        setIsOpen(false);
    };

    if (!isOpen) {
        return (
            <button 
                onClick={() => setIsOpen(true)}
                className="btn-primary py-2 px-4 flex items-center gap-2 text-sm shadow-md"
            >
                <Plus className="w-4 h-4" /> Nuevo Ítem
            </button>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative animate-in fade-in zoom-in-95 duration-200">
                <button 
                    onClick={() => setIsOpen(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-lg font-bold text-gray-900 mb-4">Agregar a la Biblioteca</h2>

                {/* Tabs */}
                <div className="flex bg-gray-100 p-1 rounded-lg mb-4">
                    <button 
                        type="button"
                        onClick={() => setType('folder')}
                        className={`flex-1 py-1.5 text-sm font-medium rounded-md flex items-center justify-center gap-2 ${type === 'folder' ? 'bg-white shadow-sm text-brand-red' : 'text-gray-500'}`}
                    >
                        <FolderPlus className="w-4 h-4" /> Carpeta
                    </button>
                    <button 
                        type="button"
                        onClick={() => setType('file')}
                        className={`flex-1 py-1.5 text-sm font-medium rounded-md flex items-center justify-center gap-2 ${type === 'file' ? 'bg-white shadow-sm text-brand-red' : 'text-gray-500'}`}
                    >
                        <FilePlus className="w-4 h-4" /> Archivo / Link
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="hidden" name="type" value={type === 'folder' ? 'folder' : 'pdf'} />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                        <input name="name" required className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-brand-red/20 outline-none" placeholder={type === 'folder' ? "Ej: Manuales 2024" : "Ej: Guía de Mantenimiento"} />
                    </div>

                    {type === 'file' && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Archivo</label>
                                <select name="type" className="w-full p-2 border rounded-lg bg-white">
                                    <option value="pdf">Documento PDF</option>
                                    <option value="video">Video (YouTube/Vimeo)</option>
                                    <option value="image">Imagen</option>
                                    <option value="link">Enlace Web</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">URL / Enlace</label>
                                <input name="url" type="url" required className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-brand-red/20 outline-none" placeholder="https://..." />
                                <p className="text-xs text-gray-400 mt-1">Pega aquí el link de Google Drive, YouTube o PDF alojado.</p>
                            </div>
                        </>
                    )}

                    <button disabled={loading} className="w-full btn-primary py-2 mt-2 flex justify-center items-center gap-2">
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Crear"}
                    </button>
                </form>
            </div>
        </div>
    );
}
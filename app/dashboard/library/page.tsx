import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Folder, FileText, ArrowLeft, Download, Home, Film, Image as ImageIcon } from "lucide-react";

// Helper para iconos según el tipo de archivo
const getIcon = (type: string) => {
    if (type === 'video') return <Film className="w-6 h-6 text-purple-500" />;
    if (type === 'image') return <ImageIcon className="w-6 h-6 text-blue-500" />;
    return <FileText className="w-6 h-6 text-gray-500" />;
};

// CORRECCIÓN NEXT.JS 15+: searchParams ahora es una Promesa
export default async function LibraryPage({
    searchParams,
}: {
    searchParams: Promise<{ folder?: string }>;
}) {
    // 1. Esperamos a que se resuelvan los parámetros de búsqueda
    const params = await searchParams;
    const currentFolderId = params.folder || null;

    // CORRECCIÓN: Agregamos 'await' aquí
    const supabase = await createClient();

    // 2. Consulta a la base de datos
    let query = supabase
        .from('library_items')
        .select('*')
        // Ordenar: Carpetas primero (alfabéticamente por tipo ayuda si 'folder' < 'pdf'), luego nombre
        .order('type', { ascending: true }) 
        .order('name', { ascending: true });

    // Filtro: Si hay ID de carpeta, buscamos sus hijos. Si no, buscamos la raíz (null).
    if (currentFolderId) {
        query = query.eq('parent_id', currentFolderId);
    } else {
        query = query.is('parent_id', null);
    }

    const { data: items } = await query;

    // 3. Obtener info de la carpeta actual (para el botón volver)
    let currentFolder = null;
    let parentFolderId = null;

    if (currentFolderId) {
        const { data } = await supabase
            .from('library_items')
            .select('name, parent_id')
            .eq('id', currentFolderId)
            .single();
        
        if (data) {
            currentFolder = data;
            parentFolderId = data.parent_id;
        }
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-20">
            
            {/* Header y Navegación */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Link href="/dashboard/library" className="hover:text-brand-red flex items-center gap-1">
                        <Home className="w-4 h-4" /> Inicio
                    </Link>
                    {currentFolder && (
                        <>
                            <span>/</span>
                            <span className="font-bold text-gray-900">{currentFolder.name}</span>
                        </>
                    )}
                </div>

                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">
                        {currentFolder ? currentFolder.name : "Biblioteca Técnica"}
                    </h1>
                    
                    {/* Botón Volver */}
                    {currentFolderId && (
                        <Link 
                            href={parentFolderId ? `/dashboard/library?folder=${parentFolderId}` : '/dashboard/library'}
                            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-brand-red bg-white px-3 py-2 rounded-lg border border-gray-200 hover:border-brand-red/30 transition-all"
                        >
                            <ArrowLeft className="w-4 h-4" /> Subir nivel
                        </Link>
                    )}
                </div>
            </div>

            {/* Grid de Items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                
                {/* Renderizado de Items */}
                {items && items.length > 0 ? (
                    items.map((item) => (
                        item.type === 'folder' ? (
                            // CASO CARPETA
                            <Link 
                                key={item.id} 
                                href={`/dashboard/library?folder=${item.id}`}
                                className="group bg-white p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all flex items-center gap-4"
                            >
                                <div className="bg-blue-50 p-3 rounded-lg group-hover:bg-blue-100 transition-colors">
                                    <Folder className="w-8 h-8 text-blue-500" />
                                </div>
                                <div className="overflow-hidden">
                                    <h3 className="font-bold text-gray-800 truncate group-hover:text-blue-700">{item.name}</h3>
                                    <p className="text-xs text-gray-500">Carpeta</p>
                                </div>
                            </Link>
                        ) : (
                            // CASO ARCHIVO (PDF, Video, etc)
                            <a 
                                key={item.id} 
                                href={item.url || '#'} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="group bg-white p-4 rounded-xl border border-gray-200 hover:border-brand-red/50 hover:shadow-md transition-all flex flex-col justify-between h-full"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-red-50 transition-colors">
                                        {getIcon(item.type)}
                                    </div>
                                    <Download className="w-4 h-4 text-gray-400 group-hover:text-brand-red" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-800 text-sm line-clamp-2 mb-1 group-hover:text-brand-red">
                                        {item.name}
                                    </h3>
                                    <p className="text-xs text-gray-400 uppercase font-bold">{item.type}</p>
                                </div>
                            </a>
                        )
                    ))
                ) : (
                    // ESTADO VACÍO
                    <div className="col-span-full py-12 flex flex-col items-center justify-center text-gray-400">
                        <Folder className="w-16 h-16 mb-4 opacity-20" />
                        <p>Esta carpeta está vacía.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
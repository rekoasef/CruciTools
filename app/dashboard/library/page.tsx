import { getLibraryItems, getFolderDetails } from "@/app/dashboard/actions/library-actions";
import { Folder, FileText, Image as ImageIcon, Video, Link as LinkIcon, ArrowLeft, Home } from "lucide-react";
import Link from "next/link";
import CreateItemModal from "./create-item-modal"; 
import ItemActionsMenu from "./item-actions-menu"; // Nuevo Componente
import { getProfileInfo } from "@/app/dashboard/actions/service-queries";

export default async function LibraryPage({ searchParams }: { searchParams: { folder?: string } }) {
    const currentFolderId = searchParams.folder || null;
    
    // Consultas paralelas
    const [{ items }, folderInfo, { profile }] = await Promise.all([
        getLibraryItems(currentFolderId),
        currentFolderId ? getFolderDetails(currentFolderId) : null,
        getProfileInfo()
    ]);

    const isCoordinator = profile?.role === 'coordinador';

    // Helper para iconos
    const getIcon = (type: string) => {
        switch (type) {
            case 'folder': return <Folder className="w-12 h-12 text-yellow-500 fill-yellow-100" />;
            case 'pdf': return <FileText className="w-10 h-10 text-red-500" />;
            case 'video': return <Video className="w-10 h-10 text-blue-500" />;
            case 'image': return <ImageIcon className="w-10 h-10 text-purple-500" />;
            default: return <LinkIcon className="w-10 h-10 text-gray-500" />;
        }
    };

    return (
        <div className="space-y-6">
            
            {/* Header y Navegación */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-200 pb-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        Biblioteca Técnica
                    </h1>
                    
                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                        <Link href="/dashboard/library" className="hover:text-brand-red flex items-center gap-1">
                            <Home className="w-4 h-4" /> Inicio
                        </Link>
                        {folderInfo && (
                            <>
                                <span>/</span>
                                <span className="font-semibold text-gray-900">{folderInfo.name}</span>
                            </>
                        )}
                    </div>
                </div>

                {/* Botón de Acción (Solo Coordinador) */}
                {isCoordinator && (
                    <CreateItemModal parentId={currentFolderId} />
                )}
            </div>

            {/* Grid de Archivos */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                
                {/* Botón Volver */}
                {currentFolderId && (
                    <Link href={folderInfo?.parent_id ? `/dashboard/library?folder=${folderInfo.parent_id}` : '/dashboard/library'}>
                        <div className="bg-gray-100 p-4 rounded-xl border border-gray-200 flex flex-col items-center justify-center gap-2 h-36 hover:bg-gray-200 transition-colors cursor-pointer text-gray-400 hover:text-gray-600">
                            <ArrowLeft className="w-8 h-8" />
                            <span className="text-xs font-medium">Volver</span>
                        </div>
                    </Link>
                )}

                {/* Ítems */}
                {items.map((item) => (
                    <div key={item.id} className="relative group">
                        
                        {/* Menú de Acciones (Solo Coordinador) */}
                        {isCoordinator && (
                            <ItemActionsMenu itemId={item.id} currentName={item.name} />
                        )}

                        {item.type === 'folder' ? (
                            // ES CARPETA
                            <Link href={`/dashboard/library?folder=${item.id}`}>
                                <div className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col items-center justify-center gap-3 h-36 hover:shadow-md hover:border-brand-red/30 transition-all cursor-pointer">
                                    {getIcon(item.type)}
                                    <span className="text-sm font-medium text-gray-700 text-center truncate w-full px-2 group-hover:text-brand-red">
                                        {item.name}
                                    </span>
                                </div>
                            </Link>
                        ) : (
                            // ES ARCHIVO
                            <a href={item.url || '#'} target="_blank" rel="noopener noreferrer">
                                <div className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col items-center justify-center gap-3 h-36 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer">
                                    {getIcon(item.type)}
                                    <span className="text-sm font-medium text-gray-700 text-center truncate w-full px-2 group-hover:text-blue-600">
                                        {item.name}
                                    </span>
                                    <span className="text-[10px] text-gray-400 uppercase bg-gray-50 px-2 py-0.5 rounded">
                                        {item.type}
                                    </span>
                                </div>
                            </a>
                        )}
                    </div>
                ))}

                {items.length === 0 && !currentFolderId && (
                    <div className="col-span-full py-12 text-center text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <Folder className="w-10 h-10 mx-auto mb-2 opacity-20" />
                        <p>La biblioteca está vacía.</p>
                        {isCoordinator && <p className="text-sm mt-1">Crea la primera carpeta con el botón Nuevo Ítem.</p>}
                    </div>
                )}
            </div>
        </div>
    );
}
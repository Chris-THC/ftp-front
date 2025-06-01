"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuthStore } from "@/store/authStore";
import {
  ChevronRight,
  Download,
  Edit,
  FileText,
  Folder,
  Home,
  Menu,
  MessageSquare,
  MoreVertical,
  Search,
  Trash,
  User,
} from "lucide-react";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useDeleteDirectory } from "../api/GetFiles/FtpDeleteDirectory";
import { useDeleteFileMutation } from "../api/GetFiles/FtpDeleteFile";
import downloadFile from "../api/GetFiles/FtpDonwload";
import { useFolderTreeQuery } from "../api/GetFiles/FtpFilesTree";
import { useRenameMutation } from "../api/GetFiles/FtpRename";
import { LoadingWithText } from "../components/LoadingSpinner";
import ActionButtons from "./components/ActionButtons";
import { RenameModal } from "./components/ModalRename";

interface FileItem {
  name: string;
  fullPath: string;
  timestamp: string;
  children: FileItem[];
  directory: boolean;
  file: boolean;
}

export default function FileExplorer() {
  const renameMutation = useRenameMutation();
  const ftpDeleteDirectory = useDeleteDirectory();
  const ftpDeleteFile = useDeleteFileMutation();
  const { user } = useAuthStore();

  const [expandedFolders, setExpandedFolders] = useState<string[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [currentPath, setCurrentPath] = useState<string>(user!.personalPath);

  // Modal para renombrar archivos o carpetas
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [oldName, setOldName] = useState("");
  const [newName, setNewName] = useState("");
  const [itemType, setItemType] = useState<"folder" | "file">("file");

  const {
    data: currentFolderContent,
    isLoading: isLoadingContent,
    isError: isErrorContent,
    error: contentError,
  } = useFolderTreeQuery(currentPath);

  const {
    data: rootTreeData,
    isLoading: isLoadingTree,
    isError: isErrorTree,
    error: treeError,
  } = useFolderTreeQuery(user!.personalPath);

  const toggleFolder = (folder: string) => {
    if (expandedFolders.includes(folder)) {
      setExpandedFolders(expandedFolders.filter((f) => f !== folder));
    } else {
      setExpandedFolders([...expandedFolders, folder]);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleGoHome = () => {
    // Aqui se apllicara la logica cuando se aplique los roles del usuario
    console.log("Ir a la carpeta raíz del usuario");
  };

  const handleFolderNavigation = (path: string) => {
    setCurrentPath(path);
    const pathSegments = path.split("/").filter(Boolean);
    let currentSegmentPath = "";
    const pathsToExpand = pathSegments.map((segment) => {
      currentSegmentPath += `/${segment}`;
      return currentSegmentPath;
    });
    setExpandedFolders((prev) =>
      Array.from(new Set([...prev, ...pathsToExpand]))
    );
  };
  const handleDownload = async (fullPath: string): Promise<void> => {
    try {
      await downloadFile(fullPath);
      console.log("Archivo descargado exitosamente");
    } catch (error) {
      console.error("Error al descargar el archivo:", error);
    }
  };

  const renderBreadcrumb = useMemo(() => {
    // 1. Obtener segmentos de la ruta del usuario (su "raíz" permitida)
    const userPathSegments = user!.personalPath.split("/").filter(Boolean);
    // 2. Obtener segmentos de la ruta actual
    const currentPathSegments = currentPath.split("/").filter(Boolean);

    // 3. Encontrar el punto de inicio para los segmentos a mostrar en el breadcrumb.
    // Esto asegura que no mostremos "home", "admin" si el user!.personalPath ya los contiene.
    let startIndex = 0;
    for (let i = 0; i < userPathSegments.length; i++) {
      if (userPathSegments[i] === currentPathSegments[i]) {
        startIndex++;
      } else {
        break; // La ruta actual diverge de la ruta del usuario
      }
    }

    // 4. Los segmentos a "mostrar" en el breadcrumb serán solo los que están después del user!.personalPath.
    const displaySegments = currentPathSegments.slice(startIndex);

    // 5. Inicializar el acumulador de ruta con la ruta completa del usuario.
    // Esto es crucial para construir enlaces de navegación válidos desde la "raíz" del usuario.
    let pathAccumulator = user!.personalPath;

    return (
      <div className="flex items-center space-x-1 text-sm text-gray-600 px-4 py-2 bg-gray-50 border-b">
        {/* Botón "Home": Siempre lleva a la carpeta raíz designada del usuario */}
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-gray-500"
          onClick={() => handleFolderNavigation(user!.personalPath)}
          title="Ir a mi carpeta raíz"
        >
          <Home className="h-4 w-4" />
        </Button>

        {/* Muestra el nombre de la carpeta raíz del usuario como el primer elemento del breadcrumb */}
        {userPathSegments.length > 0 && (
          <div className="flex items-center">
            <ChevronRight className="h-3 w-3 mx-1 text-gray-400" />
            <Button
              variant="link"
              className="p-0 h-auto text-gray-600 hover:text-blue-600"
              onClick={() => handleFolderNavigation(user!.personalPath)}
            >
              {userPathSegments[userPathSegments.length - 1]}
            </Button>
          </div>
        )}

        {/* Mapea los segmentos restantes para construir el resto del breadcrumb */}
        {displaySegments.map((segment, index) => {
          // Construye la ruta completa acumulada para este segmento
          pathAccumulator += `/${segment}`;
          const fullSegmentPath = pathAccumulator;
          const isLast = index === displaySegments.length - 1;

          return (
            <div key={fullSegmentPath} className="flex items-center">
              <ChevronRight className="h-3 w-3 mx-1 text-gray-400" />
              {isLast ? (
                // El último segmento no es clickeable
                <span className="font-semibold text-gray-800">{segment}</span>
              ) : (
                // Los segmentos intermedios son clickeables
                <Button
                  variant="link"
                  className="p-0 h-auto text-gray-600 hover:text-blue-600"
                  onClick={() => handleFolderNavigation(fullSegmentPath)}
                >
                  {segment}
                </Button>
              )}
            </div>
          );
        })}
      </div>
    );
  }, [currentPath, user!.personalPath]);

  // Esta función ahora renderiza el árbol completo desde la raíz
  const renderFileTree = (items: FileItem[], level = 0) => {
    // Filtrar solo directorios
    const directories = items.filter((item) => item.directory);

    return directories.map((item) => {
      const isExpanded = expandedFolders.includes(item.fullPath);
      const hasChildren = item.children && item.children.length > 0;

      return (
        <div key={item.fullPath} className={`ml-${level * 2}`}>
          <div
            className={`flex items-center p-1 cursor-pointer rounded-md ${
              currentPath === item.fullPath
                ? "bg-blue-100 text-blue-800"
                : "hover:bg-gray-100"
            }`}
            onClick={() => toggleFolder(item.fullPath)}
          >
            {hasChildren ? (
              <ChevronRight
                className={`h-4 w-4 mr-1 transition-transform ${
                  isExpanded ? "rotate-90" : ""
                }`}
              />
            ) : (
              // Espaciador para alinear items sin hijos, si hay hermanos con hijos
              <span className="h-4 w-4 mr-1 inline-block"></span>
            )}
            <Folder className="h-5 w-5 text-amber-500 mr-2" />
            <span
              className={`font-medium ${
                currentPath === item.fullPath ? "font-bold" : ""
              }`}
              onClick={(e) => {
                e.stopPropagation(); // Evita que se colapse/expanda la carpeta
                handleFolderNavigation(item.fullPath);
              }}
            >
              {item.name}
            </span>
          </div>
          {isExpanded && hasChildren && (
            <div className="ml-2">
              {renderFileTree(item.children, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  const renderActionsMenu = (item: FileItem) => {
    const handleActionClick = (e: React.MouseEvent, action: () => void) => {
      e.stopPropagation();
      action();
    };

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {item.directory ? (
            <>
              <DropdownMenuItem
                onClick={(e) =>
                  handleActionClick(e, () =>
                    handleFolderNavigation(item.fullPath)
                  )
                }
              >
                <Folder className="h-4 w-4 text-amber-500 mr-2" />
                Abrir carpeta
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) =>
                  handleActionClick(e, () => {
                    setOldName(item.name);
                    setNewName(item.name);
                    setItemType(item.directory ? "folder" : "file");
                    setIsRenameModalOpen(true);
                  })
                }
              >
                <Edit className="h-4 w-4 text-green-500 mr-2" />
                Renombrar
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) =>
                  handleActionClick(e, () => {
                    ftpDeleteDirectory.mutate(item.fullPath, {
                      onSuccess: () => {
                        toast.success("Carpeta eliminada con éxito.");
                      },
                      onError: () => {
                        toast.error("Error al eliminar la carpeta.");
                      },
                    });
                  })
                }
              >
                <Trash className="h-4 w-4 text-red-500 mr-2" />
                Eliminar
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuItem
                onClick={(e) =>
                  handleActionClick(e, () => {
                    setOldName(item.name);
                    setNewName(item.name);
                    setItemType(item.directory ? "folder" : "file");
                    setIsRenameModalOpen(true);
                  })
                }
              >
                <Edit className="h-4 w-4 text-blue-500 mr-2" />
                Renombrar
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) =>
                  handleActionClick(e, () => {
                    handleDownload(item.fullPath);
                  })
                }
              >
                <Download className="h-4 w-4 text-green-500 mr-2" />
                Descargar
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) =>
                  handleActionClick(e, () => {
                    ftpDeleteFile.mutate(item.fullPath, {
                      onSuccess: () => {
                        toast.success("Archivo eliminado con éxito.");
                      },
                      onError: () => {
                        toast.error("Error al eliminar el archivo.");
                      },
                    });
                  })
                }
              >
                <Trash className="h-4 w-4 text-red-500 mr-2" />
                Eliminar
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Top Navigation Bar */}
      <div className="flex justify-between items-center bg-black text-white h-10 px-2">
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white md:hidden"
            onClick={toggleSidebar}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Button
            onClick={handleGoHome}
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white"
          >
            <Home className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 bg-amber-500 text-white"
          >
            <Folder className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-white">
            <MessageSquare className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-white">
            <User className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-white">
            <Search className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div
          className={`${
            isSidebarOpen ? "block" : "hidden"
          } md:block w-60 border-r overflow-y-auto transition-all duration-300`}
        >
          <div className="p-2">
            {rootTreeData && rootTreeData.length > 0
              ? renderFileTree(rootTreeData, 0) // Explicitly start level at 0 for proper indentation
              : !isLoadingTree && (
                  <p className="text-gray-500 text-sm">
                    No hay carpetas disponibles en tu raíz.
                  </p>
                )}
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Breadcrumb / Ruta de navegación */}
          {renderBreadcrumb}

          {/* Action Buttons */}
          <ActionButtons currentPath={currentPath} />

          {/* File List */}
          <div className="flex-1 overflow-auto">
            {isLoadingContent || isLoadingTree ? (
              <div className="flex justify-center items-center h-full">
                <LoadingWithText text="Cargando..." size="lg" />
              </div>
            ) : isErrorContent || isErrorTree ? (
              <div className="flex justify-center items-center h-full text-red-500">
                Error al cargar los archivos:{" "}
                {contentError?.message || treeError?.message}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[400px]">Nombre</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Fecha de modificación</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentFolderContent?.map((item) => (
                    <TableRow
                      key={item.fullPath}
                      className={
                        item.directory ? "cursor-pointer hover:bg-gray-50" : ""
                      }
                      onClick={() =>
                        item.directory && handleFolderNavigation(item.fullPath)
                      }
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          {item.directory ? (
                            <Folder className="h-5 w-5 text-amber-500 mr-2" />
                          ) : (
                            <FileText className="h-5 w-5 text-gray-500 mr-2" />
                          )}
                          {item.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        {item.directory ? "Carpeta" : "Archivo"}
                      </TableCell>
                      <TableCell>{item.timestamp}</TableCell>
                      <TableCell>{renderActionsMenu(item)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      </div>

      <RenameModal
        isOpen={isRenameModalOpen}
        oldName={oldName}
        newName={newName}
        type={itemType}
        onChange={setNewName}
        onClose={() => setIsRenameModalOpen(false)}
        onSubmit={() => {
          const oldPath = `${currentPath}/${oldName}`;
          const newPath = `${currentPath}/${newName}`;

          renameMutation.mutate(
            { oldPath, newPath },
            {
              onSuccess: () => {
                toast.success("Renombrado exitosamente.");
              },
              onError: () => {
                toast.error("Error al renombrar el archivo o carpeta.");
              },
            }
          );
          setIsRenameModalOpen(false);
        }}
      />
    </div>
  );
}

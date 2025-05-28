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
import {
  ChevronRight,
  FileText,
  Folder,
  Grid,
  Home,
  Menu,
  MessageSquare,
  MoreVertical,
  Search,
  User,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useFolderTreeQuery } from "../api/GetFiles/FtpFilesTree"; // Tu hook existente
import ActionButtons from "./components/ActionButtons";

interface FileItem {
  name: string;
  fullPath: string;
  timestamp: string;
  children: FileItem[];
  directory: boolean;
  file: boolean;
}

export default function FileExplorer() {
  const [expandedFolders, setExpandedFolders] = useState<string[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [currentPath, setCurrentPath] = useState<string>("/home/admin"); // Estado para la ruta actual

  // Consulta para el contenido de la carpeta actual (para la tabla principal)
  const {
    data: currentFolderContent,
    isLoading: isLoadingContent,
    isError: isErrorContent,
    error: contentError,
  } = useFolderTreeQuery(currentPath);

  // Consulta para el árbol completo desde la raíz (para el sidebar)
  // ¡Asumimos que tu API devolverá la estructura anidada completa cuando se le pase "/home/admin"!
  const {
    data: rootTreeData,
    isLoading: isLoadingTree,
    isError: isErrorTree,
    error: treeError,
  } = useFolderTreeQuery("/home/admin"); // Siempre pide la raíz para el árbol

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

  const handleFolderNavigation = (path: string) => {
    setCurrentPath(path);
    // Expandir la carpeta en el árbol cuando se navega a ella
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

  // Función para construir la ruta de navegación (breadcrumb)
  const renderBreadcrumb = useMemo(() => {
    const segments = currentPath.split("/").filter(Boolean);
    let pathAccumulator = "";

    return (
      <div className="flex items-center space-x-1 text-sm text-gray-600 px-4 py-2 bg-gray-50 border-b">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-gray-500"
          onClick={() => handleFolderNavigation("/home/admin")}
          title="Ir a la raíz"
        >
          <Home className="h-4 w-4" />
        </Button>
        {segments.map((segment, index) => {
          pathAccumulator += `/${segment}`;
          const fullSegmentPath = pathAccumulator;
          const isLast = index === segments.length - 1;

          return (
            <div key={fullSegmentPath} className="flex items-center">
              <ChevronRight className="h-3 w-3 mx-1 text-gray-400" />
              {isLast ? (
                <span className="font-semibold text-gray-800">{segment}</span>
              ) : (
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
  }, [currentPath]);

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
                onClick={() => handleFolderNavigation(item.fullPath)}
              >
                Abrir carpeta
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => console.log("Renombrar carpeta", item.fullPath)}
              >
                Renombrar
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => console.log("Eliminar carpeta", item.fullPath)}
              >
                Eliminar
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuItem
                onClick={() => console.log("Abrir archivo", item.fullPath)}
              >
                Abrir archivo
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => console.log("Descargar archivo", item.fullPath)}
              >
                Descargar
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => console.log("Eliminar archivo", item.fullPath)}
              >
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
          <Button variant="ghost" size="icon" className="h-8 w-8 text-white">
            <Grid className="h-5 w-5" />
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
            {/* Renderizamos el árbol con los datos de rootTreeData */}
            {rootTreeData && rootTreeData.length > 0
              ? renderFileTree(rootTreeData)
              : !isLoadingTree && (
                  <p className="text-gray-500 text-sm">
                    No hay carpetas en la raíz.
                  </p>
                )}
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Breadcrumb / Ruta de navegación */}
          {renderBreadcrumb}

          {/* Action Buttons */}
          <ActionButtons />

          {/* File List */}
          <div className="flex-1 overflow-auto">
            {isLoadingContent || isLoadingTree ? (
              <div className="flex justify-center items-center h-full">
                Cargando archivos...
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
    </div>
  );
}

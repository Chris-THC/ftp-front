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
  Home, // Importamos el icono de Home
  Menu,
  MessageSquare,
  MoreVertical,
  Search,
  User,
} from "lucide-react";
import { useState, useMemo } from "react"; // Importamos useMemo
import { useFolderTreeQuery } from "../api/GetFiles/FtpFilesTree";
// Ajusta la ruta si es necesario

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

  const {
    data: fileData,
    isLoading,
    isError,
    error,
  } = useFolderTreeQuery(currentPath);

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
    // Opcional: Si quieres expandir la carpeta en el árbol cuando navegas a ella.
    // Esto podría volverse complejo si las carpetas no están ya en el árbol.
    // setExpandedFolders((prev) => Array.from(new Set([...prev, path])));
  };

  // Función para construir la ruta de navegación (breadcrumb)
  const renderBreadcrumb = useMemo(() => {
    const segments = currentPath.split("/").filter(Boolean); // Filtra cadenas vacías
    let pathAccumulator = "";

    return (
      <div className="flex items-center space-x-1 text-sm text-gray-600 px-4 py-2 bg-gray-50 border-b">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-gray-500"
          onClick={() => handleFolderNavigation("/home/admin")} // Vuelve a la raíz definida
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
  }, [currentPath]); // Recalcular solo cuando currentPath cambie

  const renderFileTree = (items: FileItem[]) => {
    // Filtrar solo directorios
    const directories = items.filter((item) => item.directory);

    return directories.map((item) => {
      return (
        <div key={item.fullPath} className="ml-4">
          <div
            className="flex items-center p-2 cursor-pointer"
            onClick={() => toggleFolder(item.fullPath)}
          >
            <ChevronRight
              className={`h-4 w-4 mr-1 transition-transform ${
                expandedFolders.includes(item.fullPath) ? "rotate-90" : ""
              }`}
            />
            <Folder className="h-5 w-5 text-amber-500 mr-2" />
            {/* Al hacer clic en el nombre de la carpeta en el árbol, navegamos a ella */}
            <span
              className="font-medium hover:underline"
              onClick={(e) => {
                e.stopPropagation(); // Evita que se colapse/expanda la carpeta si ya se expandió al hacer clic en el chevron
                handleFolderNavigation(item.fullPath);
              }}
            >
              {item.name}
            </span>
          </div>
          {expandedFolders.includes(item.fullPath) &&
            item.children.length > 0 && (
              <div className="ml-4">{renderFileTree(item.children)}</div>
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Cargando archivos...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Error al cargar los archivos: {error?.message}
      </div>
    );
  }

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
            {/* Solo pasamos los children del currentPath si existen, para el árbol */}
            {fileData &&
              renderFileTree(fileData.filter((item) => item.directory))}
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Breadcrumb / Ruta de navegación */}
          {renderBreadcrumb}

          {/* File List */}
          <div className="flex-1 overflow-auto">
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
                {fileData?.map((item) => (
                  <TableRow
                    key={item.fullPath}
                    // Agrega el cursor-pointer y el evento onClick solo si es un directorio
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
          </div>
        </div>
      </div>
    </div>
  );
}

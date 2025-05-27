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
  Menu,
  MessageSquare,
  MoreVertical,
  Search,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { dataTest } from "./dataTest";

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
  const [fileData, setFileData] = useState<FileItem[]>(dataTest);

  // Fetch data from API
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/files"); // Cambia esta URL a la de tu API
        const data: FileItem[] = await response.json();
        setFileData(data);
      } catch (error) {
        console.error("Error fetching file data:", error);
      }
    }
    fetchData();
  }, []);

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
            <span className="font-medium">{item.name}</span>
          </div>
          {expandedFolders.includes(item.fullPath) && (
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
              <DropdownMenuItem onClick={() => console.log("Abrir carpeta")}>
                Abrir carpeta
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => console.log("Renombrar carpeta")}
              >
                Renombrar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => console.log("Eliminar carpeta")}>
                Eliminar
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuItem onClick={() => console.log("Abrir archivo")}>
                Abrir archivo
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => console.log("Descargar archivo")}
              >
                Descargar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => console.log("Eliminar archivo")}>
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
          <div className="p-2">{renderFileTree(fileData)}</div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
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
                {fileData.map((item) => (
                  <TableRow key={item.fullPath}>
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

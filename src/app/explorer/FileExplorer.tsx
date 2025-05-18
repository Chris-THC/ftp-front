"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChevronLeft,
  ChevronRight,
  Columns,
  Folder,
  Grid,
  HelpCircle,
  List,
  Maximize2,
  MessageSquare,
  Minus,
  MoreVertical,
  RefreshCw,
  Search,
  Star,
  User,
  X,
} from "lucide-react";
import { useState } from "react";

export default function FileExplorer() {
  const [expandedFolders, setExpandedFolders] = useState<string[]>([
    "NAS_DEPI",
  ]);

  const toggleFolder = (folder: string) => {
    if (expandedFolders.includes(folder)) {
      setExpandedFolders(expandedFolders.filter((f) => f !== folder));
    } else {
      setExpandedFolders([...expandedFolders, folder]);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Top Navigation Bar */}
      <div className="flex justify-between items-center bg-black text-white h-10 px-2">
        <div className="flex space-x-2">
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

      {/* File Station Header */}
      <div className="flex justify-between items-center border-b p-2">
        <div className="flex items-center">
          <Folder className="h-5 w-5 text-amber-500 mr-2" />
          <span className="font-medium">File Station</span>
        </div>
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <HelpCircle className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Minus className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Maximize2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-60 border-r overflow-y-auto">
          <div className="p-2">
            <div
              className="flex items-center p-2 cursor-pointer"
              onClick={() => toggleFolder("NAS_DEPI")}
            >
              <ChevronRight
                className={`h-4 w-4 mr-1 transition-transform ${
                  expandedFolders.includes("NAS_DEPI") ? "rotate-90" : ""
                }`}
              />
              <span className="font-medium">NAS_DEPI</span>
            </div>

            {expandedFolders.includes("NAS_DEPI") && (
              <div className="ml-4">
                <div className="flex items-center p-2 bg-blue-50 text-blue-700 rounded">
                  <span className="font-medium">DEPI</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Navigation Bar */}
          <div className="flex items-center border-b p-2">
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center mx-2 border rounded px-2 py-1 flex-1">
              <span>DEPI</span>
              <Button variant="ghost" size="icon" className="h-6 w-6 ml-auto">
                <Star className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center">
              <Input type="text" placeholder="Buscar" className="h-8 w-60" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center border-b p-2 space-x-2">
            <Button variant="outline" size="sm">
              Crear carpeta
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Cargar <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Subir archivos</DropdownMenuItem>
                <DropdownMenuItem>Subir carpeta</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Acción <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Copiar</DropdownMenuItem>
                <DropdownMenuItem>Mover</DropdownMenuItem>
                <DropdownMenuItem>Eliminar</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Herramientas <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Buscar</DropdownMenuItem>
                <DropdownMenuItem>Propiedades</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" size="sm">
              Configuración
            </Button>

            <div className="ml-auto flex space-x-2">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <List className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Columns className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* File List */}
          <div className="flex-1 overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[400px]">Nombre</TableHead>
                  <TableHead>Tamaño</TableHead>
                  <TableHead>Tipo de archivo</TableHead>
                  <TableHead>Fecha de modificación</TableHead>
                  <TableHead className="w-8"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <Folder className="h-5 w-5 text-amber-500 mr-2" />
                      DEPI 24
                    </div>
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell>Carpeta</TableCell>
                  <TableCell>05/11/2024 07:22:03</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Status Bar */}
          <div className="flex justify-between items-center border-t p-2 text-sm text-gray-600">
            <span>1 elemento</span>
            <div className="flex items-center">
              <RefreshCw className="h-4 w-4 ml-2" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

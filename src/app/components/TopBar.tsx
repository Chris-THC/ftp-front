import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  File,
  FolderPlus,
  Home,
  MessageCircle,
  Search,
  Upload,
  User,
} from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useUploadFile } from "../api/GetFiles/FtpUploadFile";

const TopBar = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [folderName, setFolderName] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const uploadFile = useUploadFile();

  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadFile.mutate(
        { file, remotePath: "/home/admin" },
        {
          onSuccess: () => {
            toast.success("Archivo subido exitosamente");
          },
          onError: () => {
            toast.error("Error al subir el archivo");
          },
        }
      );
    }
    e.target.value = "";
  };

  // Función para manejar la creación de la carpeta
  const handleCreateFolder = () => {
    console.log("Creando carpeta con nombre:", folderName);
    // Aquí iría tu lógica para crear la carpeta
    // Por ejemplo, una llamada a una API

    // IMPORTANTE: Cerrar el modal y resetear el nombre de la carpeta
    setIsFolderModalOpen(false);
    setFolderName(""); // Limpia el input después de crear la carpeta
  };

  return (
    <div className="relative z-10 flex justify-between items-center p-2 bg-[#20252A]/80 text-white">
      {/* IZQUIERDA */}
      <div className="flex items-center gap-2">
        <button className="p-2 hover:bg-gray-700 rounded-md transition-colors">
          <Home className="h-5 w-5" />
        </button>

        <DropdownMenu
          open={activeDropdown === "create"}
          onOpenChange={(open) => setActiveDropdown(open ? "create" : null)}
        >
          <DropdownMenuTrigger asChild>
            <Button className="bg-[#20252A]/90 transition-colors text-white px-4 py-2 rounded-lg font-semibold text-sm">
              + Agregar nuevo
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56 bg-white text-black border border-gray-300"
            align="start"
          >
            <DropdownMenuItem
              className="hover:bg-gray-100 cursor-pointer"
              // Cierra el DropdownMenu automáticamente al abrir el modal
              onSelect={() => {
                setActiveDropdown(null);
                setIsFolderModalOpen(true);
              }}
            >
              <FolderPlus className="w-4 h-4 mr-2" />
              Nueva carpeta
            </DropdownMenuItem>
            <DropdownMenuItem
              className="hover:bg-gray-100 cursor-pointer"
              onSelect={handleFileUploadClick}
            >
              <Upload className="w-4 h-4 mr-2" />
              Subir archivo
            </DropdownMenuItem>

            <div className="border-t border-gray-300 my-1" />
            <DropdownMenuItem className="hover:bg-gray-100 cursor-pointer">
              <File className="w-4 h-4 mr-2 text-blue-600" />
              Documento de Word
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-gray-100 cursor-pointer">
              <File className="w-4 h-4 mr-2 text-green-600" />
              Libro de Excel
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-gray-100 cursor-pointer">
              <File className="w-4 h-4 mr-2 text-red-600" />
              Presentación PowerPoint
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* INPUT INVISIBLE PARA SUBIR ARCHIVO */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* MODAL NUEVA CARPETA */}
      <Dialog
        open={isFolderModalOpen}
        onOpenChange={(open) => {
          console.log("Dialog onOpenChange:", open);
          setIsFolderModalOpen(open);
          if (!open) {
            setFolderName("");
          }
        }}
      >
        <DialogContent className="bg-white text-black border border-gray-300">
          <DialogHeader>
            <DialogTitle>Crear nueva carpeta</DialogTitle>
          </DialogHeader>
          <Input
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            placeholder="Nombre de la carpeta"
            className="mt-2"
          />
          <DialogFooter className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setIsFolderModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleCreateFolder}>Crear</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DERECHA */}
      <div className="flex items-center gap-2">
        <DropdownMenu
          open={activeDropdown === "messages"}
          onOpenChange={(open) => setActiveDropdown(open ? "messages" : null)}
        >
          <DropdownMenuTrigger asChild>
            <button className="p-2 hover:bg-gray-700 rounded-md transition-colors">
              <MessageCircle className="h-5 w-5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>No hay mensajes nuevos</DropdownMenuItem>
            <DropdownMenuItem>Ver todos los mensajes</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu
          open={activeDropdown === "user"}
          onOpenChange={(open) => setActiveDropdown(open ? "user" : null)}
        >
          <DropdownMenuTrigger asChild>
            <button className="p-2 hover:bg-gray-700 rounded-md transition-colors">
              <User className="h-5 w-5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Perfil</DropdownMenuItem>
            <DropdownMenuItem>Configuración</DropdownMenuItem>
            <DropdownMenuItem>Cerrar sesión</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu
          open={activeDropdown === "search"}
          onOpenChange={(open) => setActiveDropdown(open ? "search" : null)}
        >
          <DropdownMenuTrigger asChild>
            <button className="p-2 hover:bg-gray-700 rounded-md transition-colors">
              <Search className="h-5 w-5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div className="p-2">
              <input
                type="text"
                placeholder="Buscar..."
                className="w-full p-2 text-sm border rounded bg-gray-800 text-white border-gray-700"
              />
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default TopBar;

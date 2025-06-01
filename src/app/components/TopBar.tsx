"use client";
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
import { useAuthStore } from "@/store/authStore";
import {
  File,
  Folder,
  FolderPlus,
  Home,
  ListTodo,
  LogOut,
  Upload,
  User,
  UserPlus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useCreateDirectory } from "../api/GetFiles/FtpCreateDirectory";
import { useUploadFile } from "../api/GetFiles/FtpUploadFile";
import { useStoreNumControlByUser } from "@/lib/store/NumControlByUser";

const TopBar = () => {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { setNumControlByUser } = useStoreNumControlByUser();

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [folderName, setFolderName] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const createDirectory = useCreateDirectory();
  const uploadFile = useUploadFile();

  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadFile.mutate(
        { file, remotePath: user!.personalPath },
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
    const directoryPath = `${user!.personalPath}/${folderName}`;

    createDirectory.mutate(directoryPath, {
      onSuccess: () => {
        toast.success("Directorio creado exitosamente.");
      },
      onError: () => {
        toast.error("Error al crear el directorio");
      },
    });
    // Cierra el modal después de crear la carpeta
    setIsFolderModalOpen(false);
    setFolderName(""); // Limpia el input después de crear la carpeta
  };

  const handleGoUsersScreen = () => {
    router.push("/users");
  };

  const handleGoRegisterNewUser = () => {
    router.push("/register");
  };

  const handleGoProfile = () => {
    setNumControlByUser(user!.controlNum);
    router.push("/perfil");
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleGoExplorer = () => {
    router.push("/explorer");
  };

  return (
    <div className="relative z-10 flex justify-between items-center p-2 h-14 bg-[#1111]/90 text-white">
      {/* IZQUIERDA */}
      <div className="flex items-center gap-2">
        <button className="p-2 hover:bg-[#111]/60 rounded-md transition-colors">
          <Home className="h-5 w-5" />
        </button>

        <DropdownMenu
          open={activeDropdown === "create"}
          onOpenChange={(open) => setActiveDropdown(open ? "create" : null)}
        >
          <DropdownMenuTrigger asChild>
            <Button className=" bg-transparent hover:bg-[#20252A]/60  transition-colors text-white px-4 py-2 rounded-lg font-semibold text-sm">
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
              onSelect={() => {
                fileInputRef.current?.setAttribute("accept", "*/*");
                handleFileUploadClick();
              }}
            >
              <Upload className="w-4 h-4 mr-2" />
              Subir archivo
            </DropdownMenuItem>

            <div className="border-t border-gray-300 my-1" />
            <DropdownMenuItem
              className="hover:bg-gray-100 cursor-pointer"
              onSelect={() => {
                fileInputRef.current?.setAttribute("accept", ".doc,.docx"); // Solo archivos Word
                handleFileUploadClick();
              }}
            >
              <File className="w-4 h-4 mr-2 text-blue-600" />
              Documento de Word
            </DropdownMenuItem>
            <DropdownMenuItem
              className="hover:bg-gray-100 cursor-pointer"
              onSelect={() => {
                fileInputRef.current?.setAttribute("accept", ".xls,.xlsx,.csv"); // Solo archivos Excel
                handleFileUploadClick();
              }}
            >
              <File className="w-4 h-4 mr-2 text-green-600" />
              Libro de Excel
            </DropdownMenuItem>
            <DropdownMenuItem
              className="hover:bg-gray-100 cursor-pointer"
              onSelect={() => {
                fileInputRef.current?.setAttribute("accept", ".ppt,.pptx"); // Solo archivos PowerPoint
                handleFileUploadClick();
              }}
            >
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
          open={activeDropdown === "user"}
          onOpenChange={(open) => setActiveDropdown(open ? "user" : null)}
        >
          <DropdownMenuTrigger asChild>
            <button className="p-2 hover:bg-gray-700 rounded-md transition-colors">
              <User className="h-5 w-5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleGoProfile}>
              <User className="w-4 h-4 mr-2" />
              Perfil
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleGoExplorer}>
              <Folder className="w-4 h-4 mr-2" />
              Archivos
            </DropdownMenuItem>
            {user?.role === "Admin" && (
              <>
                <DropdownMenuItem onClick={handleGoRegisterNewUser}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Registrar nuevo usuario
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleGoUsersScreen}>
                  <ListTodo className="w-4 h-4 mr-2" />
                  Gestionar usuarios
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
              <LogOut className="w-4 h-4 mr-2 text-red-600" />
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default TopBar;

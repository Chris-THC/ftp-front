import { useCreateDirectory } from "@/app/api/GetFiles/FtpCreateDirectory";
import { useUploadFile } from "@/app/api/GetFiles/FtpUploadFile";
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
import { File, Upload } from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

interface ActionButtonsProps {
  currentPath: string;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ currentPath }) => {
  const uploadFile = useUploadFile();
  const createDirectory = useCreateDirectory();

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [folderName, setFolderName] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadFile.mutate(
        { file, remotePath: currentPath },
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
    const directoryPath = `${currentPath}/${folderName}`;

    createDirectory.mutate(directoryPath, {
      onSuccess: () => {
        toast.success("Directorio creado exitosamente.");
      },
      onError: () => {
        toast.error("Error al crear el directorio");
      },
    });

    setIsFolderModalOpen(false);
    setFolderName(""); // Limpia el input después de crear la carpeta
  };

  return (
    <div className="flex items-center border-b p-2 space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          setActiveDropdown(null);
          setIsFolderModalOpen(true);
          console.log("Crear carpeta button clicked");
        }}
      >
        Crear carpeta
      </Button>

      <DropdownMenu
        open={activeDropdown === "create"}
        onOpenChange={(open) => setActiveDropdown(open ? "create" : null)}
      >
        <DropdownMenuTrigger asChild>
          <Button variant={"outline"}>+ Subir Archivo</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-56 bg-white text-black border border-gray-300"
          align="start"
        >
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
    </div>
  );
};

export default ActionButtons;

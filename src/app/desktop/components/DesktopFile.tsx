import { useDeleteDirectory } from "@/app/api/GetFiles/FtpDeleteDirectory";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Download,
  File as FileIcon,
  Folder,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { File } from "../interface/Interface";
import { useDeleteFileMutation } from "@/app/api/GetFiles/FtpDeleteFile";
import downloadFile from "@/app/api/GetFiles/FtpDonwload";

interface DesktopFileProps {
  file: File;
  editingItemId: string | null;
  editingName: string;
  inputRef: React.RefObject<HTMLTextAreaElement>;
  handleIconClick: (e: React.MouseEvent, fullPath: string) => void;
  handleDoubleClick: (e: React.MouseEvent, fullPath: string) => void;
  handleNameChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  finishEditing: () => void;
}

const DesktopFile: React.FC<DesktopFileProps> = ({
  file,
  editingItemId,
  editingName,
  inputRef,
  handleIconClick,
  handleDoubleClick,
  handleNameChange,
  handleKeyDown,
  finishEditing,
}) => {
  const ftpDeleteDirectory = useDeleteDirectory();
  const ftpDeleteFile = useDeleteFileMutation();

  const icon = file.directory ? (
    <Folder className="h-10 w-10" fill="#FFB74D" stroke="#F57C00" />
  ) : (
    <FileIcon className="h-10 w-10" />
  );

  let clickTimeout: NodeJS.Timeout;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    clearTimeout(clickTimeout);
    clickTimeout = setTimeout(() => handleIconClick(e, file.fullPath), 200);
  };

  const handleDoubleClickWrapper = (e: React.MouseEvent) => {
    e.stopPropagation();
    clearTimeout(clickTimeout);
    handleDoubleClick(e, file.fullPath);
  };

  useEffect(() => {
    if (editingItemId === file.fullPath && inputRef.current) {
      const textarea = inputRef.current;
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  }, [editingName, editingItemId]);

  const handleDownload = async (file: File): Promise<void> => {
    try {
      await downloadFile(file.fullPath);
      console.log("Archivo descargado exitosamente");
    } catch (error) {
      console.error("Error al descargar el archivo:", error);
    }
  };

  function handleDelete(file: File, e?: React.MouseEvent): void {
    if (e) e.stopPropagation(); // Evita que el click del menú propague

    if (file.directory) {
      ftpDeleteDirectory.mutate(file.fullPath, {
        onSuccess: () => {
          toast.success("Carpeta eliminada con éxito.");
        },
        onError: () => {
          toast.error("Error al eliminar la carpeta.");
        },
      });
    } else {
      ftpDeleteFile.mutate(file.fullPath, {
        onSuccess: () => {
          toast.success("Archivo eliminado con éxito.");
        },
        onError: () => {
          toast.error("Error al eliminar el archivo.");
        },
      });
    }
  }
  // El menú se muestra para archivos y carpetas.
  const renderMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="absolute bottom-0 right-0 bg-black/20 rounded-b-sm group-hover:flex flex items-center justify-center"
          onClick={(e) => e.stopPropagation()}
          tabIndex={-1}
        >
          <MoreHorizontal className="h-6 w-6 text-white" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {!file.directory && (
          <DropdownMenuItem onClick={() => handleDownload(file)}>
            <Download className="mr-2 h-4 w-4" />
            Descargar
          </DropdownMenuItem>
        )}
        {!file.directory && <DropdownMenuSeparator />}
        <DropdownMenuItem
          onClick={(e) => handleDelete(file, e)}
          className="text-red-600 focus:text-red-600"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div
      className="relative flex flex-col items-center w-24 cursor-pointer group"
      onClick={handleClick}
      onDoubleClick={handleDoubleClickWrapper}
    >
      <div
        className={`flex items-center justify-center w-16 h-16 rounded-sm relative ${
          file.directory ? "bg-[#FFB74D]" : "bg-gray-600"
        }`}
      >
        {icon}
        {renderMenu()}
      </div>
      {editingItemId === file.fullPath ? (
        <div className="mt-1 px-1 bg-black/40 rounded w-full">
          <textarea
            ref={inputRef}
            value={editingName}
            onChange={handleNameChange}
            onKeyDown={handleKeyDown}
            onBlur={() => finishEditing()}
            rows={1}
            className="w-full resize-none text-center text-white text-sm border-none outline-none bg-transparent rounded break-words overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      ) : (
        <span
          className="mt-1 px-1 text-center text-white text-sm rounded break-words max-w-[100px]"
          style={{ textShadow: "0px 0px 3px black, 1px 1px 2px black" }}
          onClick={(e) => e.stopPropagation()}
          onDoubleClick={(e) => handleDoubleClick(e, file.fullPath)}
        >
          {file.name}
        </span>
      )}
    </div>
  );
};

export default DesktopFile;

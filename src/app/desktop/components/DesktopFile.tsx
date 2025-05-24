import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, File as FileIcon, Folder, Trash2 } from "lucide-react";
import React, { useEffect } from "react";
import { File } from "../interface/Interface";

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

  // Ajusta la altura automáticamente
  useEffect(() => {
    if (editingItemId === file.fullPath && inputRef.current) {
      const textarea = inputRef.current;
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  }, [editingName, editingItemId]);

  function handleDownload(file: File): void {
    console.log(`Function not implemented. ${file.name}`);
  }

  function handleDelete(file: File): void {
    console.log(`Function not implemented. ${file.name}`);
  }

  return (
    <div
      className="flex flex-col items-center w-24 cursor-pointer"
      onClick={handleClick}
      onDoubleClick={handleDoubleClickWrapper}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div
            className={`flex items-center justify-center w-14 h-14 rounded-full ${
              file.directory ? "bg-[#FFB74D]" : "bg-gray-600"
            }`}
          >
            {icon}
          </div>
        </DropdownMenuTrigger>
        {!file.directory && (
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => handleDownload(file)}>
              <Download className="mr-2 h-4 w-4" />
              Descargar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleDelete(file)}
              className="text-red-600 focus:text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        )}
      </DropdownMenu>

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

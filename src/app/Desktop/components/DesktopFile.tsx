import React from "react";
import { Folder, File as FileIcon } from "lucide-react";
import { File } from "../interface/Interface";

interface DesktopFileProps {
  file: File;
  editingItemId: string | null;
  editingName: string;
  inputRef: React.RefObject<HTMLInputElement>;
  handleIconClick: (e: React.MouseEvent, fullPath: string) => void;
  handleDoubleClick: (fullPath: string) => void;
  handleNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
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
    handleDoubleClick(file.fullPath);
  };

  return (
    <div
      className="flex flex-col items-center w-24 cursor-pointer"
      onClick={handleClick}
      onDoubleClick={handleDoubleClickWrapper}
    >
      <div
        className={`flex items-center justify-center w-16 h-16 rounded-full ${
          file.directory ? "bg-[#FFB74D]" : "bg-gray-600"
        }`}
      >
        {icon}
      </div>

      {editingItemId === file.fullPath ? (
        <div className="mt-1 px-1 bg-black/40 rounded w-full">
          <input
            ref={inputRef}
            type="text"
            value={editingName}
            onChange={handleNameChange}
            onKeyDown={handleKeyDown}
            size={editingName.length || 1} // Ajusta el tamaño del input al texto
            className="w-auto text-center text-white text-sm border-none outline-none bg-black/40 rounded"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      ) : (
        <span className="mt-1 px-1 text-center text-white text-sm bg-black/40 rounded">
          {file.name}
        </span>
      )}
    </div>
  );
};

export default DesktopFile;

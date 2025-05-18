import React, { useEffect } from "react";
import { Folder, File as FileIcon } from "lucide-react";
import { File } from "../interface/Interface";

interface DesktopFileProps {
  file: File;
  editingItemId: string | null;
  editingName: string;
  inputRef: React.RefObject<HTMLTextAreaElement>;
  handleIconClick: (e: React.MouseEvent, fullPath: string) => void;
  handleDoubleClick: (fullPath: string) => void;
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
    handleDoubleClick(file.fullPath);
  };

  // Ajusta la altura automáticamente
  useEffect(() => {
    if (editingItemId === file.fullPath && inputRef.current) {
      const textarea = inputRef.current;
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  }, [editingName, editingItemId]);

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
        <span className="mt-1 px-1 text-center text-white text-sm bg-black/40 rounded break-words max-w-[100px]">
          {file.name}
        </span>
      )}
    </div>
  );
};

export default DesktopFile;

import React from "react";
import { Folder, File as FileIcon } from "lucide-react";
import { File } from "../interface/Interface";

interface DesktopFileProps {
  file: File;
  dragState: {
    itemId: string | null;
  };
  editingItemId: string | null;
  editingName: string;
  inputRef: React.RefObject<HTMLInputElement>;
  startDrag: (e: React.MouseEvent, fullPath: string) => void;
  handleIconClick: (e: React.MouseEvent, fullPath: string) => void;
  handleNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const DesktopFile: React.FC<DesktopFileProps> = ({
  file,
  dragState,
  editingItemId,
  editingName,
  inputRef,
  startDrag,
  handleIconClick,
  handleNameChange,
  handleKeyDown,
}) => {
  const icon = file.directory ? (
    <Folder className="h-10 w-10" fill="#FFB74D" stroke="#F57C00" />
  ) : (
    <FileIcon className="h-10 w-10" />
  );

  return (
    <div
      key={file.fullPath}
      className="absolute flex flex-col items-center w-24 cursor-pointer m-5"
      style={{
        left: `${file.position?.x}px`,
        top: `${file.position?.y}px`,
        zIndex: dragState.itemId === file.fullPath ? 10 : 1,
        userSelect: "none",
      }}
      onMouseDown={(e) => startDrag(e, file.fullPath)}
      onClick={(e) => handleIconClick(e, file.fullPath)}
    >
      <div
        className={`flex items-center justify-center w-16 h-16 rounded-full ${
          file.directory ? "bg-[#FFB74D]" : "bg-gray-600"
        }`}
      >
        {icon}
      </div>

      {editingItemId === file.fullPath ? (
        <div className="mt-1 px-1 bg-white rounded w-full">
          <input
            ref={inputRef}
            type="text"
            value={editingName}
            onChange={handleNameChange}
            onKeyDown={handleKeyDown}
            className="w-full text-center text-black text-sm border-none outline-none bg-transparent"
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

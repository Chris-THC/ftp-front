"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import TopBar from "../components/TopBar";
import DesktopFile from "./components/DesktopFile";
import { useFolderTreeQuery } from "../api/GetFiles/FtpFilesTree";
import { useRenameMutation } from "../api/GetFiles/FtpRename";
import { useRouter } from "next/navigation";

export default function DesktopComponent() {
  const [notification, setNotification] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>("");
  const router = useRouter();

  const {
    data: files = [],
    isLoading,
    isError,
  } = useFolderTreeQuery("/home/admin");

  const renameMutation = useRenameMutation();

  // Simulamos cambio local del nombre mientras se edita
  const displayedFiles = useMemo(() => {
    return files.map((file) =>
      file.fullPath === editingItemId ? { ...file, name: editingName } : file
    );
  }, [files, editingItemId, editingName]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        editingItemId &&
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        finishEditing(true);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [editingItemId, editingName]);

  const handleIconClick = (e: React.MouseEvent, fullPath: string) => {
    e.stopPropagation(); // Evita que el evento se propague al contenedor
    const file = files.find((file) => file.fullPath === fullPath);
    if (file) {
      setTimeout(() => setNotification(null), 2000);
      if (file.directory) {
        router.push(`/explorer`);
      } else {
        // Aquí puedes manejar la lógica para mostrar el submenú
        console.log(`Mostrar menú para el archivo: ${file.name}`);
      }
    }
  };

  const handleDoubleClick = (e: React.MouseEvent, fullPath: string) => {
    e.stopPropagation(); // Evita conflictos con otros eventos
    const file = files.find((file) => file.fullPath === fullPath);
    if (file) {
      setEditingItemId(fullPath);
      setEditingName(file.name);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditingName(e.target.value);
  };

  const finishEditing = (save = true) => {
    if (save && editingItemId) {
      const oldPath = editingItemId;
      const newPath = `${oldPath.substring(
        0,
        oldPath.lastIndexOf("/") + 1
      )}${editingName}`;

      renameMutation.mutate(
        { oldPath, newPath },
        {
          onSuccess: () => {
            console.log(`Renamed successfully: ${oldPath} -> ${newPath}`);
          },
          onError: () => {
            console.error("Failed to rename the file or folder.");
          },
        }
      );
    }

    setEditingItemId(null);
    setEditingName("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      finishEditing(true);
    } else if (e.key === "Escape") {
      finishEditing(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-[#20252A]"
    >
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/img2.jpg')",
          opacity: 0.7,
        }}
      />
      <TopBar />

      <div className="relative z-0 w-full h-[calc(12vh-40px)] grid grid-cols-[repeat(auto-fill,_120px)] gap-4 p-4 mx-10 my-8">
        {isLoading ? (
          <p className="col-span-full text-center text-white"></p>
        ) : isError ? (
          <p className="col-span-full text-center text-red-500">
            Error al cargar los datos.
          </p>
        ) : (
          displayedFiles.map((file) => (
            <DesktopFile
              key={file.fullPath}
              file={file}
              editingItemId={editingItemId}
              editingName={editingName}
              inputRef={inputRef}
              handleIconClick={(e) => handleIconClick(e, file.fullPath)}
              handleDoubleClick={(e) => handleDoubleClick(e, file.fullPath)}
              handleNameChange={handleNameChange}
              handleKeyDown={handleKeyDown}
              finishEditing={finishEditing}
            />
          ))
        )}
        {notification && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-md">
            {notification}
          </div>
        )}
      </div>
    </div>
  );
}

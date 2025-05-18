"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import TopBar from "../components/TopBar";
import DesktopFile from "./components/DesktopFile";
import { useFolderTreeQuery } from "../api/GetFiles/FtpFilesTree";

export default function DesktopComponent() {
  const [notification, setNotification] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>("");

  const {
    data: files = [],
    isLoading,
    isError,
  } = useFolderTreeQuery("/home/admin");

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
    e.stopPropagation();
    const file = files.find((file) => file.fullPath === fullPath);
    if (file) {
      setNotification(`"${file.name}" seleccionado`);
      setTimeout(() => setNotification(null), 2000);
    }
  };

  const handleDoubleClick = (fullPath: string) => {
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
    // Aquí podrías llamar a una mutación si necesitas guardar el cambio en el backend
    setEditingItemId(null);
    setEditingName("");
    console.log("Este es el nuevo nombre:", save ? editingName : "sin guardar");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      finishEditing(true);
    } else if (e.key === "Escape") {
      finishEditing(false);
    }
  };

  if (isLoading) return <p>Cargando...</p>;
  if (isError) return <p>Error al cargar los datos.</p>;

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
      <div className="relative z-0 w-full h-[calc(100vh-40px)] grid grid-cols-[repeat(auto-fill,_120px)] gap-4 p-4 mx-10 my-8">
        {displayedFiles.map((file) => (
          <DesktopFile
            key={file.fullPath}
            file={file}
            editingItemId={editingItemId}
            editingName={editingName}
            inputRef={inputRef}
            handleIconClick={handleIconClick}
            handleDoubleClick={handleDoubleClick}
            handleNameChange={handleNameChange}
            handleKeyDown={handleKeyDown}
            finishEditing={finishEditing}
          />
        ))}

        {notification && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-md">
            {notification}
          </div>
        )}
      </div>
    </div>
  );
}

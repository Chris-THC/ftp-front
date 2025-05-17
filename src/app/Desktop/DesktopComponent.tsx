"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import TopBar from "../components/TopBar";
import DesktopFile from "./components/DesktopFile";
import { File } from "./interface/Interface";

// Simulación de la respuesta del servidor
const serverData: File[] = [
  {
    name: "0001-Alfonso_Flores_Leal",
    fullPath: "/home/admin/0001-Alfonso_Flores_Leal",
    timestamp: "17 May 2025, 01:38:00 PM",
    children: [
      {
        name: "Carpeta1",
        fullPath: "/home/admin/0001-Alfonso_Flores_Leal/Carpeta1",
        timestamp: "17 May 2025, 01:37:00 PM",
        children: [],
        directory: true,
        file: false,
      },
      {
        name: "img2.jpg",
        fullPath: "/home/admin/0001-Alfonso_Flores_Leal/img2.jpg",
        timestamp: "17 May 2025, 12:44:00 PM",
        children: [],
        directory: false,
        file: true,
      },
    ],
    directory: true,
    file: false,
  },
];

export default function DesktopComponent() {
  const [files, setFiles] = useState<File[]>([]);
  const [notification, setNotification] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Estado para la edición de nombres
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>("");

  useEffect(() => {
    // Mapear los datos del servidor al estado inicial
    setFiles(serverData);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        editingItemId &&
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        finishEditing(true); // Renombrar al hacer clic fuera
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [editingItemId, editingName]);

  const handleIconClick = (e: React.MouseEvent, fullPath: string) => {
    console.log(`Icon clicked: ${fullPath}`);
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
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingName(e.target.value);
  };

  const finishEditing = (save = true) => {
    if (save && editingItemId) {
      setFiles((prev) =>
        prev.map((file) =>
          file.fullPath === editingItemId
            ? { ...file, name: editingName }
            : file
        )
      );
    }
    setEditingItemId(null);
    setEditingName("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
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
      <div className="relative z-0 w-full h-[calc(100vh-40px)] grid grid-cols-[repeat(auto-fill,_120px)] gap-4 p-4 mx-10 my-8">
        {files.map((file) => (
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

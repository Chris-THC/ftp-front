"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import TopBar from "../components/TopBar";
import DesktopFile from "./components/DesktopFile";
import { File } from "./interface/Interface";

interface DragState {
  isDragging: boolean;
  itemId: string | null; // Usamos itemId para referirnos al fullPath
  startPos: { x: number; y: number };
  startMousePos: { x: number; y: number };
}

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
      {
        name: "track.mp3",
        fullPath: "/home/admin/0001-Alfonso_Flores_Leal/track.mp3",
        timestamp: "17 May 2025, 01:38:00 PM",
        children: [],
        directory: false,
        file: true,
      },
      {
        name: "video.mp4",
        fullPath: "/home/admin/0001-Alfonso_Flores_Leal/video.mp4",
        timestamp: "17 May 2025, 01:38:00 PM",
        children: [],
        directory: false,
        file: true,
      },
    ],
    directory: true,
    file: false,
  },
  {
    name: "19011297_Cristofer_Amador_Hernandez",
    fullPath: "/home/admin/19011297_Cristofer_Amador_Hernandez",
    timestamp: "17 May 2025, 01:39:00 PM",
    children: [
      {
        name: "CarpetaNueva",
        fullPath:
          "/home/admin/19011297_Cristofer_Amador_Hernandez/CarpetaNueva",
        timestamp: "17 May 2025, 01:39:00 PM",
        children: [],
        directory: true,
        file: false,
      },
      {
        name: "spring.jpg",
        fullPath: "/home/admin/19011297_Cristofer_Amador_Hernandez/spring.jpg",
        timestamp: "17 May 2025, 01:38:00 PM",
        children: [],
        directory: false,
        file: true,
      },
      {
        name: "testPDF.pdf",
        fullPath: "/home/admin/19011297_Cristofer_Amador_Hernandez/testPDF.pdf",
        timestamp: "17 May 2025, 01:39:00 PM",
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
  const desktopRef = useRef<HTMLDivElement>(null);

  // Estado para la edición de nombres
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Custom drag state
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    itemId: null,
    startPos: { x: 0, y: 0 },
    startMousePos: { x: 0, y: 0 },
  });

  // Contador para detectar doble clic
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const clickCountRef = useRef<number>(0);

  useEffect(() => {
    // Mapear los datos del servidor al estado de los iconos del escritorio
    const initialFiles: File[] = serverData.map((item, index) => ({
      ...item,
      position: { x: 70 + index * 120, y: 100 }, // Posición inicial
    }));
    setFiles(initialFiles);
  }, []);

  // Handle mouse move for dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragState.isDragging || !dragState.itemId) return;

      const dx = e.clientX - dragState.startMousePos.x;
      const dy = e.clientY - dragState.startMousePos.y;

      const newX = dragState.startPos.x + dx;
      const newY = dragState.startPos.y + dy;

      // Update icon position
      setFiles((prev) =>
        prev.map((file) =>
          file.fullPath === dragState.itemId
            ? { ...file, position: { x: newX, y: newY } }
            : file
        )
      );
    };

    const handleMouseUp = () => {
      setDragState((prev) => ({ ...prev, isDragging: false, itemId: null }));
    };

    if (dragState.isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragState]);

  // Enfocar el input cuando se inicia la edición
  useEffect(() => {
    if (editingItemId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingItemId]);

  // Start dragging an item
  const startDrag = (e: React.MouseEvent, fullPath: string) => {
    e.preventDefault();
    e.stopPropagation();

    // No iniciar arrastre si estamos editando
    if (editingItemId) return;

    const file = files.find((file) => file.fullPath === fullPath);
    if (!file?.position) return;

    setDragState({
      isDragging: true,
      itemId: fullPath,
      startPos: { ...file.position },
      startMousePos: { x: e.clientX, y: e.clientY },
    });
  };

  const handleIconClick = (e: React.MouseEvent, fullPath: string) => {
    // Imprimir el id del icono en la consola
    console.log(`Icon clicked: ${fullPath}`);

    // Solo procesar el clic si no estamos arrastrando
    if (!dragState.isDragging) {
      // Incrementar contador de clics
      clickCountRef.current += 1;

      // Si es el primer clic, configurar un timeout
      if (clickCountRef.current === 1) {
        if (clickTimeoutRef.current) {
          clearTimeout(clickTimeoutRef.current);
        }

        clickTimeoutRef.current = setTimeout(() => {
          // Si solo fue un clic, mostrar notificación
          if (clickCountRef.current === 1) {
            setNotification(
              `"${
                files.find((file) => file.fullPath === fullPath)?.name
              }" seleccionado`
            );

            // Limpiar notificación después de 2 segundos
            setTimeout(() => {
              setNotification(null);
            }, 2000);
          }

          // Reiniciar contador
          clickCountRef.current = 0;
        }, 300); // 300ms para detectar doble clic
      }

      // Si es doble clic, iniciar edición
      if (clickCountRef.current === 2) {
        if (clickTimeoutRef.current) {
          clearTimeout(clickTimeoutRef.current);
        }

        const file = files.find((file) => file.fullPath === fullPath);
        if (file) {
          setEditingItemId(fullPath);
          setEditingName(file.name);
        }

        // Reiniciar contador
        clickCountRef.current = 0;
      }
    }
  };

  // Manejar cambios en el input de edición
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingName(e.target.value);
  };

  // Finalizar la edición del nombre
  const finishEditing = (save = true) => {
    if (save && editingItemId) {
      // Actualizar el nombre del archivo/carpeta
      setFiles((prev) =>
        prev.map((file) =>
          file.fullPath === editingItemId
            ? { ...file, name: editingName }
            : file
        )
      );

      // Aquí puedes enviar el evento al servidor con el 'fullPath' como identificador
      handleNameChangeOnServer(editingItemId, editingName);
    }

    // Limpiar estado de edición
    setEditingItemId(null);
    setEditingName("");
  };

  // Función para manejar el cambio de nombre en el servidor
  const handleNameChangeOnServer = (fullPath: string, newName: string) => {
    // Aquí simularemos el envío al servidor con un toast
    alert(
      `Se ha cambiado el nombre de "${fullPath}" a "${newName}". Enviando al servidor...`
    );

    // Aquí es donde implementarías la lógica real para enviar al servidor
    console.log("Enviando al servidor:", { fullPath, newName });
  };

  // Manejar teclas en el input (Enter para guardar, Escape para cancelar)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      finishEditing(true);
    } else if (e.key === "Escape") {
      finishEditing(false);
    }
  };

  // Manejar clic fuera del input para guardar
  const handleClickOutside = (e: MouseEvent) => {
    if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
      finishEditing(true);
    }
  };

  useEffect(() => {
    if (editingItemId) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingItemId]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#20252A]">
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/img2.jpg')",
          opacity: 0.7,
        }}
      />
      <TopBar />
      <div
        ref={desktopRef}
        className="relative z-0 w-full h-[calc(100vh-40px)]"
      >
        {files.map((file) => (
          <DesktopFile
            key={file.fullPath}
            file={file}
            dragState={dragState}
            editingItemId={editingItemId}
            editingName={editingName}
            inputRef={inputRef}
            startDrag={startDrag}
            handleIconClick={handleIconClick}
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

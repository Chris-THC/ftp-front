"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import {
  Folder,
  HelpCircle,
  Grid,
  MessageCircle,
  User,
  Search,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DesktopIcon {
  id: string;
  name: string;
  icon: React.ReactNode;
  position: { x: number; y: number };
  color?: string;
}

interface DragState {
  isDragging: boolean;
  iconId: string | null;
  startPos: { x: number; y: number };
  startMousePos: { x: number; y: number };
}

export default function DesktopComponent() {
  const [icons, setIcons] = useState<DesktopIcon[]>([
    {
      id: "file-station",
      name: "File Station",
      icon: <Folder className="h-10 w-10" fill="#FFB74D" stroke="#F57C00" />,
      position: { x: 70, y: 100 },
      color: "#FFB74D",
    },
    {
      id: "help",
      name: "Ayuda de DSM",
      icon: <HelpCircle className="h-10 w-10" />,
      position: { x: 70, y: 220 },
      color: "#26A69A",
    },
  ]);

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const desktopRef = useRef<HTMLDivElement>(null);

  // Estado para la edición de nombres
  const [editingIconId, setEditingIconId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Custom drag state
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    iconId: null,
    startPos: { x: 0, y: 0 },
    startMousePos: { x: 0, y: 0 },
  });

  // Contador para detectar doble clic
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const clickCountRef = useRef<number>(0);

  // Handle mouse move for dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragState.isDragging || !dragState.iconId) return;

      const dx = e.clientX - dragState.startMousePos.x;
      const dy = e.clientY - dragState.startMousePos.y;

      const newX = dragState.startPos.x + dx;
      const newY = dragState.startPos.y + dy;

      // Update icon position
      setIcons((prev) =>
        prev.map((icon) =>
          icon.id === dragState.iconId
            ? { ...icon, position: { x: newX, y: newY } }
            : icon
        )
      );
    };

    const handleMouseUp = () => {
      setDragState((prev) => ({ ...prev, isDragging: false, iconId: null }));
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
    if (editingIconId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingIconId]);

  // Start dragging an icon
  const startDrag = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();

    // No iniciar arrastre si estamos editando
    if (editingIconId) return;

    const icon = icons.find((icon) => icon.id === id);
    if (!icon) return;

    setDragState({
      isDragging: true,
      iconId: id,
      startPos: { ...icon.position },
      startMousePos: { x: e.clientX, y: e.clientY },
    });
  };

  const handleIconClick = (e: React.MouseEvent, id: string) => {
    // Imprimir el id del icono en la consola
    console.log(`Icon clicked: ${id}`);

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
              `Carpeta "${icons.find((icon) => icon.id === id)?.name}" abierta`
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

        const icon = icons.find((icon) => icon.id === id);
        if (icon) {
          setEditingIconId(id);
          setEditingName(icon.name);
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
    if (save && editingIconId) {
      // Actualizar el nombre del icono
      setIcons((prev) =>
        prev.map((icon) =>
          icon.id === editingIconId ? { ...icon, name: editingName } : icon
        )
      );

      // Aquí puedes enviar el evento al servidor
      handleNameChangeOnServer(editingIconId, editingName);
    }

    // Limpiar estado de edición
    setEditingIconId(null);
    setEditingName("");
  };

  // Función para manejar el cambio de nombre en el servidor
  const handleNameChangeOnServer = (iconId: string, newName: string) => {
    // Aquí simularemos el envío al servidor con un toast
    alert(`Se ha cambiado el nombre a "${newName}". Enviando al servidor...`);

    // Aquí es donde implementarías la lógica real para enviar al servidor
    console.log("Enviando al servidor:", { iconId, newName });
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
    if (editingIconId) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingIconId]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#20252A]">
      {/* Background image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/img2.jpg')",
          opacity: 0.7,
        }}
      />

      {/* Top bar */}
      <div className="relative z-10 flex justify-between items-center p-2 bg-[#20252A]/80 text-white">
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-700 rounded-md transition-colors">
            <Grid className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu
            open={activeDropdown === "messages"}
            onOpenChange={(open) => setActiveDropdown(open ? "messages" : null)}
          >
            <DropdownMenuTrigger asChild>
              <button className="p-2 hover:bg-gray-700 rounded-md transition-colors">
                <MessageCircle className="h-5 w-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>No hay mensajes nuevos</DropdownMenuItem>
              <DropdownMenuItem>Ver todos los mensajes</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu
            open={activeDropdown === "user"}
            onOpenChange={(open) => setActiveDropdown(open ? "user" : null)}
          >
            <DropdownMenuTrigger asChild>
              <button className="p-2 hover:bg-gray-700 rounded-md transition-colors">
                <User className="h-5 w-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Perfil</DropdownMenuItem>
              <DropdownMenuItem>Configuración</DropdownMenuItem>
              <DropdownMenuItem>Cerrar sesión</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu
            open={activeDropdown === "search"}
            onOpenChange={(open) => setActiveDropdown(open ? "search" : null)}
          >
            <DropdownMenuTrigger asChild>
              <button className="p-2 hover:bg-gray-700 rounded-md transition-colors">
                <Search className="h-5 w-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="p-2">
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="w-full p-2 text-sm border rounded bg-gray-800 text-white border-gray-700"
                />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Desktop area */}
      <div
        ref={desktopRef}
        className="relative z-0 w-full h-[calc(100vh-40px)]"
      >
        {/* Desktop icons */}
        {icons.map((icon) => (
          <div
            key={icon.id}
            className="absolute flex flex-col items-center w-24 cursor-pointer"
            style={{
              left: `${icon.position.x}px`,
              top: `${icon.position.y}px`,
              zIndex: dragState.iconId === icon.id ? 10 : 1,
              userSelect: "none",
            }}
            onMouseDown={(e) => startDrag(e, icon.id)}
            onClick={(e) => handleIconClick(e, icon.id)}
          >
            <div
              className={`flex items-center justify-center w-16 h-16 rounded-full ${
                icon.id === "help" ? "bg-[#26A69A]" : ""
              }`}
            >
              {icon.icon}
            </div>

            {editingIconId === icon.id ? (
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
                {icon.name}
              </span>
            )}
          </div>
        ))}

        {/* Notification */}
        {notification && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-md">
            {notification}
          </div>
        )}
      </div>
    </div>
  );
}

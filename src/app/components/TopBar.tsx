import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Grid, MessageCircle, Search, User } from "lucide-react";
import { useState } from "react";

const TopBar = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  return (
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
  );
};

export default TopBar;

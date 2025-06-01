"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useStoreNumControlByUser } from "@/lib/store/NumControlByUser";
import { useAuthStore } from "@/store/authStore";
import { Folder, Home, ListTodo, LogOut, User, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const TopBarOtherScreens = () => {
  const router = useRouter();
  const { setNumControlByUser } = useStoreNumControlByUser();
  const { user, logout } = useAuthStore();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const handleGoUsersScreen = () => {
    router.push("/users");
  };

  const handleGoRegisterNewUser = () => {
    router.push("/register");
  };

  const handleGoProfile = () => {
    setNumControlByUser(user!.controlNum);
    router.push("/perfil");
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };
  const handleGoHome = () => {
    router.push("/");
  };

  const handleGoExplorer = () => {
    router.push("/explorer");
  };

  return (
    <div className="relative z-10 flex justify-between items-center p-2 h-14 bg-[#1111]/90 text-white">
      {/* IZQUIERDA */}
      <div className="flex items-center gap-2">
        <button
          className="p-2 hover:bg-[#111]/60 rounded-md transition-colors"
          onClick={handleGoHome}
        >
          <Home className="h-5 w-5" />
        </button>
      </div>

      {/* DERECHA */}
      <div className="flex items-center gap-2">
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
            <DropdownMenuItem onClick={handleGoProfile}>
              <User className="w-4 h-4 mr-2" />
              Perfil
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleGoExplorer}>
              <Folder className="w-4 h-4 mr-2" />
              Archivos
            </DropdownMenuItem>
            {user?.role === "Admin" && (
              <>
                <DropdownMenuItem onClick={handleGoRegisterNewUser}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Registrar nuevo usuario
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleGoUsersScreen}>
                  <ListTodo className="w-4 h-4 mr-2" />
                  Gestionar usuarios
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
              <LogOut className="w-4 h-4 mr-2 text-red-600" />
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default TopBarOtherScreens;

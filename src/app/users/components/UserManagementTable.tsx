"use client";

import { useGetAllUserInfo } from "@/app/api/userRequest/GetAllUsers";
import { LoadingWithText } from "@/app/components/LoadingSpinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useStoreNumControlByUser } from "@/lib/store/NumControlByUser";
import {
  ArrowLeft,
  Edit,
  MoreVertical,
  Search,
  Trash2,
  UserPlus,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDeleteDirectory } from "@/app/api/GetFiles/FtpDeleteDirectory";
import toast from "react-hot-toast";
import { useDeleteUserById } from "@/app/api/userRequest/DeleteUser";

interface PersonalInfo {
  idPerInfo: number;
  name: string;
  lastName: string;
  maternalLastName: string;
  personalPath: string;
}

interface User {
  idUser: number;
  numControl: string;
  userRole: string;
  idPersonalInfo: number;
  personalInfo: PersonalInfo[];
}

export default function UserManagementTable() {
  const router = useRouter();
  const ftpDeleteDirectory = useDeleteDirectory();
  const deleteUser = useDeleteUserById();
  const { data: users, isLoading, isError } = useGetAllUserInfo();
  const { setNumControlByUser } = useStoreNumControlByUser();

  const [searchByName, setSearchByName] = useState("");
  const [searchByControl, setSearchByControl] = useState("");

  // Filtrar usuarios basado en los términos de búsqueda
  const filteredUsers = users?.filter((user) => {
    const personalInfo = user.personalInfo[0];
    const fullName =
      `${personalInfo.name} ${personalInfo.lastName} ${personalInfo.maternalLastName}`.toLowerCase();

    const matchesName =
      searchByName === "" || fullName.includes(searchByName.toLowerCase());
    const matchesControl =
      searchByControl === "" || user.numControl.includes(searchByControl);

    return matchesName && matchesControl;
  });

  // Función para obtener el color del badge según el rol
  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "bg-red-100 text-red-800 hover:bg-red-100/80";
      case "professor":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100/80";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100/80";
    }
  };

  const handleEditUser = (user: User) => {
    setNumControlByUser(user.numControl);
    router.push("/perfil");
  };

  const handleGoBack = () => {
    router.push("/");
  };

  const handleRegisterNewUser = () => {
    router.push("/register");
  };

  const handleDeleteUser = (user: User) => {
    ftpDeleteDirectory.mutate(user.personalInfo[0].personalPath, {
      onSuccess: () => {
        deleteUser.mutate(user.idUser, {
          onSuccess: () => {
            toast.success("Usuario eliminado con éxito.");
          },
          onError: () => {
            toast.error("Error al eliminar el usuario.");
          },
        });
      },
      onError: () => {
        toast.error(
          "Error al eliminar la carpeta en el servidor FTP, por favor intenta de nuevo."
        );
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center text-muted-foreground">
          <LoadingWithText text="Cargando..." size="lg" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <Button variant="outline" onClick={handleGoBack} className="w-fit">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Regresar
        </Button>
        <Button
          onClick={handleRegisterNewUser}
          className="w-fit md:ml-auto bg-blue-800 hover:bg-blue-700 text-white"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Registrar nuevo usuario
        </Button>
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        {/* Botones superiores */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <Button variant="outline" onClick={handleGoBack} className="w-fit">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Regresar
          </Button>
          <Button
            onClick={handleRegisterNewUser}
            className="w-fit md:ml-auto bg-blue-800 hover:bg-blue-700 text-white"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Registrar usuario
          </Button>
        </div>

        {/* Título y descripción */}
        <div className="mb-4">
          <CardTitle className="text-2xl">Gestión de Usuarios</CardTitle>
          <CardDescription>
            Administra los usuarios registrados en el sistema
          </CardDescription>
        </div>

        {/* Campos de búsqueda */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="search-name">Buscar por nombre</Label>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="search-name"
                placeholder="Buscar por nombre..."
                className="pl-8"
                value={searchByName}
                onChange={(e) => setSearchByName(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="search-control">Buscar por número de control</Label>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="search-control"
                placeholder="Buscar por número de control..."
                className="pl-8"
                value={searchByControl}
                onChange={(e) => setSearchByControl(e.target.value)}
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">#</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead className="hidden sm:table-cell">
                    Número de Control
                  </TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead className="hidden lg:table-cell">Ruta</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers!.length > 0 ? (
                  filteredUsers?.map((user) => {
                    const personalInfo = user.personalInfo[0];
                    return (
                      <TableRow key={user.idUser}>
                        <TableCell className="font-medium">
                          {user.idUser}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>
                              {personalInfo.name} {personalInfo.lastName}{" "}
                              {personalInfo.maternalLastName}
                            </span>
                            <span className="text-sm text-muted-foreground sm:hidden">
                              {user.numControl}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {user.numControl}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={getRoleBadgeColor(user.userRole)}
                          >
                            {user.userRole}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <span className="text-sm font-mono text-muted-foreground truncate max-w-[350px] block">
                            {personalInfo.personalPath}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                                <span className="sr-only">Abrir menú</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Acciones</DropdownMenuLabel>

                              <DropdownMenuItem
                                onClick={() => handleEditUser(user)}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDeleteUser(user)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Eliminar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No se encontraron usuarios.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

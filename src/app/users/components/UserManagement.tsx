"use client";

import { useGetAllUserInfo } from "@/app/api/userRequest/GetAllUsers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
} from "@tanstack/react-table";
import {
  ArrowLeft,
  Edit,
  Eye,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

// Tipos basados en tu estructura JSON
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

// Función para obtener el nombre completo
const getFullName = (personalInfo: PersonalInfo[]) => {
  if (personalInfo.length === 0) return "N/A";
  const info = personalInfo[0];
  return `${info.name} ${info.lastName} ${info.maternalLastName}`;
};

// Función para obtener el color del badge según el rol
const getRoleBadgeVariant = (role: string) => {
  switch (role.toLowerCase()) {
    case "admin":
      return "destructive";
    case "profesor":
      return "default";
    case "estudiante":
      return "secondary";
    default:
      return "outline";
  }
};

export default function UserManagement() {
  const router = useRouter();
  const { data: users, isLoading, isError } = useGetAllUserInfo();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  // Definición de columnas para TanStack Table
  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        accessorKey: "idUser",
        header: "ID",
        cell: ({ row }) => (
          <div className="font-medium">{row.getValue("idUser")}</div>
        ),
      },
      {
        accessorKey: "numControl",
        header: "Número de Control",
        cell: ({ row }) => (
          <div className="font-mono">{row.getValue("numControl")}</div>
        ),
      },
      {
        id: "fullName",
        header: "Nombre Completo",
        accessorFn: (row) => getFullName(row.personalInfo),
        cell: ({ row }) => (
          <div className="font-medium">
            {getFullName(row.original.personalInfo)}
          </div>
        ),
      },
      {
        accessorKey: "userRole",
        header: "Rol",
        cell: ({ row }) => {
          const role = row.getValue("userRole") as string;
          return <Badge variant={getRoleBadgeVariant(role)}>{role}</Badge>;
        },
      },
      {
        id: "personalPath",
        header: "Ruta Personal",
        accessorFn: (row) => row.personalInfo[0]?.personalPath || "N/A",
        cell: ({ row }) => (
          <div className="text-sm text-muted-foreground font-mono max-w-[200px] truncate">
            {row.original.personalInfo[0]?.personalPath || "N/A"}
          </div>
        ),
      },
      {
        id: "actions",
        header: "Acciones",
        cell: ({ row }) => {
          const user = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Abrir menú</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => navigator.clipboard.writeText(user.numControl)}
                >
                  Copiar número de control
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Eye className="mr-2 h-4 w-4" />
                  Ver detalles
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Edit className="mr-2 h-4 w-4" />
                  Editar usuario
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Eliminar usuario
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: users
      ? users.map((user) => ({
          idUser: user.idUser,
          numControl: user.numControl,
          userRole: user.userRole,
          idPersonalInfo: user.idPersonalInfo,
          personalInfo: user.personalInfo,
        }))
      : [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
  });

  // Redirigir a la página de registro de usuario
  const handleGoToCreateNewUser = () => {
    router.push("/register");
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-2">
          <Button variant={"outline"} onClick={() => router.push("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Regresar
          </Button>
        </div>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Gestión de Usuarios
          </h1>
          <p className="text-muted-foreground">
            Administra los usuarios de tu aplicación
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            className="bg-green-500 text-white hover:bg-green-600"
            onClick={handleGoToCreateNewUser}
          >
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Usuario
          </Button>
        </div>
      </div>

      {/* Filters */}

      <Card>
        <CardHeader>
          <CardTitle>Usuarios Registrados</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-center text-muted-foreground">
              Cargando usuarios...
            </p>
          ) : isError ? (
            <p className="text-center text-red-500">
              Error al cargar usuarios.
            </p>
          ) : (
            <>
              <div className="flex items-center py-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar usuarios..."
                    value={globalFilter ?? ""}
                    onChange={(event) =>
                      setGlobalFilter(String(event.target.value))
                    }
                    className="pl-8"
                  />
                </div>
              </div>

              {/* Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <TableHead key={header.id}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </TableHead>
                        ))}
                      </TableRow>
                    ))}
                  </TableHeader>
                  <TableBody>
                    {table.getRowModel().rows?.length ? (
                      table.getRowModel().rows.map((row) => (
                        <TableRow
                          key={row.id}
                          data-state={row.getIsSelected() && "selected"}
                        >
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={columns.length}
                          className="h-24 text-center"
                        >
                          No se encontraron usuarios.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                  {table.getFilteredSelectedRowModel().rows.length} de{" "}
                  {table.getFilteredRowModel().rows.length} fila(s)
                  seleccionadas.
                </div>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                  >
                    Anterior
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                  >
                    Siguiente
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

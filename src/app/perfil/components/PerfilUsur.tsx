"use client";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { useGetUserByControlNumber } from "@/app/api/userRequest/GetUserByNumControl";
import { LoadingWithText } from "@/app/components/LoadingSpinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateUserPasswordMutation } from "@/app/api/userRequest/UpdatePassword";

export default function PerfilUser() {
  const router = useRouter();

  const {
    data: userData,
    isLoading,
    isError,
  } = useGetUserByControlNumber("19011297");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { mutate: updatePassword } = useUpdateUserPasswordMutation();

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas nuevas no coinciden.");
      setTimeout(() => setError(""), 15000);
      return;
    }

    if (newPassword.length < 5) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      setTimeout(() => setError(""), 15000);
      return;
    }

    try {
      updatePassword(
        { idUser: userData!.idUser, password: newPassword },
        {
          onSuccess: () => {
            setSuccess("Contraseña actualizada correctamente.");
            setNewPassword("");
            setConfirmPassword("");
            setTimeout(() => setSuccess(""), 15000);
          },
          onError: () => {
            setError("Error al actualizar la contraseña. Inténtelo de nuevo.");
            setTimeout(() => setError(""), 15000);
          },
        }
      );
    } catch (err) {
      setError("Error inesperado. Inténtelo de nuevo.");
      setTimeout(() => setError(""), 15000);
    }
  };

  const handleNavigateToExplore = () => {
    router.push("/explorer");
  };

  const personalInfo = userData?.personalInfo[0];
  const fullName = `${personalInfo?.name} ${personalInfo?.lastName} ${personalInfo?.maternalLastName}`;

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <div className="text-center text-muted-foreground">
          <LoadingWithText text="Cargando..." size="lg" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <Button
          variant="outline"
          onClick={handleNavigateToExplore}
          className="mb-4"
        >
          Regresar
        </Button>
        <p>Error al cargar la información. Por favor, inténtelo más tarde.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-3xl">
      <div className="flex justify-between items-start mb-6">
        <Button variant="outline" onClick={() => router.push("/explorer")}>
          Regresar
        </Button>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Información Personal</CardTitle>
          <CardDescription>Detalles de tu cuenta</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-muted-foreground">
                Nombre Completo
              </Label>
              <p className="font-medium">{fullName}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">
                Número de Control
              </Label>
              <p className="font-medium">{userData!.numControl}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Rol</Label>
              <p className="font-medium">{userData!.userRole}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">
                Carpeta Asignada
              </Label>
              <p className="font-medium text-sm break-all">
                /{personalInfo?.personalPath.split("/ftp-data/")[1] || "N/A"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cambiar Contraseña</CardTitle>
          <CardDescription>Actualiza tu contraseña de acceso</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6 bg-yellow-50 text-yellow-800 border-yellow-200">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Advertencia</AlertTitle>
            <AlertDescription>
              Si olvida su contraseña, tendrá que ponerse en contacto con el
              Coordinador de Posgrado para restablecerla.
            </AlertDescription>
          </Alert>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert
              variant="default"
              className="mb-4 bg-green-50 text-green-800 border-green-200"
            >
              <AlertTitle>Éxito</AlertTitle>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">Nueva Contraseña</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                  <span className="sr-only">
                    {showNewPassword
                      ? "Ocultar contraseña"
                      : "Mostrar contraseña"}
                  </span>
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">
                Confirmar Nueva Contraseña
              </Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                  <span className="sr-only">
                    {showConfirmPassword
                      ? "Ocultar contraseña"
                      : "Mostrar contraseña"}
                  </span>
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full">
              Actualizar Contraseña
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

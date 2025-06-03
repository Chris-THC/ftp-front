"use client";

import apiClient from "@/app/api/client/ApiClient";
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
import { useStoreNumControlByUser } from "@/lib/store/NumControlByUser";
import { useStoreFullPath } from "@/lib/store/StoreUserFullPath";
import { useAuthStore } from "@/store/authStore";
import { jwtDecode } from "jwt-decode";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";

interface LoginFormData {
  numControl: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuthStore();
  const router = useRouter();

  const { setUserFullPath } = useStoreFullPath();
  const { setNumControlByUser } = useStoreNumControlByUser();

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await apiClient.post("/ftp/auth/login", data);
      const { token } = response.data;

      // Decodificar el token para obtener los datos necesarios
      const decodedToken: {
        role: string;
        personalPath: string;
        controlNum: string;
      } = jwtDecode(token);

      const { role, personalPath, controlNum } = decodedToken;

      // Establecer el personalPath en el estado global
      setUserFullPath(personalPath);
      setNumControlByUser(controlNum);
      // setPerfilNumControl(controlNum);

      // Guardar el token en el estado global y cookies
      login(token);

      // Redirigir según el rol
      switch (role) {
        case "Admin":
          router.push("/");
          break;
        case "Professor":
          router.push("/");
          break;
        case "Student":
          router.push("/explorer");
          break;
        default:
          console.error("Rol desconocido:", role);
          toast.error("Rol desconocido");
      }
    } catch (error) {
      toast.error("Credenciales inválidas");
      console.error("Error en el login:", error);
    }
  };

  return (
    <div
      className="w-full h-screen flex items-center justify-center bg-cover bg-center p-8"
      style={{
        backgroundImage: "url('/ito1.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-16 max-w-7xl mx-auto">
        {/* Sección de texto izquierda */}
        <div className="text-white text-center md:text-left max-w-2xl p-4 md:p-8">
          <h2 className="text-3xl md:text-3xl font-extrabold leading-tight text-center md:text-left">
            MSC-DEPI
          </h2>
          <p className="mt-6 md:mt-8 text-sm md:text-lg opacity-90 leading-relaxed text-center md:text-left">
            Sistema diseñado para gestionar documentos relacionados con la
            maestría en sistemas computacionales.
          </p>
          <p className="mt-2 text-sm md:text-md opacity-80 leading-relaxed text-center md:text-left">
            Ofreciendo una plataforma intuitiva y segura.
          </p>
        </div>

        {/* Componente Card del formulario */}
        <Card className="w-full max-w-lg bg-white/90 shadow-2xl rounded-lg overflow-hidden">
          <CardHeader className="space-y-4 p-8">
            <CardTitle className="text-4xl font-bold text-center text-gray-800">
              Iniciar Sesión
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              Ingresa tus credenciales para acceder al sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-0">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="numControl" className="text-gray-700">
                  Número de Control
                </Label>
                <Input
                  id="numControl"
                  placeholder="Ej. 12345678"
                  autoComplete="off"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                  {...register("numControl", {
                    required: "El número de control es obligatorio",
                  })}
                />
                {errors.numControl && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.numControl.message}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <Label htmlFor="password" className="text-gray-700">
                  Contraseña
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="off"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                    {...register("password", {
                      required: "La contraseña es obligatoria",
                      minLength: {
                        value: 4,
                        message:
                          "La contraseña debe tener al menos 4 caracteres",
                      },
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <>
                        <Eye name="eye-off" className="w-5 h-5" />
                      </>
                    ) : (
                      <>
                        <EyeOff name="eye" className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full py-3 text-xl font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-200 ease-in-out transform hover:-translate-y-0.5"
              >
                Iniciar sesión
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default LoginForm;

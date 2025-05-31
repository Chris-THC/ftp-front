"use client";
import toast from "react-hot-toast";
import { useRegisterUser } from "@/app/api/userRequest/RegisterUser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

interface FormData {
  name: string;
  lastName: string;
  maternalLastName: string;
  controlNumber: string;
  password: string;
  userRole: number;
  personalPath: string; // Optional, will be set in the onSubmit function
}

const RegistrationForm = () => {
  const createNewUser = useRegisterUser();

  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    const formattedData = {
      personalInfoForm: {
        name: data.name,
        lastName: data.lastName,
        maternalLastName: data.maternalLastName,
        personalPath: `/home/admin/ftp-data/${data.controlNumber}-${data.name}`,
      },
      userForm: {
        controlNumber: data.controlNumber,
        password: data.password,
        userRole: data.userRole,
      },
    };

    createNewUser.mutate(formattedData, {
      onSuccess: () => {
        toast.success("Usuario registrado exitosamente.");
        router.push("/users");
      },
      onError: () => {
        toast.error("Error al registrar el usuario");
      },
    });

    console.log(JSON.stringify(formattedData, null, 2));
  };

  const handleBackToUsers = () => {
    router.push("/users");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Hero Section */}
      <div
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
        style={{
          backgroundImage: "url('/ito1.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>{" "}
        {/* Increased opacity */}
        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-white w-full">
          <div className="absolute top-6 left-6">
            <Button
              onClick={handleBackToUsers}
              className="flex items-center gap-2 bg-blue-800 text-white hover:bg-blue-700 font-medium px-4 py-2 rounded"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Regresar
            </Button>
          </div>
          <div className="mb-8 flex justify-center">
            {/* <Smartphone className="w-32 h-32 text-white/90" />{" "} */}
            {/* Slightly brighter icon */}
          </div>
          <h2 className="text-4xl font-bold mb-4 text-center w-full text-white">
            Regístra a un nuevo usuario de la Maestría en Sistemas
            Computacionales
          </h2>
          <p className="text-lg text-center text-white max-w-md w-full">
            Forma parte de la comunidad del Instituto Tecnológico de Orizaba y
            accede a las herramientas necesarias para impulsar tu desarrollo
            profesional.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Registrar a un nuevo usuario
            </h1>
            <p className="text-gray-600">
              Completa el formulario para crear una nueva cuenta
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Control Number and Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="controlNumber"
                  className="text-sm font-medium text-gray-700"
                >
                  NÚMERO DE CONTROL
                </Label>
                <Input
                  id="controlNumber"
                  autoComplete="off"
                  {...register("controlNumber", {
                    required: "El número de control es requerido",
                  })}
                  placeholder="Número de control"
                  className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.controlNumber && (
                  <p className="text-sm text-red-600">
                    {errors.controlNumber.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  CONTRASEÑA
                </Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="off"
                  {...register("password", {
                    required: "La contraseña es requerida",
                    minLength: {
                      value: 4,
                      message: "La contraseña debe tener al menos 4 caracteres",
                    },
                  })}
                  placeholder="••••••••"
                  className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.password && (
                  <p className="text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            {/* First Name and Last Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-700"
                >
                  NOMBRE
                </Label>
                <Input
                  id="name"
                  autoComplete="off"
                  {...register("name", { required: "El nombre es requerido" })}
                  placeholder="Nombre"
                  className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="lastName"
                  className="text-sm font-medium text-gray-700"
                >
                  APELLIDO PATERNO
                </Label>
                <Input
                  id="lastName"
                  autoComplete="off"
                  {...register("lastName", {
                    required: "El apellido paterno es requerido",
                  })}
                  placeholder="Apellido paterno"
                  className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.lastName && (
                  <p className="text-sm text-red-600">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            {/* Maternal Last Name and User Role */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="maternalLastName"
                  className="text-sm font-medium text-gray-700"
                >
                  APELLIDO MATERNO
                </Label>
                <Input
                  id="maternalLastName"
                  autoComplete="off"
                  {...register("maternalLastName", {
                    required: "El apellido materno es requerido",
                  })}
                  placeholder="Apellido materno"
                  className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.maternalLastName && (
                  <p className="text-sm text-red-600">
                    {errors.maternalLastName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  ROL DE USUARIO
                </Label>
                <Select
                  onValueChange={(value) =>
                    setValue("userRole", Number.parseInt(value))
                  }
                >
                  <SelectTrigger className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Selecciona rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Administrador</SelectItem>
                    <SelectItem value="1">Docente</SelectItem>
                    <SelectItem value="2">Estudiante</SelectItem>
                  </SelectContent>
                </Select>
                {errors.userRole && (
                  <p className="text-sm text-red-600">
                    El rol de usuario es requerido
                  </p>
                )}
              </div>
            </div>
            <div>
              <p className="text-sm text-red-600 mt-2 font-semibold">
                Por favor, no utilices caracteres especiales como acentos o la
                letra &quot;ñ&quot; para evitar conflictos con el servidor.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                type="submit"
                className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium"
              >
                CREAR CUENTA
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;

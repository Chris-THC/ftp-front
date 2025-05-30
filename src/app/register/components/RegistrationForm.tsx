"use client";

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
import Image from "next/image";
import { useForm } from "react-hook-form";

interface FormData {
  name: string;
  lastName: string;
  maternalLastName: string;
  controlNumber: string;
  password: string;
  userRole: number;
}

const RegistrationForm = () => {
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
      },
      userForm: {
        controlNumber: data.controlNumber,
        password: data.password,
        userRole: data.userRole,
      },
    };

    console.log(JSON.stringify(formattedData, null, 2));
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Hero Section */}

      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700  relative overflow-hidden">
        <Image
          src="/ito2.jpg"
          alt="Fondo del formulario"
          layout="fill"
          objectFit="cover"
          priority
        />
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Registrar un nuevo usuario
            </h1>
            <p className="text-gray-600">
              Completa el formulario para crear tu cuenta
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
                    <SelectItem value="1">Maestro</SelectItem>
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

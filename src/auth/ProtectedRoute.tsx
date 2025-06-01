"use client";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[]; // Lista de roles permitidos
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else if (!allowedRoles.includes(user.role)) {
      router.push("/explorer");
    }
  }, [user, router, allowedRoles]);

  if (!user || !allowedRoles.includes(user.role)) {
    return null; // Evita renderizar contenido mientras redirige
  }

  return <>{children}</>;
};

export default ProtectedRoute;

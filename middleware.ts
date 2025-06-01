import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  role: string;
  exp: number;
}

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token");
  const urlPath = req.nextUrl.pathname;

  // Ruta pública que no requiere autenticación
  const publicRoute = ["/login"];
  if (publicRoute.includes(urlPath)) {
    return NextResponse.next();
  }

  // Si no hay token, redirige al login (excepto para ruta pública)
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    // Decodificar el token para verificar el rol y la expiración
    const decodedToken: DecodedToken = jwtDecode(token?.value || "");

    // Verificar si el token ha expirado
    const currentTime = Math.floor(Date.now() / 1000);
    if (decodedToken.exp < currentTime) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Definir las rutas permitidas para cada rol
    const adminRoutes = ["/", "/explorer", "/register", "/users", "/perfil"];
    const professorRoutes = ["/", "/explorer", "/perfil"];
    const studentRoutes = ["/explorer", "/perfil"];

    // Verificar acceso según el rol
    if (decodedToken.role === "Admin") {
      if (adminRoutes.includes(urlPath)) {
        return NextResponse.next();
      }
    } else if (decodedToken.role === "Professor") {
      if (professorRoutes.includes(urlPath)) {
        return NextResponse.next();
      }
    } else if (decodedToken.role === "Student") {
      if (studentRoutes.includes(urlPath)) {
        return NextResponse.next();
      }
    }

    // Si el rol no tiene acceso a la ruta, redirige al login
    return NextResponse.redirect(new URL("/login", req.url));
  } catch (error) {
    // Si el token no es válido, redirige al login
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/", "/explorer", "/register", "/users", "/perfil"],
};

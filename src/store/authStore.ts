import { create } from "zustand";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

interface UserData {
  role: string;
  token: string;
  personalPath: string;
  controlNum: string;
  exp: number; // Agregado para validar expiración
}

interface AuthState {
  user: UserData | null;
  login: (token: string) => void;
  logout: () => void;
}

const isTokenExpired = (exp: number) => {
  const now = Math.floor(Date.now() / 1000); // tiempo actual en segundos
  return exp < now;
};

export const useAuthStore = create<AuthState>((set) => {
  // Cargar y validar desde las cookies
  const storedToken = Cookies.get("token");
  let initialUser: UserData | null = null;

  if (storedToken) {
    try {
      const decoded = jwtDecode<{
        role: string;
        personalPath: string;
        controlNum: string;
        exp: number;
      }>(storedToken);

      if (isTokenExpired(decoded.exp)) {
        // Token expirado, limpiar todo
        Cookies.remove("token");
      } else {
        initialUser = {
          token: storedToken,
          role: decoded.role,
          personalPath: decoded.personalPath,
          controlNum: decoded.controlNum,
          exp: decoded.exp,
        };
      }
    } catch (err) {
      console.error("Error al decodificar el token:", err);
      Cookies.remove("token");
    }
  }

  return {
    user: initialUser,
    login: (token) => {
      const decoded = jwtDecode<{
        role: string;
        personalPath: string;
        controlNum: string;
        exp: number;
      }>(token);

      const userData: UserData = {
        token,
        role: decoded.role,
        personalPath: decoded.personalPath,
        controlNum: decoded.controlNum,
        exp: decoded.exp,
      };

      // Guardar token en cookie persistente (opcionalmente hasta que expire)
      const expireDays = Math.ceil((decoded.exp - Date.now() / 1000) / 86400);
      Cookies.set("token", token, {
        secure: false, // ¡Cambiar a true para producción con HTTPS!
        sameSite: "Lax", // Considera "Lax" para un equilibrio
        expires: expireDays,
      });

      // Guardar en Zustand
      set({ user: userData });
    },
    logout: () => {
      Cookies.remove("token");
      set({ user: null });
    },
  };
});

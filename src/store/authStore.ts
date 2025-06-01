// import { create } from "zustand";
// import Cookies from "js-cookie";

// interface AuthState {
//   user: { role: string; token: string } | null;
//   login: (token: string, role: string) => void;
//   logout: () => void;
// }

// export const useAuthStore = create<AuthState>((set) => ({
//   user: null,
//   login: (token, role) => {
//     Cookies.set("token", token, { secure: true, sameSite: "strict" });
//     Cookies.set("role", role, { secure: true, sameSite: "strict" });
//     set({ user: { token, role } });
//   },
//   logout: () => {
//     Cookies.remove("token");
//     Cookies.remove("role");
//     set({ user: null });
//   },
// }));

import { create } from "zustand";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

interface UserData {
  role: string;
  token: string;
  personalPath: string;
  // Puedes agregar más campos del token aquí si los necesitas
}

interface AuthState {
  user: UserData | null;
  login: (token: string) => void; // Cambiamos para recibir solo el token
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  login: (token) => {
    // Decodificar el token para extraer la información
    const decoded = jwtDecode<{
      role: string;
      personalPath: string;
      // otras propiedades del token...
    }>(token);

    // Guardar en cookies y estado
    Cookies.set("token", token, { secure: true, sameSite: "strict" });
    set({
      user: {
        token,
        role: decoded.role,
        personalPath: decoded.personalPath,
      },
    });
  },
  logout: () => {
    Cookies.remove("token");
    set({ user: null });
  },
}));

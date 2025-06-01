import axios from "axios";
import Cookies from "js-cookie";

const apiClient = axios.create({
  baseURL: "http://192.168.1.66:8081/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar el token JWT desde las cookies
apiClient.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar la expiración del token
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      Cookies.remove("token");
      Cookies.remove("role");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default apiClient;

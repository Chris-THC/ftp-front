import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://192.168.1.71:8081/ftp",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar el token JWT
apiClient.interceptors.request.use((config) => {
  const token =
    "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxOTAxMTI5NyIsImlkVXNlciI6MiwiaWRQZXJzb25hbEluZm8iOjIsInJvbGUiOiJTdHVkZW50IiwiaWF0IjoxNzQ3NTk0MDk0LCJleHAiOjE3NDc2MzAwOTR9.9fA2zxTaoPawZl_xFBPxAuxr5sV7uKZ65ox-enIOLV4";
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;

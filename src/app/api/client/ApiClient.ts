import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://192.168.1.66:8081/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar el token JWT
apiClient.interceptors.request.use((config) => {
  const token =
    "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIwMTIxIiwiaWRVc2VyIjoxLCJpZFBlcnNvbmFsSW5mbyI6MSwicm9sZSI6IkFkbWluIiwicGVyc29uYWxQYXRoIjoiL2hvbWUvYWRtaW4iLCJpYXQiOjE3NDg3MjEwMTEsImV4cCI6MTc0ODc1NzAxMX0.fAtRjO6crKriZ8Mj1ZsMumUC8kqYEV5a-M0sH3t10B0";
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;

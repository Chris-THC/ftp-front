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
    "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIwMDAxIiwiaWRVc2VyIjoxLCJpZFBlcnNvbmFsSW5mbyI6MSwicm9sZSI6IkFkbWluIiwicGVyc29uYWxQYXRoIjoiL2hvbWUvYWRtaW4vMDAwMV9BbGZvbnNvX0Zsb3Jlc19MZWFsICIsImlhdCI6MTc0NzYwMTk5OSwiZXhwIjoxNzQ3NjM3OTk5fQ.Z0gnmXCUC2T74po9dhzmzDGCnnGHAi7_u3AJfIBPM54";
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;

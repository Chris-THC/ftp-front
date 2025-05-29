import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://192.168.0.200:8081/ftp",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar el token JWT
apiClient.interceptors.request.use((config) => {
  const token =
    "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIwMTIxIiwiaWRVc2VyIjoxLCJpZFBlcnNvbmFsSW5mbyI6MSwicm9sZSI6IkFkbWluIiwicGVyc29uYWxQYXRoIjoiL2hvbWUvYWRtaW4iLCJpYXQiOjE3NDg0NTI0MzYsImV4cCI6MTc0ODQ4ODQzNn0.GXZXKTf3kGdng2P-gu1Ox67TcSiJxGV77zciHf0HEMk";
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;

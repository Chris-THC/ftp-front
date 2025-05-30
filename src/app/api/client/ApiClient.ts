import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://192.168.1.66:8081/ftp",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar el token JWT
apiClient.interceptors.request.use((config) => {
  const token =
    "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIwMTIxIiwiaWRVc2VyIjoxLCJpZFBlcnNvbmFsSW5mbyI6MSwicm9sZSI6IkFkbWluIiwicGVyc29uYWxQYXRoIjoiL2hvbWUvYWRtaW4iLCJpYXQiOjE3NDg1NzUzNTQsImV4cCI6MTc0ODYxMTM1NH0.5olKStR_u7-MLMeDKlR2WEcyb5z813BhNyLJeSVDBPs";
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;

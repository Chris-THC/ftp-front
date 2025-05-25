import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://192.168.1.67:8081/ftp",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar el token JWT
apiClient.interceptors.request.use((config) => {
  const token =
    "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIwMTIxIiwiaWRVc2VyIjoxLCJpZFBlcnNvbmFsSW5mbyI6MSwicm9sZSI6IkFkbWluIiwicGVyc29uYWxQYXRoIjoiL2hvbWUvYWRtaW4iLCJpYXQiOjE3NDgyMDc0NzUsImV4cCI6MTc0ODI0MzQ3NX0.6gLE7CP_KfltZ_rTO2kQg-QFM5jAa9Cs_J43l9cLVDU";
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;

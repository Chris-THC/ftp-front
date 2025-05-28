import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://192.168.1.65:8081/ftp",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar el token JWT
apiClient.interceptors.request.use((config) => {
  const token =
    "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIwMTIxIiwiaWRVc2VyIjoxLCJpZFBlcnNvbmFsSW5mbyI6MSwicm9sZSI6IkFkbWluIiwicGVyc29uYWxQYXRoIjoiL2hvbWUvYWRtaW4iLCJpYXQiOjE3NDgzOTQ1MzYsImV4cCI6MTc0ODQzMDUzNn0.G1JspBdZccj2C6ErXS_do3KQJeixYnlexDsmvSGE55E";
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;

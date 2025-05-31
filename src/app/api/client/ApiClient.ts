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
    "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIwMTIxIiwiaWRVc2VyIjoxLCJpZFBlcnNvbmFsSW5mbyI6MSwicm9sZSI6IkFkbWluIiwicGVyc29uYWxQYXRoIjoiL2hvbWUvYWRtaW4iLCJpYXQiOjE3NDg3MDM4NTcsImV4cCI6MTc0ODczOTg1N30.1FM8czrAMovnS7DPqwCf_-yVeEydLtpNtErIn-uhIBY";
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;

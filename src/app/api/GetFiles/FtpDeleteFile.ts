import apiClient from "../client/ApiClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Función para eliminar un archivo
export const deleteFile = async (path: string) => {
  const response = await apiClient.delete("/delete/file", {
    data: { path },
  });
  return response.data;
};

// Hook para manejar la mutación de eliminación
export const useDeleteFileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (path: string) => deleteFile(path),
    onSuccess: () => {
      // Invalida y actualiza la caché de la carpeta actual
      queryClient.invalidateQueries({ queryKey: ["folderTree"] });
    },
    onError: (error) => {
      // Manejo de errores
      console.error("Error deleting file:", error);
    },
  });
};

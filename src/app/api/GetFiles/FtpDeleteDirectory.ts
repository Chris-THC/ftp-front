import apiClient from "../client/ApiClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Función para eliminar un archivo o carpeta
export const deleteDirectory = async (path: string) => {
  const response = await apiClient.delete("/ftp/delete/directory", {
    data: { path },
  });
  return response.data;
};

// Hook para manejar la mutación de eliminación
export const useDeleteDirectory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (path: string) => deleteDirectory(path),
    onSuccess: () => {
      // Invalida y actualiza la caché de la carpeta actual
      queryClient.invalidateQueries({ queryKey: ["folderTree"] });
    },
    onError: (error) => {
      // Manejo de errores
      console.error("Error deleting file or folder:", error);
    },
  });
};

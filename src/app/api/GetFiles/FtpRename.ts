import apiClient from "../client/ApiClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const renameFileOrFolder = async (oldPath: string, newPath: string) => {
  const response = await apiClient.put("/rename", {
    oldPath,
    newPath,
  });
  return response.data;
};

export const useRenameMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ oldPath, newPath }: { oldPath: string; newPath: string }) =>
      renameFileOrFolder(oldPath, newPath),
    onSuccess: () => {
      // Invalida y actualiza la caché de la carpeta actual
      queryClient.invalidateQueries({ queryKey: ["folderTree"] });
    },
    onError: (error) => {
      // Agregra un toast o un mensaje de error
      // Aquí puedes manejar el error, por ejemplo, mostrando un mensaje al usuario
      console.error("Error renaming file or folder:", error);
    },
  });
};

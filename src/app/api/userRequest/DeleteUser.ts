import apiClient from "../client/ApiClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Función para eliminar un usuario por su id
export const deleteUser = async (idUser: number) => {
  const response = await apiClient.delete(`/user/${idUser}`);
  return response.data;
};

// Hook para manejar la mutación de eliminación de usuario
export const useDeleteUserById = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (idUser: number) => deleteUser(idUser),
    onSuccess: () => {
      // Invalida y actualiza la caché relacionada con usuarios
      queryClient.invalidateQueries({ queryKey: ["usersInformation"] });
    },
    onError: (error) => {
      // Manejo de errores
      console.error("Error deleting user:", error);
    },
  });
};

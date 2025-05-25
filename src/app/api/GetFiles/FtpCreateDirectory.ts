import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../client/ApiClient";

export const createDirectory = async (path: string) => {
  const response = await apiClient.post("/create/directory", {
    path,
  });
  return response.data;
};

export const useCreateDirectory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (path: string) => createDirectory(path),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folderTree"] });
    },
    onError: (error) => {
      console.error("Error creating directory:", error);
    },
  });
};

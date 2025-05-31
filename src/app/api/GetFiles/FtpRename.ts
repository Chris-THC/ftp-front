import apiClient from "../client/ApiClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const renameFileOrFolder = async (oldPath: string, newPath: string) => {
  const response = await apiClient.put("/ftp/rename", {
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
      queryClient.invalidateQueries({ queryKey: ["folderTree"] });
    },
    onError: (error) => {
      console.error("Error renaming file or folder:", error);
    },
  });
};

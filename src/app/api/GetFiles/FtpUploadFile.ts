import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../client/ApiClient";

type UploadFileParams = {
  file: File;
  remotePath: string;
};

const uploadFile = async ({ file, remotePath }: UploadFileParams) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("remotePath", remotePath);

  const response = await apiClient.post("/ftp/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const useUploadFile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadFile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folderTree"] });
    },
    onError: (error) => {
      console.error("Error uploading file:", error);
    },
  });
};

import { useQuery } from "@tanstack/react-query";
import apiClient from "../client/ApiClient";

interface FolderTreeResponse {
  name: string;
  fullPath: string;
  timestamp: string;
  children: FolderTreeResponse[];
  directory: boolean;
  file: boolean;
}

const fetchFolderTree = async (path: string): Promise<FolderTreeResponse[]> => {
  const response = await apiClient.post<FolderTreeResponse[]>("/folder/tree", {
    path,
  });
  console.info("Response from folder tree:", response.data);
  return response.data;
};

export const useFolderTreeQuery = (path: string) => {
  return useQuery({
    queryKey: ["folderTree", path],
    queryFn: () => fetchFolderTree(path),
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 3, // Reintentar hasta 3 veces en caso de error
  });
};

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
  const response = await apiClient.post<FolderTreeResponse[]>("/ftp/folder/tree", {
    path,
  });
  return response.data;
};

export const useFolderTreeQuery = (path: string) => {
  return useQuery({
    queryKey: ["folderTree", path],
    queryFn: () => fetchFolderTree(path),
    staleTime: 1 * 60 * 1000, 
    retry: 3,
  });
};

import { useMutation } from "@tanstack/react-query";
import apiClient from "../client/ApiClient";

interface UpdatePasswordRequest {
  idUser: number;
  password: string;
}

interface UpdatePasswordResponse {
  status: string;
  message: string;
}

const updateUserPassword = async ({idUser, password}: UpdatePasswordRequest): Promise<UpdatePasswordResponse> => {
  const response = await apiClient.patch<UpdatePasswordResponse>(`/user/${idUser}`, {
    password,
  });
  return response.data;
};

export const useUpdateUserPasswordMutation = () => {
  return useMutation({
    mutationFn: updateUserPassword,
    onSuccess: (data) => {
      console.log("Password updated successfully:", data);
    },
    onError: (error) => {
      console.error("Error updating password:", error);
    },
  });
};
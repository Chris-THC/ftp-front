import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../client/ApiClient";

interface PersonalInfoForm {
  name: string;
  lastName: string;
  maternalLastName: string;
  personalPath: string;
}

interface UserForm {
  controlNumber: string;
  password: string;
  userRole: number;
}

interface RegisterUserPayload {
  personalInfoForm: PersonalInfoForm;
  userForm: UserForm;
}

export const registerUser = async (payload: RegisterUserPayload) => {
  const response = await apiClient.post("/user/register", payload);
  return response.data;
};

export const useRegisterUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RegisterUserPayload) => registerUser(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usersInformation"] });
    },
    onError: (error) => {
      console.error("Error registering user:", error);
    },
  });
};

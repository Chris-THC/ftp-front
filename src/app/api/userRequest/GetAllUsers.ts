import { useQuery } from "@tanstack/react-query";
import apiClient from "../client/ApiClient";

interface PersonalInfo {
  idPerInfo: number;
  name: string;
  lastName: string;
  maternalLastName: string;
  personalPath: string;
}

interface UserInformationResponse {
  idUser: number;
  numControl: string;
  userRole: string;
  idPersonalInfo: number;
  personalInfo: PersonalInfo[];
}

const fetchUserInformation = async (): Promise<UserInformationResponse[]> => {
  const response = await apiClient.get<UserInformationResponse[]>(
    "/user/information"
  );
  return response.data;
};

export const useGetAllUserInfo = () => {
  return useQuery({
    queryKey: ["usersInformation"],
    queryFn: fetchUserInformation,
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 3,
  });
};

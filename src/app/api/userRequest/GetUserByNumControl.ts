import { useQuery } from "@tanstack/react-query";
import apiClient from "../client/ApiClient";

interface PersonalInfo {
  idPerInfo: number;
  name: string;
  lastName: string;
  maternalLastName: string;
  personalPath: string;
}

interface ControlNumberResponse {
  idUser: number;
  numControl: string;
  userRole: string;
  idPersonalInfo: number;
  personalInfo: PersonalInfo[];
}

const fetchControlNumber = async (numControl: string): Promise<ControlNumberResponse> => {
  const response = await apiClient.get<ControlNumberResponse>(`/user/control/number/${numControl}`);
  return response.data;
};

export const useGetUserByControlNumber = (numControl: string) => {
  return useQuery({
    queryKey: ["controlNumber", numControl],
    queryFn: () => fetchControlNumber(numControl),
    staleTime: 5 * 60 * 1000,
    retry: 3,
  });
};
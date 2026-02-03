import { axiosInstance } from "../Utils/Axios";

interface LoginPayload {
  email: string;
  password: string;
}

interface LoggedInUser {
  id: string;
  name: string;
  email: string;
  role: string | null;
  permissions: string[];
} 

interface LoginResponse {
  status: string;
  token: string;
  user: LoggedInUser;
}

export const loginService = (data: LoginPayload) => {
  return axiosInstance.post<LoginResponse>("api/users/login", data);
};

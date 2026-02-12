import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "./Axios";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: any;
  isActive: boolean;
  is_deleted: boolean;
}

export interface UserPayload {
  name: string;
  email: string;
  password?: string;
  role: string;
}

const getUsers = async (): Promise<User[]> => {
  const res = await axiosInstance.get("/api/users/get");
  return res.data.data || [];
};

export const useGetUsers = () =>
  useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

const createUser = (data: UserPayload) =>
  axiosInstance.post("/api/users/create", data);

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

const updateUser = ({
  id,
  data,
}: {
  id: string;
  data: UserPayload;
}) => axiosInstance.put(`/api/users/update/${id}`, data);

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

const deleteUser = (id: string) =>
  axiosInstance.delete(`/api/users/delete/${id}`);

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

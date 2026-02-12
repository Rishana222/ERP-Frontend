import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../Utils/Axios";

export interface Role {
  _id: string;
  name: string;
  permissions: string[];
  is_deleted: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface RolePayload {
  name: string;
  permissions: string[];
}


const getRoles = async (): Promise<Role[]> => {
  const res = await axiosInstance.get("/api/roles/get");

  console.log("ROLE RESPONSE:", res.data);



  return res.data.data || [];
};

export const useGetRoles = () =>
  useQuery({
    queryKey: ["roles"],
    queryFn: getRoles,
  });


const createRole = (data: RolePayload) =>
  axiosInstance.post("/api/roles/create", data);

export const useCreateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
};



const updateRole = ({
  id,
  data,
}: {
  id: string;
  data: RolePayload;
}) => axiosInstance.put(`/api/roles/update/${id}`, data);

export const useUpdateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
};



const deleteRole = (id: string) =>
  axiosInstance.delete(`/api/roles/delete/${id}`);

export const useDeleteRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
};

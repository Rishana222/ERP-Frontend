import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../Utils/Axios";



export interface Permission {
  _id: string;
  name: string;
  is_deleted: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PermissionPayload {
  name: string;
}



const getPermissions = async (): Promise<Permission[]> => {
  const res = await axiosInstance.get("/api/permissions/get");
  return res.data; 
};

const createPermission = (data: PermissionPayload) =>
  axiosInstance.post("/api/permissions/create", data);

const updatePermission = ({
  id,
  name,
}: {
  id: string;
  name: string;
}) => axiosInstance.put(`/api/permissions/update/${id}`, { name });

const deletePermission = (id: string) =>
  axiosInstance.delete(`/api/permissions/delete/${id}`);



export const useGetPermissions = () =>
  useQuery({
    queryKey: ["permissions"],
    queryFn: getPermissions,
  });

export const useCreatePermission = () =>
  useMutation({
    mutationFn: createPermission,
  });

export const useUpdatePermission = () =>
  useMutation({
    mutationFn: updatePermission,
  });

export const useDeletePermission = () =>
  useMutation({
    mutationFn: deletePermission,
  });

import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../Utils/Axios";

/* ========= TYPES ========= */

export interface PermissionPayload {
  name: string;
}

export interface Permission {
  _id: string;
  name: string;
  is_deleted?: boolean;
}

/* ========= API ========= */

export const getPermissions = async (): Promise<Permission[]> => {
  const res = await axiosInstance.get("/api/permissions/get");
  return res.data.data; // ✅ array only
};

export const createPermission = (data: PermissionPayload) => {
  return axiosInstance.post("/api/permissions/create", data);
};

export const updatePermission = (id: string, data: PermissionPayload) => {
  return axiosInstance.put(`/api/permissions/update/${id}`, data);
};

export const deletePermission = (id: string) => {
  return axiosInstance.delete(`/api/permissions/delete/${id}`);
};

/* ========= REACT QUERY HOOKS ========= */

export const useGetPermissions = () =>
  useQuery<Permission[]>({
    queryKey: ["permissions"],
    queryFn: getPermissions,
  });

export const useCreatePermission = () =>
  useMutation({
    mutationKey: ["createPermission"],
    mutationFn: createPermission,
  });

export const useUpdatePermission = () =>
  useMutation({
    mutationKey: ["updatePermission"],
    mutationFn: ({ id, data }: { id: string; data: PermissionPayload }) =>
      updatePermission(id, data),
  });

export const useDeletePermission = () =>
  useMutation({
    mutationKey: ["deletePermission"],
    mutationFn: deletePermission,
  });

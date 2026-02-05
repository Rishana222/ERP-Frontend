import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../Utils/Axios";

/* ========= Types ========= */

export interface RolePayload {
  role_name: string;
  permission: string[];
}

export interface Role {
  _id: string;
  role_name: string;
  permission: { _id: string; name: string }[];
}

/* ========= API ========= */

export const createRole = (data: RolePayload) => {
  return axiosInstance.post("/api/roles/create", data);
};
export const getRoles = async () => {
  const res = await axiosInstance.get("/api/roles/get");
  return res.data.data; // ✅ ONLY ARRAY
};

export const updateRole = (id: string, payload: RolePayload) => {
  return axiosInstance.put(`/api/roles/update/${id}`, payload);
};

export const deleteRole = (id: string) => {
  return axiosInstance.delete(`/api/roles/delete/${id}`);
};

/* ========= Hooks ========= */

export const useCreateRole = () =>
  useMutation({
    mutationKey: ["createRole"],
    mutationFn: createRole,
  });

export const useUpdateRole = () =>
  useMutation({
    mutationKey: ["updateRole"],
    mutationFn: ({ id, data }: { id: string; data: RolePayload }) =>
      updateRole(id, data),
  });

export const useDeleteRole = () =>
  useMutation({
    mutationKey: ["deleteRole"],
    mutationFn: deleteRole,
  });

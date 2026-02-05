import { axiosInstance } from "../Utils/Axios";


export interface RolePayload {
  role_name: string;
  permission: string[];
}

export interface Permission {
  _id: string;
  name: string;
}

export interface Role {
  _id: string;
  role_name: string;
  permission: Permission[];
  is_deleted: boolean;
  status: boolean;
}

export interface RoleResponse {
  success: boolean;
  data: Role;
}

export interface RolesListResponse {
  success: boolean;
  data: Role[];
}


export const createRoleService = (data: RolePayload) => {
  return axiosInstance.post<RoleResponse>("api/roles/create", data);
};

export const getRolesService = () => {
  return axiosInstance.get<RolesListResponse>("api/roles/get");
};

export const getRoleByIdService = (id: string) => {
  return axiosInstance.get<RoleResponse>(`api/roles/get/${id}`);
};

export const updateRoleService = (
  id: string,
  data: RolePayload
) => {
  return axiosInstance.put<RoleResponse>(
    `api/roles/update/${id}`,
    data
  );
};


export const deleteRoleService = (id: string) => {
  return axiosInstance.delete<{ success: boolean; message: string }>(
    `api/roles/delete/${id}`
  );
};

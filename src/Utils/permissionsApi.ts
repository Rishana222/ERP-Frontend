import { axiosInstance } from "../Utils/Axios";

/* ========= Types ========= */
export interface Permission {
  _id: string;
  name: string;
  description?: string;
  createdAt?: string;
}

export interface PermissionPayload {
  name: string;
  description?: string;
}

/* ========= API Functions ========= */

// പെർമിഷനുകൾ ഫെച്ച് ചെയ്യാൻ
export const getPermissions = async (): Promise<Permission[]> => {
  const res = await axiosInstance.get("/api/permissions/get");
  return res.data.data;
};

// പുതിയ പെർമിഷൻ ഉണ്ടാക്കാൻ
export const createPermission = (data: PermissionPayload) =>
  axiosInstance.post("/api/permissions/create", data);

// പെർമിഷൻ അപ്‌ഡേറ്റ് ചെയ്യാൻ
export const updatePermission = (id: string, data: PermissionPayload) =>
  axiosInstance.put(`/api/permissions/update/${id}`, data);

// പെർമിഷൻ ഡിലീറ്റ് ചെയ്യാൻ
export const deletePermission = (id: string) =>
  axiosInstance.delete(`/api/permissions/delete/${id}`);

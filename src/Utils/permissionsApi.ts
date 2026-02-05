import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api/permissions";

// Helper: Get Auth Headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const getPermissions = async () => {
  const res = await axios.get(`${API_BASE_URL}/get`, getAuthHeaders());
  return Array.isArray(res.data) ? res.data : res.data?.data || [];
};

export const createPermission = async (data: { name: string }) => {
  return axios.post(`${API_BASE_URL}/create`, data, getAuthHeaders());
};

export const updatePermission = async (id: string, data: { name: string }) => {
  return axios.put(`${API_BASE_URL}/update/${id}`, data, getAuthHeaders());
};

export const deletePermission = async (id: string) => {
  return axios.delete(`${API_BASE_URL}/delete/${id}`, getAuthHeaders());
};

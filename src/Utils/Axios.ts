import type { AxiosInstance } from "axios";
import axios from "axios";
import Cookies from "js-cookie";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export const axiosInstance: AxiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, 
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token"); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; 
    }
    return config;
  },
  (error) => Promise.reject(error)
);


axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
   if (error.response?.status === 401) {
      console.error("Unauthorized! Logging out...");
      Cookies.remove("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

import type { AxiosInstance } from "axios";
import axios from "axios";

const baseURL = "http://localhost:3000";

export const axiosInstance: AxiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});
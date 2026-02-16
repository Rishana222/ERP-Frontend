import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../Utils/Axios";



export interface Vendor {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  gstNumber?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface VendorPayload {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  gstNumber?: string;
}


const getVendors = async (): Promise<Vendor[]> => {
  const res = await axiosInstance.get("/api/vendors/get");
  return res.data.data; 
};


const getVendorById = async (id: string): Promise<Vendor> => {
  const res = await axiosInstance.get(`/api/vendors/get/${id}`);
  return res.data;
};


const createVendor = (data: VendorPayload) =>
  axiosInstance.post("/api/vendors/create", data);


const updateVendor = ({ id, data }: { id: string; data: VendorPayload }) =>
  axiosInstance.put(`/api/vendors/update/${id}`, data);


const deleteVendor = (id: string) =>
  axiosInstance.delete(`/api/vendors/delete/${id}`);



export const useGetVendors = () =>
  useQuery({
    queryKey: ["vendors"],
    queryFn: getVendors,
  });

export const useGetVendorById = (id: string) =>
  useQuery({
    queryKey: ["vendor", id],
    queryFn: () => getVendorById(id),
    enabled: !!id,
  });

export const useCreateVendor = () =>
  useMutation({
    mutationFn: createVendor,
  });

export const useUpdateVendor = () =>
  useMutation({
    mutationFn: updateVendor,
  });

export const useDeleteVendor = () =>
  useMutation({
    mutationFn: deleteVendor,
  });

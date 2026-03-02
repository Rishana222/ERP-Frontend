import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../Utils/Axios";



export interface Customer {
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

export interface CustomerPayload {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  gstNumber?: string;
  isActive?: boolean;
}



const getCustomers = async (): Promise<Customer[]> => {
  const res = await axiosInstance.get("/api/customers/get");
  return res.data.data || []; 
};


const getCustomerById = async (id: string): Promise<Customer> => {
  const res = await axiosInstance.get(`/api/customers/get/${id}`);
  return res.data.data;   
};

const createCustomer = (data: CustomerPayload) =>
  axiosInstance.post("/api/customers/create", data);


const updateCustomer = ({ id, data }: { id: string; data: CustomerPayload }) =>
  axiosInstance.put(`/api/customers/update/${id}`, data);


const deleteCustomer = (id: string) =>
  axiosInstance.delete(`/api/customers/delete/${id}`);



export const useGetCustomers = () =>
  useQuery({
    queryKey: ["customers"],
    queryFn: getCustomers,
  });

export const useGetCustomerById = (id: string) =>
  useQuery({
    queryKey: ["customer", id],
    queryFn: () => getCustomerById(id),
    enabled: !!id,
  });

export const useCreateCustomer = () =>
  useMutation({
    mutationFn: createCustomer,
  });

export const useUpdateCustomer = () =>
  useMutation({
    mutationFn: updateCustomer,
  });

export const useDeleteCustomer = () =>
  useMutation({
    mutationFn: deleteCustomer,
  });

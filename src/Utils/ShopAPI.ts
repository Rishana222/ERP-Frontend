import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../Utils/Axios";


export interface Shop {
  _id: string;
  name: string;
  phone: string;
  address?: string;
  isDeleted: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ShopPayload {
  name: string;
  phone: string;
  address?: string;
}


const getShops = async (): Promise<Shop[]> => {
  const res = await axiosInstance.get("/api/shops/get");
  return res.data;
};

const createShop = (data: ShopPayload) =>
  axiosInstance.post("/api/shops/create", data);

const updateShop = ({
  id,
  data,
}: {
  id: string;
  data: ShopPayload;
}) => axiosInstance.put(`/api/shops/update/${id}`, data);

const deleteShop = (id: string) =>
  axiosInstance.delete(`/api/shops/delete/${id}`);


export const useGetShops = () =>
  useQuery({
    queryKey: ["shops"],
    queryFn: getShops,
  });

export const useCreateShop = () =>
  useMutation({
    mutationFn: createShop,
  });

export const useUpdateShop = () =>
  useMutation({
    mutationFn: updateShop,
  });

export const useDeleteShop = () =>
  useMutation({
    mutationFn: deleteShop,
  });

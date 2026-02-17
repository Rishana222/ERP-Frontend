// src/Utils/purchaseAPI.ts

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../Utils/Axios";

/* ================= TYPES ================= */

export interface PurchaseItem {
  product: string;
  quantity: number;
  costPrice: number;
  sellingPrice: number;
  total: number;
}

export interface Purchase {
  _id: string;
  vendor: {
    _id: string;
    name: string;
  };
  items: {
    product: {
      _id: string;
      name: string;
    };
    quantity: number;
    costPrice: number;
    sellingPrice: number;
    total: number;
  }[];
  grandTotal: number;
}

export interface PurchasePayload {
  vendor: string;
  items: PurchaseItem[];
  grandTotal: number;
}

/* ================= API CALLS ================= */

const getPurchases = async (): Promise<Purchase[]> => {
  const res = await axiosInstance.get("/api/purchases/get");
  return res.data.data; // 👈 IMPORTANT
};
const createPurchase = (data: PurchasePayload) =>
  axiosInstance.post("/api/purchases/create", data);

const updatePurchase = ({ id, data }: { id: string; data: PurchasePayload }) =>
  axiosInstance.put(`/api/purchases/update/${id}`, data);

const deletePurchase = (id: string) =>
  axiosInstance.delete(`/api/purchases/delete/${id}`);

/* ================= HOOKS ================= */

export const useGetPurchases = () =>
  useQuery({
    queryKey: ["purchases"],
    queryFn: getPurchases,
  });

export const useCreatePurchase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPurchase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchases"] });
    },
  });
};

export const useUpdatePurchase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePurchase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchases"] });
    },
  });
};

export const useDeletePurchase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePurchase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchases"] });
    },
  });
};

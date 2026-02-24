import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "./Axios";

/* ===================== TYPES ===================== */

export interface SaleItem {
  product: string; // Product _id
  unit: string;    // Unit _id
  quantity: number;
  sellingPrice: number;
  total: number;
}

export interface Sale {
  _id: string;
  customer: string; // Customer _id
  items: SaleItem[];
  grandTotal: number;
  createdAt: string;
  updatedAt: string;
}

export interface SalePayload {
  customer: string;
  items: SaleItem[];
  grandTotal: number;
}

/* ===================== GET ALL SALES ===================== */

const getSales = async (): Promise<Sale[]> => {
  const res = await axiosInstance.get("/api/sales/get");
  return res.data.data || [];
};

export const useGetSales = () =>
  useQuery({
    queryKey: ["sales"],
    queryFn: getSales,
  });

/* ===================== GET SINGLE SALE ===================== */

const getSaleById = async (id: string): Promise<Sale> => {
  const res = await axiosInstance.get(`/api/sales/get/${id}`);
  return res.data.data;
};

export const useGetSale = (id: string) =>
  useQuery({
    queryKey: ["sale", id],
    queryFn: () => getSaleById(id),
    enabled: !!id,
  });

/* ===================== CREATE SALE ===================== */

const createSale = (data: SalePayload) =>
  axiosInstance.post("/api/sales/create", data);

export const useCreateSale = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSale,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
    },
  });
};

/* ===================== UPDATE SALE ===================== */

const updateSale = ({ id, data }: { id: string; data: SalePayload }) =>
  axiosInstance.put(`/api/sales/update/${id}`, data);

export const useUpdateSale = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateSale,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
    },
  });
};

/* ===================== DELETE SALE ===================== */

const deleteSale = (id: string) =>
  axiosInstance.delete(`/api/sales/delete/${id}`);

export const useDeleteSale = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSale,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
    },
  });
};
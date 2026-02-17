import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../Utils/Axios";

/* ================================
   Interfaces
================================ */

export type StockHistoryType =
  | "PURCHASE"
  | "PURCHASE_CANCEL"
  | "SALE"
  | "SALE_CANCEL"
  | "ADJUSTMENT";

export interface StockHistory {
  _id: string;
  product: {
    _id: string;
    name: string;
  };
  type: StockHistoryType;
  quantity: number;
  balance: number;
  referenceId?: string;
  note?: string;
  createdAt?: string;
}

/* ================================
   API Functions
================================ */

// 🔹 Get All
const getAllStockHistory = async (): Promise<StockHistory[]> => {
  const res = await axiosInstance.get("/api/stock-history/get");
  return res.data.data;   // ✅ important fix
};

// 🔹 Get By Product
const getStockHistoryByProduct = async (
  productId: string,
): Promise<StockHistory[]> => {
  const res = await axiosInstance.get(
    `/api/stock-history/product/${productId}`,
  );
  return res.data.data;   // ✅ important fix
};


/* ================================
   React Query Hooks
================================ */

export const useGetAllStockHistory = () =>
  useQuery({
    queryKey: ["stock-history"],
    queryFn: getAllStockHistory,
  });

export const useGetStockHistoryByProduct = (productId: string) =>
  useQuery({
    queryKey: ["stock-history", productId],
    queryFn: () => getStockHistoryByProduct(productId),
    enabled: !!productId,
  });

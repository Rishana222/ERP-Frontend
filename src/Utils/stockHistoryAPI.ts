import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../Utils/Axios";



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




const getAllStockHistory = async (): Promise<StockHistory[]> => {
  const res = await axiosInstance.get("/api/stock-history/get");
  return res.data.data;   
};


const getStockHistoryByProduct = async (
  productId: string,
): Promise<StockHistory[]> => {
  const res = await axiosInstance.get(
    `/api/stock-history/product/${productId}`,
  );
  return res.data.data;   
};



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

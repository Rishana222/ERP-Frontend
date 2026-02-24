import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "./Axios";



export interface SaleReturnItem {
  product: string; 
  quantity: number;
  sellingPrice: number;
  total: number;
}

export interface SaleReturn {
  _id: string;
  sale: string; 
  customer: string; 
  items: SaleReturnItem[];
  grandTotal: number;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SaleReturnPayload {
  sale: string;
  customer: string;
  items: SaleReturnItem[];
  grandTotal: number;
  note?: string;
}


const getSaleReturns = async (): Promise<SaleReturn[]> => {
  const res = await axiosInstance.get("/api/sales-return/get");
  return res.data.data || [];
};

export const useGetSaleReturns = () =>
  useQuery({
    queryKey: ["saleReturns"],
    queryFn: getSaleReturns,
  });



const getSaleReturnById = async (id: string): Promise<SaleReturn> => {
  const res = await axiosInstance.get(`/api/sales-return/get/${id}`);
  return res.data.data;
};

export const useGetSaleReturn = (id: string) =>
  useQuery({
    queryKey: ["saleReturn", id],
    queryFn: () => getSaleReturnById(id),
    enabled: !!id,
  });



const createSaleReturn = (data: SaleReturnPayload) =>
  axiosInstance.post("/api/sales-return/create", data);

export const useCreateSaleReturn = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSaleReturn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saleReturns"] });
      queryClient.invalidateQueries({ queryKey: ["sales"] }); 
    },
  });
};

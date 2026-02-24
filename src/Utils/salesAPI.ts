import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "./Axios";



export interface SaleItem {
  product: string; 
  unit: string;    
  quantity: number;
  sellingPrice: number;
  total: number;
}

export interface Sale {
  _id: string;
  customer: string; 
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


const getSales = async (): Promise<Sale[]> => {
  const res = await axiosInstance.get("/api/sales/get");
  return res.data.data || [];
};

export const useGetSales = () =>
  useQuery({
    queryKey: ["sales"],
    queryFn: getSales,
  });



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
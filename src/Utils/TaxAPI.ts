import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "./Axios";

export interface Tax {
  _id: string;
  name: string;
  percentage: number;
  is_deleted: boolean;
}

export interface TaxPayload {
  name: string;
  percentage: number;
}


const getTaxes = async (): Promise<Tax[]> => {
  const res = await axiosInstance.get("/api/taxes/get");
  return res.data.data || [];
};

export const useGetTaxes = () =>
  useQuery({
    queryKey: ["taxes"],
    queryFn: getTaxes,
  });


const createTax = (data: TaxPayload) =>
  axiosInstance.post("/api/taxes/create", data);

export const useCreateTax = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTax,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["taxes"] });
    },
  });
};


const updateTax = ({ id, data }: { id: string; data: TaxPayload }) =>
  axiosInstance.put(`/api/taxes/update/${id}`, data);

export const useUpdateTax = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateTax,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["taxes"] });
    },
  });
};


const deleteTax = (id: string) =>
  axiosInstance.delete(`/api/taxes/delete/${id}`);

export const useDeleteTax = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTax,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["taxes"] });
    },
  });
};

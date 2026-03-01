import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "./Axios";

export interface TransactionEntry {
  account: string;
  accountId: string;
  debit: number;
  credit: number;
}

export interface Transaction {
  _id: string;
  date: string;
  description: string;
  referenceType: string;
  referenceId?: string;
  entries: TransactionEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface TransactionPayload {
  description: string;
  referenceType: string;
  referenceId?: string;
  entries: TransactionEntry[];
}

const getTransactions = async (): Promise<Transaction[]> => {
  const res = await axiosInstance.get("/api/transactions");
  return res.data.data || [];
};

export const useGetTransactions = () =>
  useQuery({
    queryKey: ["transactions"],
    queryFn: getTransactions,
  });


  const getTransactionById = async (id: string): Promise<Transaction> => {
  const res = await axiosInstance.get(`/api/transactions/${id}`);
  return res.data.data;
};

export const useGetTransactionById = (id: string) =>
  useQuery({
    queryKey: ["transactions", id],
    queryFn: () => getTransactionById(id),
    enabled: !!id, 
  });

const createTransaction = (data: TransactionPayload) =>
  axiosInstance.post("/api/transactions", data);

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTransaction,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["transactions"] }),
  });
};
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "./Axios";


export interface Account {
  _id: string;
  name: string;
  type: "Cash" | "Bank" | "UPI";
  balance: number;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AccountPayload {
  name: string;
  type: "Cash" | "Bank" | "UPI";
  balance?: number;
  description?: string;
}


const getAccounts = async (): Promise<Account[]> => {
  const res = await axiosInstance.get("/api/accounts/get");
  return res.data || [];
};

export const useGetAccounts = () =>
  useQuery({
    queryKey: ["accounts"],
    queryFn: getAccounts,
  });

const createAccount = (data: AccountPayload) =>
  axiosInstance.post("/api/accounts/create", data);

export const useCreateAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAccount,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["accounts"] }),
  });
};


const updateAccount = ({ id, data }: { id: string; data: AccountPayload }) =>
  axiosInstance.put(`/api/accounts/update/${id}`, data);

export const useUpdateAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAccount,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["accounts"] }),
  });
};

const deactivateAccount = (id: string) =>
  axiosInstance.delete(`/api/accounts/delete/${id}`);

export const useDeactivateAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deactivateAccount,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["accounts"] }),
  });
};

const getAccountById = async (id: string): Promise<Account> => {
  const res = await axiosInstance.get(`/api/accounts/get/${id}`);
  return res.data;
};

export const useGetAccountById = (id: string) =>
  useQuery({
    queryKey: ["account", id],
    queryFn: () => getAccountById(id),
    enabled: !!id, 
  });

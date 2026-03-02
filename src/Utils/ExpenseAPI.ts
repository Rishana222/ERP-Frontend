import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "./Axios";


export interface Expense {
  _id: string;
  category: { _id: string; name: string };
  account: { _id: string; name: string; balance: number };
  vendor?: { _id: string; name: string };
  amount: number;
  paymentMethod: "Cash" | "Bank" | "UPI";
  note?: string;
  date: string;
}

export interface ExpensePayload {
  category: string;
  account: string;
  vendor?: string;
  amount: number;
  paymentMethod: "Cash" | "Bank" | "UPI";
  note?: string;
  date?: string;
}


const getExpenses = async (): Promise<Expense[]> => {
  const res = await axiosInstance.get("/api/expenses/get");
  return res.data || [];
};

export const useGetExpenses = () =>
  useQuery({
    queryKey: ["expenses"],
    queryFn: getExpenses,
  });


const createExpense = (data: ExpensePayload) =>
  axiosInstance.post("/api/expenses/create", data);

export const useCreateExpense = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createExpense,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["expenses"] }),
  });
};

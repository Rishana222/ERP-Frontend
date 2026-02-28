// Utils/customerAccountApi.ts
import { axiosInstance } from "./Axios";
import { useMutation, useQuery } from "@tanstack/react-query";

/* ================= TYPES ================= */
export interface CustomerAccountPayload {
  customer: string; // customerId
  totalSalesAmount?: number;
  totalReceivedAmount?: number;
}

export interface CustomerAccount {
  _id: string;
  customer: string;
  totalSalesAmount: number;
  totalReceivedAmount: number;
  balance: number;
}

/* ================= CREATE ACCOUNT ================= */
const createCustomerAccount = async (payload: CustomerAccountPayload) => {
  const { data } = await axiosInstance.post(
    "/api/customer-account/create",
    payload,
  );
  return data;
};

export const useCreateCustomerAccount = () => {
  return useMutation({
    mutationFn: createCustomerAccount,
  });
};

/* ================= GET ACCOUNT ================= */
const getCustomerAccount = async (customerId: string) => {
  if (!customerId) throw new Error("Customer ID is required");
  const { data } = await axiosInstance.get(
    `/api/customer-account/${customerId}`,
  );
  // Some APIs return { data: { ... } }, make sure we return account object
  return data.data || data;
};

export const useGetCustomerAccount = (customerId?: string) =>
  useQuery<CustomerAccount, Error>({
    queryKey: ["customer-account", customerId],
    queryFn: () => getCustomerAccount(customerId!),
    enabled: !!customerId,
    staleTime: 1000 * 60 * 2, // 2 minutes caching
  });

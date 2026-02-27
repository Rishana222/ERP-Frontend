// Utils/customerPaymentApi.ts
import { axiosInstance } from "../Utils/Axios";
import { useMutation, useQuery } from "@tanstack/react-query";

/* ================= TYPES ================= */

export interface CustomerPayment {
  _id: string;
  customer: string;
  amount: number;
  paymentDate: string;
  paymentMode: string;
  note?: string;
}

export interface CustomerPaymentPayload {
  customer: string;
  amount: number;
  paymentDate?: string;
  paymentMode: string;
  note?: string;
}

/* ================= API CALLS ================= */

// POST
export const createCustomerPayment = (data: CustomerPaymentPayload) =>
  axiosInstance.post("/api/customer-payment/create", data);

// GET (customer-wise)
export const getCustomerPayments = async (
  customerId: string,
): Promise<CustomerPayment[]> => {
  const res = await axiosInstance.get(
    `/customer-payment/list?customer=${customerId}`,
  );
  return res.data.data; // ✅ always return array
};

/* ================= HOOKS ================= */

export const useCreateCustomerPayment = () =>
  useMutation<CustomerPayment, Error, CustomerPaymentPayload>({
    mutationFn: (data) =>
      createCustomerPayment(data).then((res) => res.data.data),
  });

export const useGetCustomerPayments = (customerId: string) =>
  useQuery<CustomerPayment[]>({
    queryKey: ["customerPayments", customerId],
    queryFn: () => getCustomerPayments(customerId),
    enabled: !!customerId,
  });


import { axiosInstance } from "./Axios";
import { useMutation, useQuery } from "@tanstack/react-query";

export interface CustomerPayment {
  _id: string;
  invoice: { _id: string; invoiceNumber: string };
  amount: number;
  paymentDate: string;
  paymentMode: string;
  note?: string;
}

export interface CustomerPaymentPayload {
  customer: string;
  invoice: string;
  amount: number;
  paymentDate: string;
  paymentMode: string;
  note?: string;
}

export const createCustomerPayment = (data: CustomerPaymentPayload) =>
  axiosInstance.post("/api/customer-payment/create", data);

export const getCustomerPayments = async (customerId: string) => {
  const res = await axiosInstance.get(
    `/api/customer-payment/${customerId}`
  );
  return res.data.data;
};

export const useCreateCustomerPayment = () =>
  useMutation({
    mutationFn: createCustomerPayment,
  });

export const useGetCustomerPayments = (customerId: string) =>
  useQuery({
    queryKey: ["customerPayments", customerId],
    queryFn: () => getCustomerPayments(customerId),
    enabled: !!customerId,
  });
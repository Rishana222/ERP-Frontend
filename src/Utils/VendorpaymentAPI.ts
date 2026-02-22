// VendorpaymentAPI.ts
import { axiosInstance } from "../Utils/Axios";
import { useMutation, useQuery } from "@tanstack/react-query";

export interface VendorPayment {
  _id: string;
  vendor: string;
  amount: number;
  paymentDate: string;
  paymentMode: string;
  note?: string;
}

export interface VendorPaymentPayload {
  vendor: string;
  amount: number;
  paymentDate: string;
  paymentMode: string;
  note?: string;
}

// POST
export const createVendorPayment = (data: VendorPaymentPayload) =>
  axiosInstance.post("/vendor-payment", data);

// GET
export const getVendorPayments = async (vendorId: string): Promise<VendorPayment[]> => {
  const res = await axiosInstance.get(`/vendor-payment/${vendorId}`);
  return res.data.data; // <--- return array directly
};

// Hooks
export const useCreateVendorPayment = () =>
  useMutation<VendorPayment, Error, VendorPaymentPayload>({
    mutationFn: (data) => createVendorPayment(data).then((res) => res.data.data),
  });

export const useGetVendorPayments = (vendorId: string) =>
  useQuery<VendorPayment[]>({
    queryKey: ["vendorPayments", vendorId],
    queryFn: () => getVendorPayments(vendorId),
    enabled: !!vendorId,
  });
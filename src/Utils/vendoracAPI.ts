import { axiosInstance } from "./Axios";
import { useQuery } from "@tanstack/react-query";

export interface LedgerRow {
  date: string;
  type: "PURCHASE" | "PAYMENT";
  debit: number;
  credit: number;
  balance: number;
}

export interface VendorLedgerResponse {
  totalPurchaseAmount: number;
  totalPaidAmount: number;
  balance: number;
  ledger: LedgerRow[];
}

// GET Vendor Ledger
const getVendorLedger = async (
  vendorId: string,
): Promise<VendorLedgerResponse> => {
  const res = await axiosInstance.get(`/api/vendor-ac/${vendorId}`);
  return res.data.data;
};

export const useGetVendorLedger = (vendorId: string) =>
  useQuery<VendorLedgerResponse>({
    queryKey: ["vendorLedger", vendorId],
    queryFn: () => getVendorLedger(vendorId),
    enabled: !!vendorId,
  });

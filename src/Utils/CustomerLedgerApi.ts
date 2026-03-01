import { axiosInstance } from "./Axios";
import { useQuery } from "@tanstack/react-query";

export interface LedgerRow {
  date?: string;
  type: "SALE" | "PAYMENT";
  debit: number;
  credit: number;
  balance: number;
}

export interface CustomerLedgerResponse {
  totalSalesAmount: number;
  totalReceivedAmount: number;
  balance: number;
  ledger: LedgerRow[];
}


const getCustomerLedger = async (
  customerId: string,
): Promise<CustomerLedgerResponse> => {
  const res = await axiosInstance.get(`/api/ledger/get/${customerId}`);

  const ledgerArray: LedgerRow[] = res.data.data;

  return {
    ledger: ledgerArray,
    totalSalesAmount: ledgerArray.reduce((sum, row) => sum + row.debit, 0),
    totalReceivedAmount: ledgerArray.reduce((sum, row) => sum + row.credit, 0),
    balance: ledgerArray.length > 0 ? ledgerArray[ledgerArray.length - 1].balance : 0,
  };
};

export const useGetCustomerLedger = (customerId: string) =>
  useQuery<CustomerLedgerResponse>({
    queryKey: ["customerLedger", customerId],
    queryFn: () => getCustomerLedger(customerId),
    enabled: !!customerId,
  });
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../Utils/Axios";

/* ================= TYPES ================= */

export interface PurchaseReturnItem {
  product: {
    _id: string;
    name: string;
  };
  quantity: number;
  costPrice: number;
  total?: number;
}

export interface PurchaseReturn {
  _id: string;
  purchase: string;
  vendor: {
    _id: string;
    name: string;
  };
  items: PurchaseReturnItem[];
  grandTotal: number;
  note?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PurchaseReturnPayload {
  purchase: string;
  vendor: string;
  items: {
    product: string;
    quantity: number;
    costPrice: number;
  }[];
  grandTotal: number;
  note?: string;
}

/* ================= API FUNCTIONS ================= */

// Get All Purchase Returns
const getPurchaseReturns = async (): Promise<PurchaseReturn[]> => {
  const res = await axiosInstance.get("/api/purchase-return/get");

  // 🔥 IMPORTANT FIX
  // If backend returns { success: true, data: [...] }
  return res.data.data || [];
};

// Get Single Purchase Return
const getPurchaseReturnById = async (id: string): Promise<PurchaseReturn> => {
  const res = await axiosInstance.get(`/api/purchase-return/get/${id}`);

  return res.data.data;
};

// Create Purchase Return
const createPurchaseReturn = async (data: PurchaseReturnPayload) => {
  const res = await axiosInstance.post("/api/purchase-return/create", data);

  return res.data;
};

/* ================= REACT QUERY HOOKS ================= */

// Get All
export const useGetPurchaseReturns = () =>
  useQuery({
    queryKey: ["purchase-returns"],
    queryFn: getPurchaseReturns,
  });

// Get Single
export const useGetPurchaseReturnById = (id: string) =>
  useQuery({
    queryKey: ["purchase-return", id],
    queryFn: () => getPurchaseReturnById(id),
    enabled: !!id,
  });

// Create
export const useCreatePurchaseReturn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPurchaseReturn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["purchase-returns"],
      });
    },
  });
};

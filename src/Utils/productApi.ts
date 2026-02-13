import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "./Axios";

/* ================= TYPES ================= */

export interface Product {
  _id: string;
  name: string;
  price: number;
  category: { _id: string; name: string };
  subCategory?: { _id: string; name: string };
  unit?: { _id: string; name: string };
  tax?: { _id: string; name: string };
  isDeleted: boolean;
}

export interface ProductPayload {
  name: string;
  category: string;
  subCategory?: string;
  unit?: string;
  tax?: string;
  price: number;
}

/* ================= GET ================= */

const getProducts = async (): Promise<Product[]> => {
  const res = await axiosInstance.get("/api/products/get");
  return res.data.data || [];
};

export const useGetProducts = () =>
  useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

/* ================= CREATE ================= */

const createProduct = (data: ProductPayload) =>
  axiosInstance.post("/api/products/create", data);

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

/* ================= UPDATE ================= */

const updateProduct = ({ id, data }: { id: string; data: ProductPayload }) =>
  axiosInstance.put(`/api/products/update/${id}`, data);

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

/* ================= DELETE ================= */

const deleteProduct = (id: string) =>
  axiosInstance.delete(`/api/products/delete/${id}`);

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

import { useQuery, useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../Utils/Axios";

/* ================= TYPES ================= */

export interface Product {
  _id: string;
  name: string;
  sku: string;
  shop: string;
  category: string;
  subCategory?: string;
  unit: string;
  purchasePrice: number;
  sellingPrice: number;
  taxPercent?: number;
  stock?: number;
  isActive: boolean;
  image?: string;
}

/* ================= PRODUCT APIs ================= */

export const createProduct = (data: any) => {
  return axiosInstance
    .post("/api/products/createproduct", data)
    .then((res) => res.data);
};

export const getProducts = (shopId?: string) => {
  const query = shopId ? `?shop=${shopId}` : "";
  return axiosInstance
    .get(`/api/products/getproducts${query}`)
    .then((res) => res.data);
};

export const getProductById = (id: string) => {
  return axiosInstance
    .get(`/api/products/getproduct/${id}`)
    .then((res) => res.data);
};

export const updateProduct = (id: string, payload: any) => {
  return axiosInstance
    .put(`/api/products/updateproduct/${id}`, payload)
    .then((res) => res.data);
};

export const deleteProduct = (id: string) => {
  return axiosInstance
    .delete(`/api/products/deleteproduct/${id}`)
    .then((res) => res.data);
};



export const useCreateProduct = () =>
  useMutation({
    mutationKey: ["createProduct"],
    mutationFn: createProduct,
  });

export const useUpdateProduct = () =>
  useMutation<any, Error, { id: string; data: any }>({
    mutationKey: ["updateProduct"],
    mutationFn: ({ id, data }) => updateProduct(id, data),
  });

export const useDeleteProduct = () =>
  useMutation<void, Error, string>({
    mutationKey: ["deleteProduct"],
    mutationFn: deleteProduct,
  });

export const useGetProducts = (shopId?: string) =>
  useQuery<{ data: Product[]; message: string }, Error>({
    queryKey: ["products", shopId],
    queryFn: () => getProducts(shopId),
    staleTime: 5000,
  });

export const useGetProductById = (id: string) =>
  useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
    enabled: !!id,
  });

/* ================= SHOP / CATEGORY / UNIT ================= */

export const getShops = () =>
  axiosInstance.get("/api/shops/getshops").then((res) => res.data);

export const getCategories = () =>
  axiosInstance.get("/api/categories/getcategories").then((res) => res.data);

export const getUnits = () =>
  axiosInstance.get("/api/units/getunits").then((res) => res.data);

/* ================= DROPDOWN HOOKS ================= */

export const useGetShops = () =>
  useQuery({
    queryKey: ["shops"],
    queryFn: getShops,
    staleTime: 10000,
  });

export const useGetCategories = () =>
  useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: 10000,
  });

export const useGetUnits = () =>
  useQuery({
    queryKey: ["units"],
    queryFn: getUnits,
    staleTime: 10000,
  });

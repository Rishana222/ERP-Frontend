import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "./Axios";

/* ================= TYPES ================= */

export interface Variant {
  _id: string;
  name: string;
  product: { _id: string; name: string }; // populated product
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface VariantPayload {
  name: string;
  product: string; // Product ID
}

/* ================= GET ================= */

const getVariants = async (): Promise<Variant[]> => {
  const res = await axiosInstance.get("/api/variant/get");
  return res.data.data || [];
};

export const useGetVariants = () =>
  useQuery({
    queryKey: ["variants"],
    queryFn: getVariants,
  });

/* ================= GET BY ID ================= */

const getVariantById = async (id: string): Promise<Variant> => {
  const res = await axiosInstance.get(`/api/variant/get/${id}`);
  return res.data.data;
};

export const useGetVariantById = (id: string) =>
  useQuery({
    queryKey: ["variant", id],
    queryFn: () => getVariantById(id),
    enabled: !!id,
  });

/* ================= CREATE ================= */

const createVariant = (data: VariantPayload) =>
  axiosInstance.post("/api/variant/create", data);

export const useCreateVariant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createVariant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["variants"] });
    },
  });
};

/* ================= UPDATE ================= */

const updateVariant = ({ id, data }: { id: string; data: VariantPayload }) =>
  axiosInstance.put(`/api/variant/update/${id}`, data);

export const useUpdateVariant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateVariant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["variants"] });
    },
  });
};

/* ================= DELETE ================= */

const deleteVariant = (id: string) =>
  axiosInstance.delete(`/api/variant/delete/${id}`);

export const useDeleteVariant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteVariant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["variants"] });
    },
  });
};

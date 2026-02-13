import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "./Axios"; 

export interface Category {
  _id: string;
  name: string;
}

export interface SubCategory {
  _id: string;
  name: string;
  description?: string;
  category: Category;
  is_deleted: boolean;
}

export interface SubCategoryPayload {
  name: string;
  description?: string;
  category: string; 
}


const getSubCategories = async (): Promise<SubCategory[]> => {
  const res = await axiosInstance.get("/api/subcategories/get");
  return res.data.data || [];
};

export const useGetSubCategories = () =>
  useQuery({
    queryKey: ["subcategories"],
    queryFn: getSubCategories,
  });

const createSubCategory = (data: SubCategoryPayload) =>
  axiosInstance.post("/api/subcategories/create", data);

export const useCreateSubCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSubCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subcategories"] });
    },
  });
};

const updateSubCategory = ({ id, data }: { id: string; data: SubCategoryPayload }) =>
  axiosInstance.put(`/api/subcategories/update/${id}`, data);

export const useUpdateSubCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateSubCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subcategories"] });
    },
  });
};


const deleteSubCategory = (id: string) =>
  axiosInstance.delete(`/api/subcategories/delete/${id}`);

export const useDeleteSubCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSubCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subcategories"] });
    },
  });
};


const getCategories = async (): Promise<Category[]> => {
  const res = await axiosInstance.get("/api/categories/get");
  return res.data.data || [];
};

export const useGetCategories = () =>
  useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

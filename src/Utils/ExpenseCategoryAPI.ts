import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "./Axios"; 


export interface Category {
  _id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryPayload {
  name: string;
  description?: string;
}


const getCategories = async (): Promise<Category[]> => {
  const res = await axiosInstance.get("/api/expense-categories/get");
  return res.data || [];
};

export const useGetCategories = () =>
  useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });


const createCategory = (data: CategoryPayload) =>
  axiosInstance.post("/api/expense-categories/create", data);

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCategory,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["categories"] }),
  });
};

const updateCategory = ({ id, data }: { id: string; data: CategoryPayload }) =>
  axiosInstance.put(`/api/expense-categories/update/${id}`, data);

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCategory,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["categories"] }),
  });
};


const deleteCategory = (id: string) =>
  axiosInstance.delete(`/api/expense-categories/delete/${id}`);

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["categories"] }),
  });
};

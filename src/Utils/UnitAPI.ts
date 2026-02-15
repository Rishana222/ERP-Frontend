import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "./Axios";

export interface Unit {
  _id: string;
  name: string;
  shortName?: string;
  baseUnit?: string;
  baseValue?: number;
  is_deleted: boolean;
}

export interface UnitPayload {
  name: string;
  shortName?: string;
  baseUnit?: string;
  baseValue?: number;
}


const getUnits = async (): Promise<Unit[]> => {
  const res = await axiosInstance.get("/api/units/get");
  return res.data.data;
};

export const useGetUnits = () =>
  useQuery({
    queryKey: ["units"],
    queryFn: getUnits,
  });


const createUnit = (data: UnitPayload) =>
  axiosInstance.post("/api/units/create", data);

export const useCreateUnit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createUnit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["units"] });
    },
  });
};


const updateUnit = ({ id, data }: { id: string; data: UnitPayload }) =>
  axiosInstance.put(`/api/units/update/${id}`, data);

export const useUpdateUnit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateUnit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["units"] });
    },
  });
};


const deleteUnit = (id: string) =>
  axiosInstance.delete(`/api/units/delete/${id}`);

export const useDeleteUnit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteUnit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["units"] });
    },
  });
};

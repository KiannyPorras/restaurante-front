import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ClienteDto } from "@/modules/clientes/models/Cliente";
import {
  createCliente,
  deleteCliente,
  getClientes,
  updateCliente,
} from "@/modules/clientes/services/clientesServices";

export function useGetClientes() {
  return useQuery({
    queryKey: ["clientes"],
    queryFn: getClientes,
    staleTime: 30_000,
  });
}

export function useCreateCliente() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createCliente"],
    mutationFn: createCliente,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["clientes"] });
      toast.success("Cliente creado correctamente");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateCliente(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateCliente", id],
    mutationFn: (dto: ClienteDto) => updateCliente(id, dto),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["clientes"] });
      toast.success("Cliente actualizado correctamente");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteCliente() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deleteCliente"],
    mutationFn: deleteCliente,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["clientes"] });
      toast.success("Cliente eliminado correctamente");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

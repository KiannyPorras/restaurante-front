import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { BloqueoDto } from "@/modules/bloqueos/models/Bloqueo";
import {
  createBloqueo,
  deleteBloqueo,
  getBloqueos,
  updateBloqueo,
} from "@/modules/bloqueos/services/bloqueosServices";

export function useGetBloqueos() {
  return useQuery({
    queryKey: ["bloqueos"],
    queryFn: getBloqueos,
    staleTime: 30_000,
  });
}

export function useCreateBloqueo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createBloqueo"],
    mutationFn: createBloqueo,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["bloqueos"] });
      await queryClient.invalidateQueries({ queryKey: ["mesas-disponibles"] });
      toast.success("Bloqueo creado correctamente");
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useUpdateBloqueo(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateBloqueo", id],
    mutationFn: (dto: BloqueoDto) => updateBloqueo(id, dto),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["bloqueos"] });
      await queryClient.invalidateQueries({ queryKey: ["mesas-disponibles"] });
      toast.success("Bloqueo actualizado correctamente");
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useDeleteBloqueo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deleteBloqueo"],
    mutationFn: deleteBloqueo,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["bloqueos"] });
      await queryClient.invalidateQueries({ queryKey: ["mesas-disponibles"] });
      toast.success("Bloqueo eliminado correctamente");
    },
    onError: (error) => toast.error(error.message),
  });
}

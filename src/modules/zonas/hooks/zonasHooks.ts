import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ZonaDto } from "@/modules/zonas/models/Zona";
import {
  createZona,
  deleteZona,
  getZonas,
  updateZona,
} from "@/modules/zonas/services/zonasServices";

export function useGetZonas() {
  return useQuery({
    queryKey: ["zonas"],
    queryFn: getZonas,
    staleTime: 30_000,
  });
}

export function useCreateZona() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createZona"],
    mutationFn: createZona,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["zonas"] });
      toast.success("Zona creada correctamente");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateZona(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateZona", id],
    mutationFn: (dto: ZonaDto) => updateZona(id, dto),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["zonas"] });
      toast.success("Zona actualizada correctamente");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteZona() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deleteZona"],
    mutationFn: deleteZona,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["zonas"] });
      await queryClient.invalidateQueries({ queryKey: ["mesas"] });
      toast.success("Zona eliminada correctamente");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Mesa, MesaDto } from "@/modules/mesas/models/Mesa";
import {
  createMesa,
  deleteMesa,
  getMesas,
  updateMesa,
} from "@/modules/mesas/services/mesasServices";

export function useGetMesas() {
  return useQuery({
    queryKey: ["mesas"],
    queryFn: getMesas,
    staleTime: 30_000,
  });
}

export function useCreateMesa() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createMesa"],
    mutationFn: createMesa,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["mesas"] });
      toast.success("Mesa creada correctamente");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateMesa(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateMesa", id],
    mutationFn: (dto: MesaDto) => updateMesa(id, dto),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["mesas"] });
      toast.success("Mesa actualizada correctamente");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteMesa() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deleteMesa"],
    mutationFn: deleteMesa,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["mesas"] });
      toast.success("Mesa eliminada correctamente");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useMoveMesaPosition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["moveMesaPosition"],
    mutationFn: ({
      mesa,
      posicionX,
      posicionY,
    }: {
      mesa: Mesa;
      posicionX: number;
      posicionY: number;
    }) =>
      updateMesa(mesa.id, {
        numero: mesa.numero,
        capacidad: mesa.capacidad,
        zonaId: mesa.zonaId,
        photoUrl: mesa.photoUrl,
        posicionX,
        posicionY,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["mesas"] });
      toast.success("Posición de mesa actualizada");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

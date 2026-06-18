import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { TurnoDto } from "@/modules/turnos/models/Turno";
import {
  createTurno,
  deleteTurno,
  getTurnos,
  updateTurno,
} from "@/modules/turnos/services/turnosServices";

export function useGetTurnos() {
  return useQuery({
    queryKey: ["turnos"],
    queryFn: getTurnos,
    staleTime: 30_000,
  });
}

export function useCreateTurno() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createTurno"],
    mutationFn: createTurno,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["turnos"] });
      toast.success("Turno creado correctamente");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateTurno(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateTurno", id],
    mutationFn: (dto: TurnoDto) => updateTurno(id, dto),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["turnos"] });
      toast.success("Turno actualizado correctamente");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteTurno() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deleteTurno"],
    mutationFn: deleteTurno,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["turnos"] });
      toast.success("Turno eliminado correctamente");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

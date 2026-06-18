import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type {
  EstadoReserva,
  ReservaDto,
} from "@/modules/reservas/models/Reserva";
import {
  createReserva,
  deleteReserva,
  getMesasDisponiblesPorTurno,
  getReservas,
  updateEstadoReserva,
  updateReserva,
} from "@/modules/reservas/services/reservasServices";

export function useGetReservas() {
  return useQuery({
    queryKey: ["reservas"],
    queryFn: getReservas,
    staleTime: 30_000,
  });
}

export function useGetMesasDisponiblesPorTurno(fecha: string, turnoId: number) {
  return useQuery({
    queryKey: ["mesas-disponibles", fecha, turnoId],
    queryFn: () => getMesasDisponiblesPorTurno(fecha, turnoId),
    enabled: Boolean(fecha && turnoId),
    staleTime: 10_000,
  });
}

export function useCreateReserva() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createReserva"],
    mutationFn: createReserva,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["reservas"] });
      await queryClient.invalidateQueries({ queryKey: ["mesas-disponibles"] });
      toast.success("Reserva creada correctamente");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateReserva(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateReserva", id],
    mutationFn: (dto: ReservaDto) => updateReserva(id, dto),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["reservas"] });
      await queryClient.invalidateQueries({ queryKey: ["mesas-disponibles"] });
      toast.success("Reserva actualizada correctamente");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateEstadoReserva() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateEstadoReserva"],
    mutationFn: ({ id, estado }: { id: number; estado: EstadoReserva }) =>
      updateEstadoReserva(id, estado),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["reservas"] });
      await queryClient.invalidateQueries({ queryKey: ["mesas-disponibles"] });
      toast.success("Estado de reserva actualizado");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteReserva() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deleteReserva"],
    mutationFn: deleteReserva,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["reservas"] });
      await queryClient.invalidateQueries({ queryKey: ["mesas-disponibles"] });
      toast.success("Reserva eliminada correctamente");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

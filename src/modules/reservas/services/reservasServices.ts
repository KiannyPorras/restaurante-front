import { AxiosError } from "axios";
import apiAxios from "@/api/apiConfig";
import type { Mesa } from "@/modules/mesas/models/Mesa";
import type {
  EstadoReserva,
  Reserva,
  ReservaDto,
} from "@/modules/reservas/models/Reserva";

const base = "/api/reservas";

function toError(error: unknown, fallback: string) {
  if (error instanceof AxiosError && error.response) {
    const message =
      typeof error.response.data === "string"
        ? error.response.data
        : error.response.data?.message;
    return new Error(message || fallback, { cause: error });
  }

  return new Error("Error de conexión al servidor", { cause: error });
}

export async function getReservas(): Promise<Reserva[]> {
  try {
    const { data } = await apiAxios.get<Reserva[]>(base);
    return data;
  } catch (error) {
    throw toError(error, "Error al obtener las reservas");
  }
}

export async function createReserva(dto: ReservaDto): Promise<Reserva> {
  try {
    const { data } = await apiAxios.post<Reserva>(base, dto);
    return data;
  } catch (error) {
    throw toError(error, "Error al crear la reserva");
  }
}

export async function updateReserva(
  id: number,
  dto: ReservaDto,
): Promise<Reserva> {
  try {
    const { data } = await apiAxios.put<Reserva>(`${base}/${id}`, dto);
    return data;
  } catch (error) {
    throw toError(error, "Error al actualizar la reserva");
  }
}

export async function updateEstadoReserva(
  id: number,
  estado: EstadoReserva,
): Promise<Reserva> {
  try {
    const { data } = await apiAxios.put<Reserva>(
      `${base}/${id}/estado/${estado}`,
    );
    return data;
  } catch (error) {
    throw toError(error, "Error al cambiar el estado de la reserva");
  }
}

export async function deleteReserva(id: number): Promise<void> {
  try {
    await apiAxios.delete(`${base}/${id}`);
  } catch (error) {
    throw toError(error, "Error al eliminar la reserva");
  }
}

export async function getMesasDisponiblesPorTurno(
  fecha: string,
  turnoId: number,
): Promise<Mesa[]> {
  try {
    const { data } = await apiAxios.get<Mesa[]>(
      `/api/mesas/disponibles/${fecha}/turno/${turnoId}`,
    );
    return data;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 404) {
      return [];
    }

    throw toError(error, "Error al obtener mesas disponibles");
  }
}

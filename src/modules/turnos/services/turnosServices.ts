import { AxiosError } from "axios";
import apiAxios from "@/api/apiConfig";
import type { Turno, TurnoDto } from "@/modules/turnos/models/Turno";

const base = "/api/turnos";

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

export async function getTurnos(): Promise<Turno[]> {
  try {
    const { data } = await apiAxios.get<Turno[]>(base);
    return data;
  } catch (error) {
    throw toError(error, "Error al obtener los turnos");
  }
}

export async function createTurno(dto: TurnoDto): Promise<Turno> {
  try {
    const { data } = await apiAxios.post<Turno>(base, dto);
    return data;
  } catch (error) {
    throw toError(error, "Error al crear el turno");
  }
}

export async function updateTurno(id: number, dto: TurnoDto): Promise<Turno> {
  try {
    const { data } = await apiAxios.put<Turno>(`${base}/${id}`, dto);
    return data;
  } catch (error) {
    throw toError(error, "Error al actualizar el turno");
  }
}

export async function deleteTurno(id: number): Promise<void> {
  try {
    await apiAxios.delete(`${base}/${id}`);
  } catch (error) {
    throw toError(error, "Error al eliminar el turno");
  }
}

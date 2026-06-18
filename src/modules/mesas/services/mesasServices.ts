import { AxiosError } from "axios";
import apiAxios from "@/api/apiConfig";
import type { Mesa, MesaDto } from "@/modules/mesas/models/Mesa";

const base = "/api/mesas";

function toError(error: unknown, fallback: string) {
  if (error instanceof AxiosError && error.response) {
    const message =
      typeof error.response.data === "string"
        ? error.response.data
        : error.response.data?.message;
    return new Error(message || fallback, { cause: error });
  }

  return new Error("Error de conexion al servidor", { cause: error });
}

export async function getMesas(): Promise<Mesa[]> {
  try {
    const { data } = await apiAxios.get<Mesa[]>(base);
    return data;
  } catch (error) {
    throw toError(error, "Error al obtener las mesas");
  }
}

export async function createMesa(dto: MesaDto): Promise<Mesa> {
  try {
    const { data } = await apiAxios.post<Mesa>(base, dto);
    return data;
  } catch (error) {
    throw toError(error, "Error al crear la mesa");
  }
}

export async function updateMesa(id: number, dto: MesaDto): Promise<Mesa> {
  try {
    const { data } = await apiAxios.put<Mesa>(`${base}/${id}`, dto);
    return data;
  } catch (error) {
    throw toError(error, "Error al actualizar la mesa");
  }
}

export async function deleteMesa(id: number): Promise<void> {
  try {
    await apiAxios.delete(`${base}/${id}`);
  } catch (error) {
    throw toError(error, "Error al eliminar la mesa");
  }
}

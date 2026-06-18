import { AxiosError } from "axios";
import apiAxios from "@/api/apiConfig";
import type { Zona, ZonaDto } from "@/modules/zonas/models/Zona";

const base = "/api/zonas";

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

export async function getZonas(): Promise<Zona[]> {
  try {
    const { data } = await apiAxios.get<Zona[]>(base);
    return data;
  } catch (error) {
    throw toError(error, "Error al obtener las zonas");
  }
}

export async function createZona(dto: ZonaDto): Promise<Zona> {
  try {
    const { data } = await apiAxios.post<Zona>(base, dto);
    return data;
  } catch (error) {
    throw toError(error, "Error al crear la zona");
  }
}

export async function updateZona(id: number, dto: ZonaDto): Promise<Zona> {
  try {
    const { data } = await apiAxios.put<Zona>(`${base}/${id}`, dto);
    return data;
  } catch (error) {
    throw toError(error, "Error al actualizar la zona");
  }
}

export async function deleteZona(id: number): Promise<void> {
  try {
    await apiAxios.delete(`${base}/${id}`);
  } catch (error) {
    throw toError(error, "Error al eliminar la zona");
  }
}

import { AxiosError } from "axios";
import apiAxios from "@/api/apiConfig";
import type {
  Bloqueo,
  BloqueoDto,
} from "@/modules/bloqueos/models/Bloqueo";

const base = "/api/bloqueos";

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

export async function getBloqueos(): Promise<Bloqueo[]> {
  try {
    const { data } = await apiAxios.get<Bloqueo[]>(base);
    return data;
  } catch (error) {
    throw toError(error, "Error al obtener los bloqueos");
  }
}

export async function createBloqueo(dto: BloqueoDto): Promise<Bloqueo> {
  try {
    const { data } = await apiAxios.post<Bloqueo>(`${base}/bloquear`, dto);
    return data;
  } catch (error) {
    throw toError(error, "Error al crear el bloqueo");
  }
}

export async function updateBloqueo(
  id: number,
  dto: BloqueoDto,
): Promise<Bloqueo> {
  try {
    const { data } = await apiAxios.put<Bloqueo>(`${base}/${id}`, dto);
    return data;
  } catch (error) {
    throw toError(error, "Error al actualizar el bloqueo");
  }
}

export async function deleteBloqueo(id: number): Promise<void> {
  try {
    await apiAxios.delete(`${base}/${id}`);
  } catch (error) {
    throw toError(error, "Error al eliminar el bloqueo");
  }
}

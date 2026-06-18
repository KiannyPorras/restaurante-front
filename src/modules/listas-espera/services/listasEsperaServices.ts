import { AxiosError } from "axios";
import apiAxios from "@/api/apiConfig";
import type {
  ListaEspera,
  ListaEsperaDto,
} from "@/modules/listas-espera/models/ListaEspera";

const base = "/api/listaespera";

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

export async function createListaEspera(
  dto: ListaEsperaDto,
): Promise<ListaEspera> {
  try {
    const { data } = await apiAxios.post<ListaEspera>(base, dto);
    return data;
  } catch (error) {
    throw toError(error, "Error al crear la solicitud de reserva");
  }
}

export async function getListasEspera(): Promise<ListaEspera[]> {
  try {
    const { data } = await apiAxios.get<ListaEspera[]>(base);
    return data;
  } catch (error) {
    throw toError(error, "Error al obtener la lista de espera");
  }
}

export async function promoverListaEspera(
  listaEsperaId: number,
  mesaId: number,
): Promise<void> {
  try {
    await apiAxios.post(`${base}/${listaEsperaId}/promover/${mesaId}`);
  } catch (error) {
    throw toError(error, "Error al confirmar la solicitud");
  }
}

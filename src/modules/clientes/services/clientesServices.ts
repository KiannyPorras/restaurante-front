import { AxiosError } from "axios";
import apiAxios from "@/api/apiConfig";
import type {
  Cliente,
  ClienteDto,
} from "@/modules/clientes/models/Cliente";

const base = "/api/clientes";

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

export async function getClientes(): Promise<Cliente[]> {
  try {
    const { data } = await apiAxios.get<Cliente[]>(base);
    return data;
  } catch (error) {
    throw toError(error, "Error al obtener los clientes");
  }
}

export async function getClienteByCedula(
  cedula: number,
): Promise<Cliente | null> {
  try {
    const { data } = await apiAxios.get<Cliente>(`${base}/cedula/${cedula}`);
    return data;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 404) {
      return null;
    }

    throw toError(error, "Error al buscar el cliente");
  }
}

export async function createCliente(dto: ClienteDto): Promise<Cliente> {
  try {
    const { data } = await apiAxios.post<Cliente>(base, dto);
    return data;
  } catch (error) {
    throw toError(error, "Error al crear el cliente");
  }
}

export async function updateCliente(
  id: number,
  dto: ClienteDto,
): Promise<Cliente> {
  try {
    const { data } = await apiAxios.put<Cliente>(`${base}/${id}`, dto);
    return data;
  } catch (error) {
    throw toError(error, "Error al actualizar el cliente");
  }
}

export async function deleteCliente(id: number): Promise<void> {
  try {
    await apiAxios.delete(`${base}/${id}`);
  } catch (error) {
    throw toError(error, "Error al eliminar el cliente");
  }
}

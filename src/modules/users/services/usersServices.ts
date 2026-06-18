import { AxiosError } from "axios";
import apiAxios from "@/api/apiConfig";
import type {
  CreateUserDto,
  UpdateUserDto,
  User,
} from "@/modules/users/models/User";

const base = "/api/users";

export async function getUsers(): Promise<User[]> {
  try {
    const { data } = await apiAxios.get<User[]>(base);
    return data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      const message =
        typeof error.response.data === "string"
          ? error.response.data
          : error.response.data?.message;

      throw new Error(message || "Error al obtener los usuarios", {
        cause: error,
      });
    }

    throw new Error("Error de conexion al servidor", { cause: error });
  }
}

export async function createUser(createDto: CreateUserDto): Promise<User> {
  try {
    const { data } = await apiAxios.post<User>(base, createDto);
    return data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      const message =
        typeof error.response.data === "string"
          ? error.response.data
          : error.response.data?.message;

      throw new Error(message || "Error al crear el usuario", { cause: error });
    }

    throw new Error("Error de conexion al servidor", { cause: error });
  }
}

export async function updateUser(
  id: number,
  updateDto: UpdateUserDto,
): Promise<User> {
  try {
    const { data } = await apiAxios.put<User>(`${base}/${id}`, updateDto);
    return data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      const message =
        typeof error.response.data === "string"
          ? error.response.data
          : error.response.data?.message;

      throw new Error(message || "Error al actualizar el usuario", {
        cause: error,
      });
    }

    throw new Error("Error de conexion al servidor", { cause: error });
  }
}

export async function deleteUser(id: number): Promise<void> {
  try {
    await apiAxios.delete(`${base}/${id}`);
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      const message =
        typeof error.response.data === "string"
          ? error.response.data
          : error.response.data?.message;

      throw new Error(message || "Error al eliminar el usuario", {
        cause: error,
      });
    }

    throw new Error("Error de conexion al servidor", { cause: error });
  }
}

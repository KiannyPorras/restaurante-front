import { AxiosError } from "axios";
import apiAxios, { TOKEN_STORAGE_KEY } from "@/api/apiConfig";
import type {
  LoginResponse,
  SessionUser,
  SignInDto,
} from "@/modules/auth/models/SignInDto";

const SESSION_STORAGE_KEY = "session_user";

export async function signInService(
  signInDto: SignInDto,
): Promise<LoginResponse> {
  try {
    const { data } = await apiAxios.post<LoginResponse>(
      "/api/auth/login",
      signInDto,
    );

    window.localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
    window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(data.user));

    return data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      const message =
        typeof error.response.data === "string"
          ? error.response.data
          : error.response.data?.message;

      throw new Error(message || "Error al iniciar sesion", { cause: error });
    }

    throw new Error("Error de conexion al servidor", { cause: error });
  }
}

export function getStoredSession(): SessionUser | null {
  const token = window.localStorage.getItem(TOKEN_STORAGE_KEY);
  const rawUser = window.localStorage.getItem(SESSION_STORAGE_KEY);

  if (!token || !rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser) as SessionUser;
  } catch {
    clearSession();
    return null;
  }
}

export function clearSession() {
  window.localStorage.removeItem(TOKEN_STORAGE_KEY);
  window.localStorage.removeItem(SESSION_STORAGE_KEY);
}

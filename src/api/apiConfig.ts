import axios, { AxiosHeaders, type InternalAxiosRequestConfig } from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5052";
export const TOKEN_STORAGE_KEY = "token";

function getSessionToken() {
  if (typeof window === "undefined") {
    return null;
  }

  const token = window.localStorage.getItem(TOKEN_STORAGE_KEY)?.trim();

  if (!token || token === "null" || token === "undefined") {
    return null;
  }

  return token;
}

const apiAxios = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    Accept: "application/json",
  },
});

apiAxios.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const headers = AxiosHeaders.from(config.headers);

  if (!headers.has("Authorization")) {
    const sessionToken = getSessionToken();

    if (sessionToken) {
      headers.set("Authorization", `Bearer ${sessionToken}`);
    } else {
      headers.delete("Authorization");
    }
  }

  config.headers = headers;

  return config;
});

export { apiAxios };
export default apiAxios;

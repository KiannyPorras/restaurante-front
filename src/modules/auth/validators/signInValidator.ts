import { z } from "@/lib/form";

export const signInSchema = z.object({
  userNameOrEmail: z.string().min(1, "Ingresa tu correo o usuario"),
  password: z.string().min(1, "Ingresa tu contraseña"),
});

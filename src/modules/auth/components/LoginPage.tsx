import { useState } from "react";
import { Eye, EyeOff, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useForm } from "@/lib/form";
import { useSignIn } from "@/modules/auth/hooks/authHook";
import { signInDefaultValues } from "@/modules/auth/models/SignInDto";
import { signInSchema } from "@/modules/auth/validators/signInValidator";
import { useNavigate } from "@tanstack/react-router";

export function LoginPage() {
  const signInMutation = useSignIn();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: signInDefaultValues,
    onSubmit: async ({ value }) => {
      const result = signInSchema.safeParse(value);

      if (!result.success) {
        return;
      }

      await signInMutation.mutateAsync(result.data);
      navigate({ to: "/dashboard" });
    },
  });

  return (
    <main className="relative flex justify-center items-center bg-slate-950 p-6 min-h-svh overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(148,163,184,0.35),_transparent_34%),linear-gradient(135deg,_rgba(15,23,42,0.95),_rgba(2,6,23,0.9))]" />
      <div className="top-8 absolute inset-x-8 bg-gradient-to-r from-transparent via-white/30 to-transparent h-px" />

      <Card className="z-10 relative bg-white/10 shadow-2xl backdrop-blur-xl border-white/15 w-full max-w-md text-white">
        <form
          className="flex flex-col gap-5"
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            void form.handleSubmit();
          }}
        >
          <CardHeader className="items-center text-center">
            <div className="flex justify-center items-center bg-white shadow-lg rounded-2xl size-14 text-slate-950">
              <Utensils className="size-7" />
            </div>
            <CardTitle>Restaurante</CardTitle>
            <CardDescription className="text-white/75">
              Ingresa tus credenciales para acceder al panel administrativo.
            </CardDescription>
          </CardHeader>

          <CardContent className="gap-4 grid">
            <form.Field name="userNameOrEmail">
              {(field) => (
                <label
                  className="gap-2 grid font-medium text-sm"
                  htmlFor={field.name}
                >
                  Usuario o correo
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    placeholder="usuario o correo@ejemplo.com"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                </label>
              )}
            </form.Field>

            <form.Field name="password">
              {(field) => (
                <label
                  className="gap-2 grid font-medium text-sm"
                  htmlFor={field.name}
                >
                  Contraseña
                  <div className="relative">
                    <Input
                      id={field.name}
                      name={field.name}
                      type={showPassword ? "text" : "password"}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      placeholder="Tu contraseña"
                      className="bg-white/10 pr-10 border-white/20 text-white placeholder:text-white/50"
                    />
                    <button
                      type="button"
                      className="top-1/2 right-3 absolute text-white/70 hover:text-white transition -translate-y-1/2"
                      onClick={() => setShowPassword((value) => !value)}
                      aria-label={
                        showPassword
                          ? "Ocultar contraseña"
                          : "Mostrar contraseña"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </div>
                </label>
              )}
            </form.Field>

            {signInMutation.isError ? (
              <p className="bg-red-500/15 px-3 py-2 border border-red-300/30 rounded-md text-red-100 text-sm">
                {signInMutation.error.message}
              </p>
            ) : null}
          </CardContent>

          <CardFooter>
            <Button
              type="submit"
              className="bg-white hover:bg-white/90 w-full text-slate-950"
              disabled={signInMutation.isPending}
            >
              {signInMutation.isPending
                ? "Iniciando sesion..."
                : "Iniciar sesion"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
}

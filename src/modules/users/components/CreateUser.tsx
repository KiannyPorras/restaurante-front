import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useForm } from "@/lib/form";
import { useCreateUser } from "@/modules/users/hooks/usersHooks";
import { createUserDefaultValues } from "@/modules/users/models/User";

export function CreateUser() {
  const [open, setOpen] = useState(false);
  const createUserMutation = useCreateUser();
  const form = useForm({
    defaultValues: createUserDefaultValues,
    onSubmit: async ({ value }) => {
      await createUserMutation.mutateAsync({
        username: value.username.trim(),
        email: value.email.trim(),
        cedula: value.cedula,
        password: value.password,
      });
      setOpen(false);
    },
  });

  return (
    <>
      <Button onClick={() => setOpen(true)}>Crear usuario</Button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="flex flex-col p-0 sm:max-w-md">
          <SheetHeader className="border-b p-5 pr-12">
            <SheetTitle>Crear usuario</SheetTitle>
            <SheetDescription>
              Agrega un usuario administrativo.
            </SheetDescription>
          </SheetHeader>
          <form
            className="flex flex-1 flex-col overflow-hidden"
            onSubmit={(event) => {
              event.preventDefault();
              event.stopPropagation();
              void form.handleSubmit();
            }}
          >
            <div className="flex flex-col flex-1 gap-4 overflow-y-auto p-5">
              <form.Field name="username">
                {(field) => (
                  <Field label="Usuario" htmlFor="create-user-username">
                    <Input
                      id="create-user-username"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      placeholder="usuario"
                      required
                    />
                  </Field>
                )}
              </form.Field>
              <form.Field name="email">
                {(field) => (
                  <Field label="Correo" htmlFor="create-user-email">
                    <Input
                      id="create-user-email"
                      type="email"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      placeholder="correo@ejemplo.com"
                      required
                    />
                  </Field>
                )}
              </form.Field>
              <form.Field name="cedula">
                {(field) => (
                  <Field label="Cédula" htmlFor="create-user-cedula">
                    <Input
                      id="create-user-cedula"
                      type="number"
                      value={field.state.value || ""}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(Number(event.target.value))
                      }
                      placeholder="504580545"
                      required
                    />
                  </Field>
                )}
              </form.Field>
              <form.Field name="password">
                {(field) => (
                  <Field label="Contraseña" htmlFor="create-user-password">
                    <Input
                      id="create-user-password"
                      type="password"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      placeholder="Contraseña"
                      required
                    />
                  </Field>
                )}
              </form.Field>
              {createUserMutation.error ? (
                <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {createUserMutation.error.message}
                </p>
              ) : null}
            </div>
            <SheetFooter className="border-t p-5">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={createUserMutation.isPending}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={createUserMutation.isPending}>
                {createUserMutation.isPending ? "Guardando..." : "Guardar"}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </>
  );
}

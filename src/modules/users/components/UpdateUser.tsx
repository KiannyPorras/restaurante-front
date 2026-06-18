import { useState } from "react";
import { Pencil } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useForm } from "@/lib/form";
import { useUpdateUser } from "@/modules/users/hooks/usersHooks";
import type { User } from "@/modules/users/models/User";

export function UpdateUser({ user }: { user: User }) {
  const [open, setOpen] = useState(false);
  const updateUserMutation = useUpdateUser(user.id);
  const form = useForm({
    defaultValues: {
      username: user.username,
      email: user.email,
      cedula: user.cedula,
      password: "",
    },
    onSubmit: async ({ value }) => {
      await updateUserMutation.mutateAsync({
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
      <DropdownMenuItem
        onSelect={(event) => {
          event.preventDefault();
          setOpen(true);
        }}
      >
        <Pencil className="size-4" />
        Editar
      </DropdownMenuItem>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="flex flex-col p-0 sm:max-w-md">
          <SheetHeader className="border-b p-5 pr-12">
            <SheetTitle>Editar usuario</SheetTitle>
            <SheetDescription>
              Actualiza la informacion del usuario.
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
                  <Field label="Usuario" htmlFor="update-user-username">
                    <Input
                      id="update-user-username"
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
                  <Field label="Correo" htmlFor="update-user-email">
                    <Input
                      id="update-user-email"
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
                  <Field label="Cédula" htmlFor="update-user-cedula">
                    <Input
                      id="update-user-cedula"
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
                  <Field label="Contraseña" htmlFor="update-user-password">
                    <Input
                      id="update-user-password"
                      type="password"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      placeholder="Dejar vacia para mantenerla"
                    />
                  </Field>
                )}
              </form.Field>
              {updateUserMutation.error ? (
                <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {updateUserMutation.error.message}
                </p>
              ) : null}
            </div>
            <SheetFooter className="border-t p-5">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={updateUserMutation.isPending}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={updateUserMutation.isPending}>
                {updateUserMutation.isPending ? "Guardando..." : "Guardar"}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </>
  );
}

import { useState } from "react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
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
import { useUpdateCliente } from "@/modules/clientes/hooks/clientesHooks";
import type { Cliente } from "@/modules/clientes/models/Cliente";

export function UpdateCliente({ cliente }: { cliente: Cliente }) {
  const [open, setOpen] = useState(false);
  const updateClienteMutation = useUpdateCliente(cliente.id);
  const form = useForm({
    defaultValues: {
      nombre: cliente.nombre,
      apellido: cliente.apellido,
      email: cliente.email,
      telefono: cliente.telefono,
      cedula: cliente.cedula,
    },
    onSubmit: async ({ value }) => {
      await updateClienteMutation.mutateAsync({
        nombre: value.nombre.trim(),
        apellido: value.apellido.trim(),
        email: value.email.trim(),
        telefono: value.telefono,
        cedula: value.cedula,
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
        Editar
      </DropdownMenuItem>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="flex flex-col p-0 sm:max-w-md">
          <SheetHeader className="border-b p-5 pr-12">
            <SheetTitle>Editar cliente</SheetTitle>
            <SheetDescription>
              Actualiza los datos del cliente.
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
            <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-5">
              <form.Field name="nombre">
                {(field) => (
                  <Field label="Nombre" htmlFor="update-cliente-nombre">
                    <Input
                      id="update-cliente-nombre"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      required
                    />
                  </Field>
                )}
              </form.Field>
              <form.Field name="apellido">
                {(field) => (
                  <Field label="Apellido" htmlFor="update-cliente-apellido">
                    <Input
                      id="update-cliente-apellido"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      required
                    />
                  </Field>
                )}
              </form.Field>
              <form.Field name="email">
                {(field) => (
                  <Field label="Email" htmlFor="update-cliente-email">
                    <Input
                      id="update-cliente-email"
                      type="email"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      required
                    />
                  </Field>
                )}
              </form.Field>
              <form.Field name="telefono">
                {(field) => (
                  <Field label="Teléfono" htmlFor="update-cliente-telefono">
                    <Input
                      id="update-cliente-telefono"
                      type="number"
                      value={field.state.value || ""}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(Number(event.target.value))
                      }
                      required
                    />
                  </Field>
                )}
              </form.Field>
              <form.Field name="cedula">
                {(field) => (
                  <Field label="Cédula" htmlFor="update-cliente-cedula">
                    <Input
                      id="update-cliente-cedula"
                      type="number"
                      value={field.state.value || ""}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(Number(event.target.value))
                      }
                      required
                    />
                  </Field>
                )}
              </form.Field>
              {updateClienteMutation.error ? (
                <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {updateClienteMutation.error.message}
                </p>
              ) : null}
            </div>
            <SheetFooter className="border-t p-5">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={updateClienteMutation.isPending}
              >
                Cancelar
              </Button>
              <form.Subscribe>
                {(state) => (
                  <Button
                    type="submit"
                    disabled={
                      !state.canSubmit ||
                      state.isSubmitting ||
                      updateClienteMutation.isPending
                    }
                  >
                    {state.isSubmitting || updateClienteMutation.isPending
                      ? "Guardando..."
                      : "Guardar"}
                  </Button>
                )}
              </form.Subscribe>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </>
  );
}

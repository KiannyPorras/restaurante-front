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
import { useCreateCliente } from "@/modules/clientes/hooks/clientesHooks";
import { clienteDefaultValues } from "@/modules/clientes/models/Cliente";

export function CreateCliente() {
  const [open, setOpen] = useState(false);
  const createClienteMutation = useCreateCliente();
  const form = useForm({
    defaultValues: clienteDefaultValues,
    onSubmit: async ({ value }) => {
      await createClienteMutation.mutateAsync({
        nombre: value.nombre.trim(),
        apellido: value.apellido.trim(),
        email: value.email.trim(),
        telefono: value.telefono,
        cedula: value.cedula,
      });
      form.reset();
      setOpen(false);
    },
  });

  return (
    <>
      <Button onClick={() => setOpen(true)}>Crear cliente</Button>
      <Sheet
        open={open}
        onOpenChange={(value) => {
          setOpen(value);
          if (!value) form.reset();
        }}
      >
        <SheetContent className="flex flex-col p-0 sm:max-w-md">
          <SheetHeader className="border-b p-5 pr-12">
            <SheetTitle>Crear cliente</SheetTitle>
            <SheetDescription>
              Registra un cliente para reservas y lista de espera.
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
                  <Field label="Nombre" htmlFor="create-cliente-nombre">
                    <Input
                      id="create-cliente-nombre"
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
                  <Field label="Apellido" htmlFor="create-cliente-apellido">
                    <Input
                      id="create-cliente-apellido"
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
                  <Field label="Email" htmlFor="create-cliente-email">
                    <Input
                      id="create-cliente-email"
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
                  <Field label="Teléfono" htmlFor="create-cliente-telefono">
                    <Input
                      id="create-cliente-telefono"
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
                  <Field label="Cédula" htmlFor="create-cliente-cedula">
                    <Input
                      id="create-cliente-cedula"
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
              {createClienteMutation.error ? (
                <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {createClienteMutation.error.message}
                </p>
              ) : null}
            </div>
            <SheetFooter className="border-t p-5">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={createClienteMutation.isPending}
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
                      createClienteMutation.isPending ||
                      !state.values.nombre ||
                      !state.values.apellido ||
                      !state.values.email ||
                      !state.values.telefono ||
                      !state.values.cedula
                    }
                  >
                    {state.isSubmitting || createClienteMutation.isPending
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

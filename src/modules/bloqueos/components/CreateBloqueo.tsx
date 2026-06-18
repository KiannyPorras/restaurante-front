import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, TimeField } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useForm } from "@/lib/form";
import { useCreateBloqueo } from "@/modules/bloqueos/hooks/bloqueosHooks";
import { bloqueoDefaultValues } from "@/modules/bloqueos/models/Bloqueo";
import type { Mesa } from "@/modules/mesas/models/Mesa";
import { TimeSelect } from "@/modules/turnos/components/TimeSelect";

export function CreateBloqueo({ mesas }: { mesas: Mesa[] }) {
  const [open, setOpen] = useState(false);
  const createBloqueoMutation = useCreateBloqueo();
  const form = useForm({
    defaultValues: bloqueoDefaultValues,
    onSubmit: async ({ value }) => {
      await createBloqueoMutation.mutateAsync({
        ...value,
        motivo: value.motivo.trim(),
      });
      form.reset();
      setOpen(false);
    },
  });

  return (
    <>
      <Button onClick={() => setOpen(true)}>Crear bloqueo</Button>
      <Sheet
        open={open}
        onOpenChange={(value) => {
          setOpen(value);
          if (!value) form.reset();
        }}
      >
        <SheetContent className="flex flex-col p-0 sm:max-w-md">
          <SheetHeader className="border-b p-5 pr-12">
            <SheetTitle>Crear bloqueo</SheetTitle>
            <SheetDescription>
              Bloquea una mesa por fecha y horario.
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
              <form.Field name="mesaId">
                {(field) => (
                  <Field label="Mesa" htmlFor="create-bloqueo-mesaId">
                    <Select
                      value={field.state.value ? String(field.state.value) : ""}
                      onValueChange={(value) =>
                        field.handleChange(Number(value))
                      }
                    >
                      <SelectTrigger
                        id="create-bloqueo-mesaId"
                        className="w-full"
                      >
                        <SelectValue placeholder="Selecciona una mesa" />
                      </SelectTrigger>
                      <SelectContent>
                        {mesas.map((mesa) => (
                          <SelectItem key={mesa.id} value={String(mesa.id)}>
                            Mesa {mesa.numero} - {mesa.capacidad} personas
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              </form.Field>
              <form.Field name="fecha">
                {(field) => (
                  <Field label="Fecha" htmlFor="create-bloqueo-fecha">
                    <Input
                      id="create-bloqueo-fecha"
                      type="date"
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
              <div className="grid gap-4 sm:grid-cols-2">
                <form.Field name="horaInicio">
                  {(field) => (
                    <TimeField label="Hora inicio">
                      <TimeSelect
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={field.handleChange}
                        required
                      />
                    </TimeField>
                  )}
                </form.Field>
                <form.Field name="horaFin">
                  {(field) => (
                    <TimeField label="Hora fin">
                      <TimeSelect
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={field.handleChange}
                        required
                      />
                    </TimeField>
                  )}
                </form.Field>
              </div>
              <form.Field name="motivo">
                {(field) => (
                  <Field label="Motivo" htmlFor="create-bloqueo-motivo">
                    <Input
                      id="create-bloqueo-motivo"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      placeholder="Mantenimiento, evento privado..."
                      required
                    />
                  </Field>
                )}
              </form.Field>
              {createBloqueoMutation.error ? (
                <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {createBloqueoMutation.error.message}
                </p>
              ) : null}
            </div>
            <SheetFooter className="border-t p-5">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={createBloqueoMutation.isPending}
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
                      createBloqueoMutation.isPending ||
                      !state.values.mesaId ||
                      !state.values.fecha ||
                      !state.values.horaInicio ||
                      !state.values.horaFin ||
                      !state.values.motivo
                    }
                  >
                    {state.isSubmitting || createBloqueoMutation.isPending
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

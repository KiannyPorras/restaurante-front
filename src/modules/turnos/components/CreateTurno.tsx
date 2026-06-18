import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, TimeField } from "@/components/ui/field";
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
import { useCreateTurno } from "@/modules/turnos/hooks/turnosHooks";
import { turnoDefaultValues } from "@/modules/turnos/models/Turno";
import { TimeSelect } from "@/modules/turnos/components/TimeSelect";

export function CreateTurno() {
  const [open, setOpen] = useState(false);
  const createTurnoMutation = useCreateTurno();
  const form = useForm({
    defaultValues: turnoDefaultValues,
    onSubmit: async ({ value }) => {
      await createTurnoMutation.mutateAsync({
        ...value,
        nombre: value.nombre.trim(),
        horaInicio: value.horaInicio.trim(),
        horaFin: value.horaFin.trim(),
      });
      setOpen(false);
      form.reset();
    },
  });

  return (
    <>
      <Button onClick={() => setOpen(true)}>Crear turno</Button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="flex flex-col p-0 sm:max-w-lg">
          <SheetHeader className="border-b p-5 pr-12">
            <SheetTitle>Crear turno</SheetTitle>
            <SheetDescription>
              Configura el nombre y el horario del nuevo turno.
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
              <form.Field name="nombre">
                {(field) => (
                  <Field label="Nombre del turno" htmlFor="create-turno-nombre">
                    <Input
                      id="create-turno-nombre"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      placeholder="Ej. Desayuno, Almuerzo, Cena"
                      required
                    />
                  </Field>
                )}
              </form.Field>

              <div className="grid grid-cols-2 gap-4">
                <form.Field name="horaInicio">
                  {(field) => (
                    <TimeField label="Hora de inicio">
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
                    <TimeField label="Hora de fin">
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

              {createTurnoMutation.error ? (
                <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {createTurnoMutation.error.message}
                </p>
              ) : null}
            </div>
            <SheetFooter className="border-t p-5">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={createTurnoMutation.isPending}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={createTurnoMutation.isPending}>
                {createTurnoMutation.isPending ? "Guardando..." : "Guardar"}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </>
  );
}

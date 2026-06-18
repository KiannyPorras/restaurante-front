import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, TimeField } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useForm } from "@/lib/form";
import { useUpdateTurno } from "@/modules/turnos/hooks/turnosHooks";
import type { Turno } from "@/modules/turnos/models/Turno";
import { TimeSelect } from "@/modules/turnos/components/TimeSelect";

export function UpdateTurno({ turno }: { turno: Turno }) {
  const [open, setOpen] = useState(false);
  const updateTurnoMutation = useUpdateTurno(turno.id);
  const form = useForm({
    defaultValues: {
      nombre: turno.nombre,
      horaInicio: turno.horaInicio,
      horaFin: turno.horaFin,
    },
    onSubmit: async ({ value }) => {
      await updateTurnoMutation.mutateAsync({
        ...value,
        nombre: value.nombre.trim(),
        horaInicio: value.horaInicio.trim(),
        horaFin: value.horaFin.trim(),
      });
      setOpen(false);
    },
  });

  return (
    <>
      <DropdownMenuItem
        onSelect={(e) => {
          e.preventDefault();
          setOpen(true);
        }}
      >
        Editar
      </DropdownMenuItem>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="flex flex-col p-0 sm:max-w-lg">
          <SheetHeader className="border-b p-5 pr-12">
            <SheetTitle>Editar turno</SheetTitle>
            <SheetDescription>
              Modifica los detalles del turno.
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
                  <Field label="Nombre del turno" htmlFor="update-turno-nombre">
                    <Input
                      id="update-turno-nombre"
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

              {updateTurnoMutation.error ? (
                <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {updateTurnoMutation.error.message}
                </p>
              ) : null}
            </div>
            <SheetFooter className="border-t p-5">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={updateTurnoMutation.isPending}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={updateTurnoMutation.isPending}>
                {updateTurnoMutation.isPending ? "Guardando..." : "Guardar"}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </>
  );
}

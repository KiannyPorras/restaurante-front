import { useState } from "react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
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
import { useUpdateBloqueo } from "@/modules/bloqueos/hooks/bloqueosHooks";
import type { Bloqueo } from "@/modules/bloqueos/models/Bloqueo";
import type { Mesa } from "@/modules/mesas/models/Mesa";
import { TimeSelect } from "@/modules/turnos/components/TimeSelect";

export function UpdateBloqueo({
  bloqueo,
  mesas,
}: {
  bloqueo: Bloqueo;
  mesas: Mesa[];
}) {
  const [open, setOpen] = useState(false);
  const updateBloqueoMutation = useUpdateBloqueo(bloqueo.id);
  const form = useForm({
    defaultValues: {
      mesaId: bloqueo.mesaId,
      fecha: bloqueo.fecha,
      horaInicio: bloqueo.horaInicio,
      horaFin: bloqueo.horaFin,
      motivo: bloqueo.motivo,
    },
    onSubmit: async ({ value }) => {
      await updateBloqueoMutation.mutateAsync({
        ...value,
        motivo: value.motivo.trim(),
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
            <SheetTitle>Editar bloqueo</SheetTitle>
            <SheetDescription>
              Actualiza los datos del bloqueo.
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
                  <Field label="Mesa" htmlFor="update-bloqueo-mesaId">
                    <Select
                      value={String(field.state.value)}
                      onValueChange={(value) =>
                        field.handleChange(Number(value))
                      }
                    >
                      <SelectTrigger
                        id="update-bloqueo-mesaId"
                        className="w-full"
                      >
                        <SelectValue />
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
                  <Field label="Fecha" htmlFor="update-bloqueo-fecha">
                    <Input
                      id="update-bloqueo-fecha"
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
                  <Field label="Motivo" htmlFor="update-bloqueo-motivo">
                    <Input
                      id="update-bloqueo-motivo"
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
              {updateBloqueoMutation.error ? (
                <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {updateBloqueoMutation.error.message}
                </p>
              ) : null}
            </div>
            <SheetFooter className="border-t p-5">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={updateBloqueoMutation.isPending}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={updateBloqueoMutation.isPending}>
                {updateBloqueoMutation.isPending ? "Guardando..." : "Guardar"}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </>
  );
}

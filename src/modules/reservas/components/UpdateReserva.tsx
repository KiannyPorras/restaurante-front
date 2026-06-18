import { useState } from "react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
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
import { useGetClientes } from "@/modules/clientes/hooks/clientesHooks";
import { useGetMesas } from "@/modules/mesas/hooks/mesasHooks";
import { useUpdateReserva } from "@/modules/reservas/hooks/reservasHooks";
import {
  ESTADOS_RESERVA,
  type EstadoReserva,
  type Reserva,
  type ReservaDto,
} from "@/modules/reservas/models/Reserva";
import { useGetTurnos } from "@/modules/turnos/hooks/turnosHooks";
import { useGetZonas } from "@/modules/zonas/hooks/zonasHooks";

type ReservaFormValues = ReservaDto & { zonaId: number };

export function UpdateReserva({ reserva }: { reserva: Reserva }) {
  const [open, setOpen] = useState(false);
  const { data: clientes = [] } = useGetClientes();
  const { data: mesas = [] } = useGetMesas();
  const { data: turnos = [] } = useGetTurnos();
  const { data: zonas = [] } = useGetZonas();
  const updateReservaMutation = useUpdateReserva(reserva.id);
  const zonaInicialId =
    mesas.find((mesa) => mesa.id === reserva.mesaId)?.zonaId ?? 0;
  const [zonaId, setZonaId] = useState(zonaInicialId);
  const defaultValues: ReservaFormValues = {
    fecha: reserva.fecha,
    capacidad: reserva.capacidad,
    clienteId: reserva.clienteId,
    mesaId: reserva.mesaId,
    turnoId: reserva.turnoId,
    estado: reserva.estado,
    zonaId: zonaInicialId,
  };
  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      await updateReservaMutation.mutateAsync({
        fecha: value.fecha,
        capacidad: value.capacidad,
        clienteId: value.clienteId,
        mesaId: value.mesaId,
        turnoId: value.turnoId,
        estado: value.estado,
      });
      setOpen(false);
    },
  });
  const mesasPorZona =
    zonaId === 0 ? [] : mesas.filter((mesa) => mesa.zonaId === zonaId);

  function getMesaPlaceholder() {
    if (zonaId === 0) return "Selecciona una zona primero";
    return "Selecciona una mesa";
  }

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
        <SheetContent className="flex flex-col p-0 sm:max-w-lg">
          <SheetHeader className="border-b p-5 pr-12">
            <SheetTitle>Editar reserva</SheetTitle>
            <SheetDescription>
              Al cambiar turno, el backend actualiza el snapshot de horas.
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
              <form.Field name="fecha">
                {(field) => (
                  <Field label="Fecha" htmlFor="update-reserva-fecha">
                    <Input
                      id="update-reserva-fecha"
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
              <form.Field name="clienteId">
                {(field) => (
                  <Field label="Cliente" htmlFor="update-reserva-clienteId">
                    <Select
                      value={String(field.state.value)}
                      onValueChange={(value) =>
                        field.handleChange(Number(value))
                      }
                    >
                      <SelectTrigger
                        id="update-reserva-clienteId"
                        className="w-full"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {clientes.map((cliente) => (
                          <SelectItem
                            key={cliente.id}
                            value={String(cliente.id)}
                          >
                            {cliente.nombre} {cliente.apellido}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              </form.Field>
              <form.Field name="turnoId">
                {(field) => (
                  <Field label="Turno" htmlFor="update-reserva-turnoId">
                    <Select
                      value={String(field.state.value)}
                      onValueChange={(value) =>
                        field.handleChange(Number(value))
                      }
                    >
                      <SelectTrigger
                        id="update-reserva-turnoId"
                        className="w-full"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {turnos.map((turno) => (
                          <SelectItem key={turno.id} value={String(turno.id)}>
                            {turno.nombre} ({turno.horaInicio} -{" "}
                            {turno.horaFin})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              </form.Field>
              <form.Field name="capacidad">
                {(field) => (
                  <Field label="Personas" htmlFor="update-reserva-capacidad">
                    <Input
                      id="update-reserva-capacidad"
                      type="number"
                      min={1}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(Number(event.target.value))
                      }
                      required
                    />
                  </Field>
                )}
              </form.Field>
              <form.Field name="zonaId">
                {(field) => (
                  <Field label="Zona" htmlFor="update-reserva-zonaId">
                    <Select
                      value={zonaId ? String(zonaId) : ""}
                      onValueChange={(value) => {
                        field.handleChange(Number(value));
                        setZonaId(Number(value));
                        form.setFieldValue("mesaId", 0);
                      }}
                    >
                      <SelectTrigger
                        id="update-reserva-zonaId"
                        className="w-full"
                      >
                        <SelectValue placeholder="Selecciona una zona" />
                      </SelectTrigger>
                      <SelectContent>
                        {zonas.map((zona) => (
                          <SelectItem key={zona.id} value={String(zona.id)}>
                            {zona.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              </form.Field>
              <form.Field name="mesaId">
                {(field) => (
                  <Field label="Mesa" htmlFor="update-reserva-mesaId">
                    <Select
                      value={field.state.value ? String(field.state.value) : ""}
                      onValueChange={(value) =>
                        field.handleChange(Number(value))
                      }
                      disabled={zonaId === 0}
                    >
                      <SelectTrigger
                        id="update-reserva-mesaId"
                        className="w-full"
                      >
                        <SelectValue placeholder={getMesaPlaceholder()} />
                      </SelectTrigger>
                      <SelectContent>
                        {mesasPorZona.map((mesa) => (
                          <SelectItem key={mesa.id} value={String(mesa.id)}>
                            Mesa {mesa.numero} - {mesa.capacidad} personas
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              </form.Field>
              <form.Field name="estado">
                {(field) => (
                  <Field label="Estado" htmlFor="update-reserva-estado">
                    <Select
                      value={String(field.state.value)}
                      onValueChange={(value) =>
                        field.handleChange(Number(value) as EstadoReserva)
                      }
                    >
                      <SelectTrigger
                        id="update-reserva-estado"
                        className="w-full"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ESTADOS_RESERVA.map((estado) => (
                          <SelectItem key={estado.id} value={String(estado.id)}>
                            {estado.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              </form.Field>
              {updateReservaMutation.error ? (
                <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {updateReservaMutation.error.message}
                </p>
              ) : null}
            </div>
            <SheetFooter className="border-t p-5">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={updateReservaMutation.isPending}
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
                      updateReservaMutation.isPending
                    }
                  >
                    {state.isSubmitting || updateReservaMutation.isPending
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

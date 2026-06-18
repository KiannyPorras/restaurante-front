import { useState } from "react";
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
import {
  useCreateReserva,
  useGetMesasDisponiblesPorTurno,
} from "@/modules/reservas/hooks/reservasHooks";
import {
  ESTADOS_RESERVA,
  reservaDefaultValues,
  type EstadoReserva,
  type ReservaDto,
} from "@/modules/reservas/models/Reserva";
import { useGetTurnos } from "@/modules/turnos/hooks/turnosHooks";
import { useGetZonas } from "@/modules/zonas/hooks/zonasHooks";

type ReservaFormValues = ReservaDto & { zonaId: number };

const defaultValues: ReservaFormValues = { ...reservaDefaultValues, zonaId: 0 };

export function CreateReserva() {
  const [open, setOpen] = useState(false);
  const [fecha, setFecha] = useState("");
  const [turnoId, setTurnoId] = useState(0);
  const [zonaId, setZonaId] = useState(0);
  const { data: clientes = [] } = useGetClientes();
  const { data: turnos = [] } = useGetTurnos();
  const { data: zonas = [] } = useGetZonas();
  const createReservaMutation = useCreateReserva();
  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      await createReservaMutation.mutateAsync({
        fecha: value.fecha,
        capacidad: value.capacidad,
        clienteId: value.clienteId,
        mesaId: value.mesaId,
        turnoId: value.turnoId,
        estado: value.estado,
      });
      form.reset();
      setFecha("");
      setTurnoId(0);
      setZonaId(0);
      setOpen(false);
    },
  });
  const { data: mesasDisponibles = [], isFetching: isFetchingMesas } =
    useGetMesasDisponiblesPorTurno(fecha, turnoId);
  const mesasPorZona = mesasDisponibles.filter(
    (mesa) => mesa.zonaId === zonaId,
  );

  function getMesaPlaceholder() {
    if (!fecha || !turnoId) return "Selecciona fecha y turno primero";
    if (zonaId === 0) return "Selecciona una zona primero";
    if (isFetchingMesas) return "Consultando mesas...";
    if (mesasPorZona.length === 0) return "No hay mesas disponibles en esta zona";
    return "Selecciona una mesa";
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>Crear reserva</Button>
      <Sheet
        open={open}
        onOpenChange={(value) => {
          setOpen(value);
          if (!value) {
            form.reset();
            setFecha("");
            setTurnoId(0);
            setZonaId(0);
          }
        }}
      >
        <SheetContent className="flex flex-col p-0 sm:max-w-lg">
          <SheetHeader className="border-b p-5 pr-12">
            <SheetTitle>Crear reserva</SheetTitle>
            <SheetDescription>
              Selecciona fecha, turno y mesa disponible. Las horas se toman del
              turno.
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
                  <Field label="Fecha" htmlFor="create-reserva-fecha">
                    <Input
                      id="create-reserva-fecha"
                      type="date"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) => {
                        field.handleChange(event.target.value);
                        setFecha(event.target.value);
                        form.setFieldValue("mesaId", 0);
                      }}
                      required
                    />
                  </Field>
                )}
              </form.Field>

              <form.Field name="clienteId">
                {(field) => (
                  <Field label="Cliente" htmlFor="create-reserva-clienteId">
                    <Select
                      value={field.state.value ? String(field.state.value) : ""}
                      onValueChange={(value) =>
                        field.handleChange(Number(value))
                      }
                    >
                      <SelectTrigger
                        id="create-reserva-clienteId"
                        className="w-full"
                      >
                        <SelectValue placeholder="Selecciona un cliente" />
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
                  <Field label="Turno" htmlFor="create-reserva-turnoId">
                    <Select
                      value={field.state.value ? String(field.state.value) : ""}
                      onValueChange={(value) => {
                        field.handleChange(Number(value));
                        setTurnoId(Number(value));
                        form.setFieldValue("mesaId", 0);
                      }}
                    >
                      <SelectTrigger
                        id="create-reserva-turnoId"
                        className="w-full"
                      >
                        <SelectValue placeholder="Selecciona turno" />
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
                  <Field label="Personas" htmlFor="create-reserva-capacidad">
                    <Input
                      id="create-reserva-capacidad"
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
                  <Field label="Zona" htmlFor="create-reserva-zonaId">
                    <Select
                      value={field.state.value ? String(field.state.value) : ""}
                      onValueChange={(value) => {
                        field.handleChange(Number(value));
                        setZonaId(Number(value));
                        form.setFieldValue("mesaId", 0);
                      }}
                    >
                      <SelectTrigger
                        id="create-reserva-zonaId"
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
                  <Field label="Mesa disponible" htmlFor="create-reserva-mesaId">
                    <Select
                      value={field.state.value ? String(field.state.value) : ""}
                      onValueChange={(value) =>
                        field.handleChange(Number(value))
                      }
                      disabled={
                        !fecha ||
                        !turnoId ||
                        zonaId === 0 ||
                        isFetchingMesas ||
                        mesasPorZona.length === 0
                      }
                    >
                      <SelectTrigger
                        id="create-reserva-mesaId"
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
                    {fecha &&
                    turnoId > 0 &&
                    zonaId > 0 &&
                    !isFetchingMesas &&
                    mesasPorZona.length === 0 ? (
                      <span className="text-xs text-muted-foreground">
                        No hay mesas libres para esa fecha, turno y zona.
                      </span>
                    ) : null}
                  </Field>
                )}
              </form.Field>

              <form.Field name="estado">
                {(field) => (
                  <Field label="Estado" htmlFor="create-reserva-estado">
                    <Select
                      value={String(field.state.value)}
                      onValueChange={(value) =>
                        field.handleChange(Number(value) as EstadoReserva)
                      }
                    >
                      <SelectTrigger
                        id="create-reserva-estado"
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

              {createReservaMutation.error ? (
                <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {createReservaMutation.error.message}
                </p>
              ) : null}
            </div>
            <SheetFooter className="border-t p-5">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={createReservaMutation.isPending}
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
                      createReservaMutation.isPending ||
                      !state.values.fecha ||
                      !state.values.clienteId ||
                      !state.values.turnoId ||
                      !state.values.mesaId ||
                      !state.values.capacidad
                    }
                  >
                    {state.isSubmitting || createReservaMutation.isPending
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

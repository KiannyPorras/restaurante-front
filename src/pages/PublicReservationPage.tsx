import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "@/lib/form";
import type { Cliente } from "@/modules/clientes/models/Cliente";
import { useCreateCliente } from "@/modules/clientes/hooks/clientesHooks";
import { getClienteByCedula } from "@/modules/clientes/services/clientesServices";
import { useCreateListaEspera } from "@/modules/listas-espera/hooks/listasEsperaHooks";
import { useGetMesasDisponiblesPorTurno } from "@/modules/reservas/hooks/reservasHooks";
import { useGetTurnos } from "@/modules/turnos/hooks/turnosHooks";
import { useGetZonas } from "@/modules/zonas/hooks/zonasHooks";

const inputClassName = "h-11";

const defaultValues = {
  nombre: "",
  apellido: "",
  email: "",
  telefono: 0,
  cedula: 0,
  fecha: new Date().toISOString().slice(0, 10),
  turnoId: 0,
  zonaId: 0,
  mesaId: 0,
  cantidad: 2,
};

const CLIENTE_NOT_FOUND_MESSAGE =
  "No encontramos esa cédula. Completa tus datos para registrarte.";
const CLIENTE_FOUND_MESSAGE =
  "Cliente encontrado. Ya puedes completar tu solicitud de reserva.";

export function PublicReservationPage() {
  const navigate = useNavigate();
  const [clienteEncontrado, setClienteEncontrado] = useState<Cliente | null>(
    null,
  );
  const [clienteBuscado, setClienteBuscado] = useState(false);
  const [clienteMessage, setClienteMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [cedula, setCedula] = useState(0);
  const [fecha, setFecha] = useState(defaultValues.fecha);
  const [turnoId, setTurnoId] = useState(0);
  const [zonaId, setZonaId] = useState(0);
  const [cantidad, setCantidad] = useState(defaultValues.cantidad);
  const { data: turnos = [] } = useGetTurnos();
  const { data: zonas = [] } = useGetZonas();
  const createClienteMutation = useCreateCliente();
  const createListaEsperaMutation = useCreateListaEspera();

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      if (!clienteBuscado) return;

      const cliente =
        clienteEncontrado ??
        (await createClienteMutation.mutateAsync({
          nombre: value.nombre.trim(),
          apellido: value.apellido.trim(),
          email: value.email.trim(),
          telefono: value.telefono,
          cedula: value.cedula,
        }));

      await createListaEsperaMutation.mutateAsync({
        clienteId: cliente.id,
        fecha: value.fecha,
        cantidad: value.cantidad,
        turnoId: value.turnoId,
        zonaId: value.zonaId,
        mesaId: value.mesaId,
      });

      setSuccessMessage(
        "Solicitud recibida. El administrador revisará y confirmará tu reserva.",
      );
      setClienteEncontrado(cliente);
      setClienteBuscado(true);
      setClienteMessage(CLIENTE_FOUND_MESSAGE);
      await navigate({ to: "/" });
    },
  });

  const { data: mesasDisponibles = [], isFetching: isFetchingMesas } =
    useGetMesasDisponiblesPorTurno(fecha, turnoId);
  const mesasFiltradas = mesasDisponibles.filter(
    (mesa) => mesa.zonaId === zonaId && mesa.capacidad >= cantidad,
  );
  const clienteBloqueado = Boolean(clienteEncontrado);
  const selectedZona = zonas.find((zona) => zona.id === zonaId);

  function getMesaPlaceholder() {
    if (!fecha || !turnoId) return "Selecciona fecha y turno primero";
    if (zonaId === 0) return "Selecciona una zona primero";
    if (isFetchingMesas) return "Consultando mesas disponibles...";
    if (mesasFiltradas.length === 0)
      return "No hay mesas disponibles en esta zona";
    return "Selecciona tu mesa preferida";
  }

  const resetClienteBusqueda = () => {
    setClienteEncontrado(null);
    setClienteBuscado(false);
    setClienteMessage("");
    setSuccessMessage("");
  };

  const buscarCliente = async () => {
    if (!cedula) return;

    setIsSearching(true);
    setClienteMessage("");
    const cliente = await getClienteByCedula(cedula);

    if (!cliente) {
      setClienteEncontrado(null);
      setClienteBuscado(true);
      setClienteMessage(CLIENTE_NOT_FOUND_MESSAGE);
      setIsSearching(false);
      return;
    }

    setClienteEncontrado(cliente);
    setClienteBuscado(true);
    setClienteMessage(CLIENTE_FOUND_MESSAGE);
    form.setFieldValue("nombre", cliente.nombre);
    form.setFieldValue("apellido", cliente.apellido);
    form.setFieldValue("email", cliente.email);
    form.setFieldValue("telefono", cliente.telefono);
    form.setFieldValue("cedula", cliente.cedula);
    setIsSearching(false);
  };

  return (
    <main className="min-h-svh bg-[radial-gradient(circle_at_top_left,_rgba(244,114,182,0.22),_transparent_30%),linear-gradient(135deg,_#020617_0%,_#111827_45%,_#3f1d1d_100%)] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-2xl justify-center">
        <Card className="border-white/15 bg-background/95 text-foreground shadow-2xl backdrop-blur">
          <CardContent className="p-5 sm:p-7">
            <h1 className="text-2xl font-semibold tracking-tight">
              Solicitar reserva
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Completa tus datos y los detalles de la reserva.
            </p>
            <form
              className="mt-6 grid gap-6"
              onSubmit={(event) => {
                event.preventDefault();
                event.stopPropagation();
                void form.handleSubmit();
              }}
            >
              <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                <form.Field name="cedula">
                  {(field) => (
                    <Field label="Cédula" htmlFor="public-reservation-cedula">
                      <Input
                        id="public-reservation-cedula"
                        className={inputClassName}
                        type="number"
                        value={field.state.value || ""}
                        onBlur={() => {
                          field.handleBlur();
                          void buscarCliente();
                        }}
                        onChange={(event) => {
                          const value = Number(event.target.value);
                          field.handleChange(value);
                          setCedula(value);
                          resetClienteBusqueda();
                        }}
                        required
                      />
                    </Field>
                  )}
                </form.Field>
                <Button
                  type="button"
                  className="self-end"
                  variant="outline"
                  onClick={() => void buscarCliente()}
                  disabled={!cedula || isSearching}
                >
                  <Search className="size-4" />
                  {isSearching ? "Buscando..." : "Buscar"}
                </Button>
              </div>

              {clienteMessage ? (
                <p className="rounded-md border bg-muted px-3 py-2 text-sm text-muted-foreground">
                  {clienteMessage}
                </p>
              ) : null}

              <div className="grid gap-4 sm:grid-cols-2">
                <form.Field name="nombre">
                  {(field) => (
                    <Field label="Nombre" htmlFor="public-reservation-nombre">
                      <Input
                        id="public-reservation-nombre"
                        className={inputClassName}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(event) =>
                          field.handleChange(event.target.value)
                        }
                        disabled={clienteBloqueado}
                        required
                      />
                    </Field>
                  )}
                </form.Field>
                <form.Field name="apellido">
                  {(field) => (
                    <Field
                      label="Apellido"
                      htmlFor="public-reservation-apellido"
                    >
                      <Input
                        id="public-reservation-apellido"
                        className={inputClassName}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(event) =>
                          field.handleChange(event.target.value)
                        }
                        disabled={clienteBloqueado}
                        required
                      />
                    </Field>
                  )}
                </form.Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <form.Field name="email">
                  {(field) => (
                    <Field label="Email" htmlFor="public-reservation-email">
                      <Input
                        id="public-reservation-email"
                        className={inputClassName}
                        type="email"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(event) =>
                          field.handleChange(event.target.value)
                        }
                        disabled={clienteBloqueado}
                        required
                      />
                    </Field>
                  )}
                </form.Field>
                <form.Field name="telefono">
                  {(field) => (
                    <Field
                      label="Teléfono"
                      htmlFor="public-reservation-telefono"
                    >
                      <Input
                        id="public-reservation-telefono"
                        className={inputClassName}
                        type="number"
                        value={field.state.value || ""}
                        onBlur={field.handleBlur}
                        onChange={(event) =>
                          field.handleChange(Number(event.target.value))
                        }
                        disabled={clienteBloqueado}
                        required
                      />
                    </Field>
                  )}
                </form.Field>
              </div>

              <form.Field name="fecha">
                {(field) => (
                  <Field label="Fecha" htmlFor="public-reservation-fecha">
                    <Input
                      id="public-reservation-fecha"
                      className={inputClassName}
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

              <div className="grid gap-4 sm:grid-cols-2">
                <form.Field name="turnoId">
                  {(field) => (
                    <Field label="Turno" htmlFor="public-reservation-turno">
                      <Select
                        value={
                          field.state.value ? String(field.state.value) : ""
                        }
                        onValueChange={(value) => {
                          field.handleChange(Number(value));
                          setTurnoId(Number(value));
                          form.setFieldValue("mesaId", 0);
                        }}
                      >
                        <SelectTrigger
                          id="public-reservation-turno"
                          className="h-11 w-full"
                        >
                          <SelectValue placeholder="Selecciona un turno" />
                        </SelectTrigger>
                        <SelectContent>
                          {turnos.map((turno) => (
                            <SelectItem
                              key={turno.id}
                              value={String(turno.id)}
                            >
                              {turno.nombre} ({turno.horaInicio} -{" "}
                              {turno.horaFin})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                  )}
                </form.Field>
                <form.Field name="cantidad">
                  {(field) => (
                    <Field
                      label="Personas"
                      htmlFor="public-reservation-cantidad"
                    >
                      <Input
                        id="public-reservation-cantidad"
                        className={inputClassName}
                        type="number"
                        min={1}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(event) => {
                          const value = Number(event.target.value);
                          field.handleChange(value);
                          setCantidad(value);
                          form.setFieldValue("mesaId", 0);
                        }}
                        required
                      />
                    </Field>
                  )}
                </form.Field>
              </div>

              <form.Field name="zonaId">
                {(field) => (
                  <Field label="Zona" htmlFor="public-reservation-zona">
                    <Select
                      value={
                        field.state.value ? String(field.state.value) : ""
                      }
                      onValueChange={(value) => {
                        field.handleChange(Number(value));
                        setZonaId(Number(value));
                        form.setFieldValue("mesaId", 0);
                      }}
                    >
                      <SelectTrigger
                        id="public-reservation-zona"
                        className="h-11 w-full"
                      >
                        <SelectValue placeholder="Selecciona una zona" />
                      </SelectTrigger>
                      <SelectContent>
                        {zonas
                          .filter((zona) => zona.disponibilidad)
                          .map((zona) => (
                            <SelectItem key={zona.id} value={String(zona.id)}>
                              {zona.nombre}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              </form.Field>

              {selectedZona?.photoUrl ? (
                <img
                  src={selectedZona.photoUrl}
                  alt={selectedZona.nombre}
                  className="aspect-[16/7] w-full rounded-xl border object-cover"
                />
              ) : null}

              <form.Field name="mesaId">
                {(field) => (
                  <Field label="Mesa preferida" htmlFor="public-reservation-mesa">
                    <Select
                      value={
                        field.state.value ? String(field.state.value) : ""
                      }
                      onValueChange={(value) =>
                        field.handleChange(Number(value))
                      }
                      disabled={
                        !fecha ||
                        !turnoId ||
                        !zonaId ||
                        isFetchingMesas ||
                        mesasFiltradas.length === 0
                      }
                    >
                      <SelectTrigger
                        id="public-reservation-mesa"
                        className="h-11 w-full"
                      >
                        <SelectValue placeholder={getMesaPlaceholder()} />
                      </SelectTrigger>
                      <SelectContent>
                        {mesasFiltradas.map((mesa) => (
                          <SelectItem key={mesa.id} value={String(mesa.id)}>
                            Mesa {mesa.numero} - {mesa.capacidad} personas
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              </form.Field>

              {createClienteMutation.error ||
              createListaEsperaMutation.error ? (
                <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {createClienteMutation.error?.message ||
                    createListaEsperaMutation.error?.message}
                </p>
              ) : null}
              {successMessage ? (
                <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300">
                  {successMessage}
                </p>
              ) : null}

              <form.Subscribe>
                {(state) => (
                  <Button
                    type="submit"
                    className="h-11"
                    disabled={
                      !state.canSubmit ||
                      state.isSubmitting ||
                      !clienteBuscado ||
                      !state.values.fecha ||
                      !state.values.turnoId ||
                      !state.values.zonaId ||
                      !state.values.mesaId ||
                      !state.values.cantidad ||
                      createClienteMutation.isPending ||
                      createListaEsperaMutation.isPending
                    }
                  >
                    {state.isSubmitting ||
                    createClienteMutation.isPending ||
                    createListaEsperaMutation.isPending
                      ? "Enviando solicitud..."
                      : "Solicitar reserva"}
                  </Button>
                )}
              </form.Subscribe>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

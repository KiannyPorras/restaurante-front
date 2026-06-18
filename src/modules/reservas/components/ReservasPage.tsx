import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { CalendarClock, Home, MoreHorizontal, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetClientes } from "@/modules/clientes/hooks/clientesHooks";
import { useGetMesas } from "@/modules/mesas/hooks/mesasHooks";
import { CreateReserva } from "@/modules/reservas/components/CreateReserva";
import { DeleteReserva } from "@/modules/reservas/components/DeleteReserva";
import { UpdateReserva } from "@/modules/reservas/components/UpdateReserva";
import {
  useGetReservas,
  useUpdateEstadoReserva,
} from "@/modules/reservas/hooks/reservasHooks";
import {
  ESTADOS_RESERVA,
  getEstadoReservaLabel,
  type EstadoReserva,
  type Reserva,
} from "@/modules/reservas/models/Reserva";
import { useGetTurnos } from "@/modules/turnos/hooks/turnosHooks";

const estadoClassName: Record<number, string> = {
  1: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300",
  2: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300",
  3: "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-300",
  4: "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-300",
};

export function ReservasPage() {
  const [searchInput, setSearchInput] = useState("");
  const deferredSearch = searchInput.trim().toLowerCase();
  const { data: reservas, isError, isLoading, error } = useGetReservas();
  const { data: clientes = [] } = useGetClientes();
  const { data: mesas = [] } = useGetMesas();
  const { data: turnos = [] } = useGetTurnos();
  const getClienteNombre = (clienteId: number) => {
    const cliente = clientes.find((item) => item.id === clienteId);
    return cliente ? `${cliente.nombre} ${cliente.apellido}` : undefined;
  };
  const getMesaNombre = (mesaId: number) => {
    const mesa = mesas.find((item) => item.id === mesaId);
    return mesa ? `Mesa ${mesa.numero}` : undefined;
  };
  const getTurnoNombre = (turnoId: number) => {
    const turno = turnos.find((item) => item.id === turnoId);
    return turno?.nombre;
  };
  const filteredReservas = reservas?.filter((reserva) => {
    const searchable = [
      reserva.id,
      reserva.fecha,
      getClienteNombre(reserva.clienteId),
      getMesaNombre(reserva.mesaId),
      getTurnoNombre(reserva.turnoId),
      getEstadoReservaLabel(reserva.estado),
    ]
      .join(" ")
      .toLowerCase();

    return searchable.includes(deferredSearch);
  });

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              as={Link}
              className="flex items-center gap-1.5"
              to="/dashboard"
            >
              <Home className="size-3.5" />
              Inicio
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Reservas</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Gestión de Reservas
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {reservas
              ? `${filteredReservas?.length ?? 0} de ${reservas.length} reservas registradas`
              : "Administra reservas por fecha, turno y mesa"}
          </p>
        </div>
        <CreateReserva />
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Buscar por cliente, mesa, turno, fecha o estado..."
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
        />
      </div>

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="grid gap-3 p-4">
              {[1, 2, 3, 4].map((index) => (
                <Skeleton key={index} className="h-16 w-full" />
              ))}
            </div>
          ) : null}
          {isError ? (
            <div className="p-4">
              <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error.message}
              </p>
            </div>
          ) : null}
          {!isLoading && filteredReservas?.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16">
              <div className="flex size-14 items-center justify-center rounded-full bg-muted">
                <CalendarClock className="size-7 text-muted-foreground/40" />
              </div>
              <p className="text-sm font-medium">No se encontraron reservas</p>
            </div>
          ) : null}
          {!isLoading && filteredReservas && filteredReservas.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead>Reserva</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Mesa</TableHead>
                  <TableHead>Turno</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReservas.map((reserva) => (
                  <TableRow key={reserva.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                          <CalendarClock className="size-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">
                            #{reserva.id} · {reserva.fecha}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {reserva.horaInicio} - {reserva.horaFin} ·{" "}
                            {reserva.capacidad} personas
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getClienteNombre(reserva.clienteId) ??
                        `Cliente #${reserva.clienteId}`}
                    </TableCell>
                    <TableCell>
                      {getMesaNombre(reserva.mesaId) ??
                        `Mesa #${reserva.mesaId}`}
                    </TableCell>
                    <TableCell>
                      {getTurnoNombre(reserva.turnoId) ??
                        `Turno #${reserva.turnoId}`}
                    </TableCell>
                    <TableCell>
                      <ReservaEstado reserva={reserva} />
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              type="button"
                              variant="ghost"
                              className="size-9 px-0"
                            >
                              <MoreHorizontal className="size-4" />
                              <span className="sr-only">Acciones</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <UpdateReserva reserva={reserva} />
                            <DropdownMenuSeparator />
                            <DeleteReserva reserva={reserva} />
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

function ReservaEstado({ reserva }: { reserva: Reserva }) {
  const updateEstadoReservaMutation = useUpdateEstadoReserva();

  return (
    <div className="flex flex-col gap-2">
      <Badge variant="outline" className={estadoClassName[reserva.estado]}>
        {getEstadoReservaLabel(reserva.estado)}
      </Badge>
      <Select
        value={String(reserva.estado)}
        disabled={updateEstadoReservaMutation.isPending}
        onValueChange={(value) =>
          updateEstadoReservaMutation.mutate({
            id: reserva.id,
            estado: Number(value) as EstadoReserva,
          })
        }
      >
        <SelectTrigger className="w-full">
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
    </div>
  );
}

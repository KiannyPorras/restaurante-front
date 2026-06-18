import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ClipboardList, Home } from "lucide-react";
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
import {
  useGetListasEspera,
  usePromoverListaEspera,
} from "@/modules/listas-espera/hooks/listasEsperaHooks";
import type { ListaEspera } from "@/modules/listas-espera/models/ListaEspera";
import { useGetMesas } from "@/modules/mesas/hooks/mesasHooks";
import { useGetTurnos } from "@/modules/turnos/hooks/turnosHooks";
import { useGetZonas } from "@/modules/zonas/hooks/zonasHooks";

export function ListasEsperaPage() {
  const { data: solicitudes, isLoading, isError, error } = useGetListasEspera();
  const { data: clientes = [] } = useGetClientes();
  const { data: mesas = [] } = useGetMesas();
  const { data: zonas = [] } = useGetZonas();
  const { data: turnos = [] } = useGetTurnos();
  const getClienteNombre = (clienteId: number) => {
    const cliente = clientes.find((item) => item.id === clienteId);
    return cliente ? `${cliente.nombre} ${cliente.apellido}` : undefined;
  };
  const getZonaNombre = (zonaId: number) => {
    const zona = zonas.find((item) => item.id === zonaId);
    return zona?.nombre;
  };
  const getTurnoNombre = (turnoId: number) => {
    const turno = turnos.find((item) => item.id === turnoId);
    return turno?.nombre;
  };

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
            <BreadcrumbPage>Lista de espera</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Solicitudes por confirmar
        </h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Promueve solicitudes públicas a reservas confirmadas.
        </p>
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
          {!isLoading && solicitudes?.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16">
              <div className="flex size-14 items-center justify-center rounded-full bg-muted">
                <ClipboardList className="size-7 text-muted-foreground/40" />
              </div>
              <p className="text-sm font-medium">
                No hay solicitudes pendientes
              </p>
            </div>
          ) : null}
          {!isLoading && solicitudes && solicitudes.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead>Cliente</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Turno</TableHead>
                  <TableHead>Preferencia</TableHead>
                  <TableHead className="text-right">Confirmar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {solicitudes.map((solicitud) => (
                  <SolicitudRow
                    key={solicitud.id}
                    solicitud={solicitud}
                    clienteNombre={
                      getClienteNombre(solicitud.clienteId) ??
                      `Cliente #${solicitud.clienteId}`
                    }
                    zonaNombre={
                      solicitud.zonaId
                        ? (getZonaNombre(solicitud.zonaId) ??
                          `Zona #${solicitud.zonaId}`)
                        : "Sin zona"
                    }
                    turnoNombre={
                      getTurnoNombre(solicitud.turnoId) ??
                      `Turno #${solicitud.turnoId}`
                    }
                    mesas={mesas.filter(
                      (mesa) =>
                        (!solicitud.zonaId ||
                          mesa.zonaId === solicitud.zonaId) &&
                        mesa.capacidad >= solicitud.cantidad,
                    )}
                  />
                ))}
              </TableBody>
            </Table>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

function SolicitudRow({
  solicitud,
  clienteNombre,
  zonaNombre,
  turnoNombre,
  mesas,
}: {
  solicitud: ListaEspera;
  clienteNombre: string;
  zonaNombre: string;
  turnoNombre: string;
  mesas: { id: number; numero: number; capacidad: number }[];
}) {
  const [mesaId, setMesaId] = useState(solicitud.mesaId ?? 0);
  const promoverMutation = usePromoverListaEspera();

  return (
    <TableRow>
      <TableCell>
        <p className="font-medium">{clienteNombre}</p>
        <p className="text-xs text-muted-foreground">
          {solicitud.cantidad} personas
        </p>
      </TableCell>
      <TableCell>{solicitud.fecha}</TableCell>
      <TableCell>
        {turnoNombre}
        <p className="text-xs text-muted-foreground">
          {solicitud.horaInicio} - {solicitud.horaFin}
        </p>
      </TableCell>
      <TableCell>{zonaNombre}</TableCell>
      <TableCell>
        <div className="flex justify-end gap-2">
          <Select
            value={mesaId ? String(mesaId) : ""}
            onValueChange={(value) => setMesaId(Number(value))}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Mesa" />
            </SelectTrigger>
            <SelectContent>
              {mesas.map((mesa) => (
                <SelectItem key={mesa.id} value={String(mesa.id)}>
                  Mesa {mesa.numero} ({mesa.capacidad})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            type="button"
            disabled={!mesaId || promoverMutation.isPending}
            onClick={() =>
              promoverMutation.mutate({ listaEsperaId: solicitud.id, mesaId })
            }
          >
            Confirmar
          </Button>
        </div>
        {promoverMutation.error ? (
          <p className="mt-2 text-right text-xs text-destructive">
            {promoverMutation.error.message}
          </p>
        ) : null}
      </TableCell>
    </TableRow>
  );
}

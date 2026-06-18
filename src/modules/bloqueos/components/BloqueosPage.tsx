import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Ban, Home, MoreHorizontal, Search } from "lucide-react";
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CreateBloqueo } from "@/modules/bloqueos/components/CreateBloqueo";
import { DeleteBloqueo } from "@/modules/bloqueos/components/DeleteBloqueo";
import { UpdateBloqueo } from "@/modules/bloqueos/components/UpdateBloqueo";
import { useGetBloqueos } from "@/modules/bloqueos/hooks/bloqueosHooks";
import { useGetMesas } from "@/modules/mesas/hooks/mesasHooks";

export function BloqueosPage() {
  const [searchInput, setSearchInput] = useState("");
  const deferredSearch = searchInput.trim().toLowerCase();
  const { data: bloqueos, isError, isLoading, error } = useGetBloqueos();
  const { data: mesas = [] } = useGetMesas();
  const getMesa = (mesaId: number) =>
    mesas.find((item) => item.id === mesaId);
  const filteredBloqueos = bloqueos?.filter((bloqueo) => {
    const mesa = getMesa(bloqueo.mesaId);
    const searchTarget = [
      bloqueo.motivo,
      bloqueo.fecha,
      mesa ? `mesa ${mesa.numero}` : "",
    ]
      .join(" ")
      .toLowerCase();

    return searchTarget.includes(deferredSearch);
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
            <BreadcrumbPage>Bloqueos</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Gestión de Bloqueos
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {bloqueos
              ? `${filteredBloqueos?.length ?? 0} de ${bloqueos.length} bloqueos registrados`
              : "Administra los bloqueos de mesas por fecha y horario"}
          </p>
        </div>
        <CreateBloqueo mesas={mesas} />
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Buscar por motivo, fecha o mesa..."
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
          {!isLoading && filteredBloqueos?.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16">
              <div className="flex size-14 items-center justify-center rounded-full bg-muted">
                <Ban className="size-7 text-muted-foreground/40" />
              </div>
              <p className="text-sm font-medium">No se encontraron bloqueos</p>
            </div>
          ) : null}
          {!isLoading && filteredBloqueos && filteredBloqueos.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead>Mesa</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Horario</TableHead>
                  <TableHead>Motivo</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBloqueos.map((bloqueo) => {
                  const mesa = getMesa(bloqueo.mesaId);

                  return (
                    <TableRow key={bloqueo.id}>
                      <TableCell className="font-medium">
                        {mesa
                          ? `Mesa ${mesa.numero}`
                          : `Mesa #${bloqueo.mesaId}`}
                      </TableCell>
                      <TableCell>{bloqueo.fecha}</TableCell>
                      <TableCell>
                        {bloqueo.horaInicio} - {bloqueo.horaFin}
                      </TableCell>
                      <TableCell>{bloqueo.motivo}</TableCell>
                      <TableCell className="text-right">
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
                            <UpdateBloqueo bloqueo={bloqueo} mesas={mesas} />
                            <DropdownMenuSeparator />
                            <DeleteBloqueo bloqueo={bloqueo} />
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

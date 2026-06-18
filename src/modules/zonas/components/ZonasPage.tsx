import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Home,
  ImageIcon,
  MoreHorizontal,
  Search,
  MapPinned,
} from "lucide-react";
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CreateZona } from "@/modules/zonas/components/CreateZona";
import { DeleteZona } from "@/modules/zonas/components/DeleteZona";
import { UpdateZona } from "@/modules/zonas/components/UpdateZona";
import { useGetZonas } from "@/modules/zonas/hooks/zonasHooks";

export function ZonasPage() {
  const [searchInput, setSearchInput] = useState("");
  const deferredSearch = searchInput.trim().toLowerCase();
  const { data: zonas, isError, isLoading, error } = useGetZonas();
  const filteredZonas = zonas?.filter((zona) =>
    zona.nombre.toLowerCase().includes(deferredSearch),
  );

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
            <BreadcrumbPage>Zonas</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Gestion de Zonas
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {zonas
              ? `${filteredZonas?.length ?? 0} de ${zonas.length} zonas registradas`
              : "Administra las zonas del restaurante"}
          </p>
        </div>
        <CreateZona />
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Buscar por nombre..."
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
          {!isLoading && filteredZonas?.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16">
              <div className="flex size-14 items-center justify-center rounded-full bg-muted">
                <MapPinned className="size-7 text-muted-foreground/40" />
              </div>
              <p className="text-sm font-medium">No se encontraron zonas</p>
            </div>
          ) : null}
          {!isLoading && filteredZonas && filteredZonas.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead>Zona</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredZonas.map((zona) => (
                  <TableRow key={zona.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted">
                          {zona.photoUrl ? (
                            <img
                              src={zona.photoUrl}
                              alt={zona.nombre}
                              className="size-full object-cover"
                            />
                          ) : (
                            <ImageIcon className="size-5 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{zona.nombre}</p>
                          <p className="text-xs text-muted-foreground">
                            Photo URL configurable
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          zona.disponibilidad
                            ? "border-green-200 bg-green-100 text-green-700"
                            : "border-red-200 bg-red-100 text-red-700"
                        }
                      >
                        {zona.disponibilidad ? "Disponible" : "No disponible"}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      #{zona.id}
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
                            <UpdateZona zona={zona} />
                            <DropdownMenuSeparator />
                            <DeleteZona zona={zona} />
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

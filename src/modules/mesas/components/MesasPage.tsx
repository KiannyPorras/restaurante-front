import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Armchair,
  CalendarDays,
  Clock,
  Grid2X2,
  Home,
  ImageIcon,
  MoreHorizontal,
  Search,
  Table2,
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CreateMesa } from "@/modules/mesas/components/CreateMesa";
import { DeleteMesa } from "@/modules/mesas/components/DeleteMesa";
import { UpdateMesa } from "@/modules/mesas/components/UpdateMesa";
import {
  useGetMesas,
  useMoveMesaPosition,
} from "@/modules/mesas/hooks/mesasHooks";
import type { Mesa } from "@/modules/mesas/models/Mesa";
import { useGetZonas } from "@/modules/zonas/hooks/zonasHooks";
import type { Zona } from "@/modules/zonas/models/Zona";

const EMPTY_ZONAS: Zona[] = [];
const DATE_FORMATTER = new Intl.DateTimeFormat("es", { dateStyle: "medium" });
const TIME_FORMATTER = new Intl.DateTimeFormat("es", {
  hour: "numeric",
  minute: "2-digit",
});

function useClientNowLabel() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(interval);
  }, []);

  return {
    date: DATE_FORMATTER.format(now),
    time: TIME_FORMATTER.format(now),
  };
}

type ViewMode = "table" | "map";

export function MesasPage() {
  const [searchInput, setSearchInput] = useState("");
  const [selectedMesa, setSelectedMesa] = useState<Mesa | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [croquisZonaId, setCroquisZonaId] = useState("all");
  const deferredSearch = searchInput.trim().toLowerCase();
  const { data: mesas, isError, isLoading, error } = useGetMesas();
  const { data: zonas = [] } = useGetZonas();
  const moveMesaPositionMutation = useMoveMesaPosition();
  const zonaById = new Map(zonas.map((zona) => [zona.id, zona.nombre]));
  const filteredMesas = mesas?.filter((mesa) =>
    `${mesa.numero} ${mesa.capacidad} ${zonaById.get(mesa.zonaId) ?? ""}`
      .toLowerCase()
      .includes(deferredSearch),
  );
  const croquisMesas = filteredMesas?.filter(
    (mesa) => croquisZonaId === "all" || mesa.zonaId === Number(croquisZonaId),
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
            <BreadcrumbPage>Mesas</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Gestion de Mesas
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {mesas
              ? `${filteredMesas?.length ?? 0} de ${mesas.length} mesas registradas`
              : "Administra mesas y sus fotos"}
          </p>
        </div>
        <CreateMesa zonas={zonas} />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Buscar por numero, capacidad o zona..."
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
          />
        </div>
        <div className="inline-flex rounded-md border bg-background p-1">
          <Button
            type="button"
            variant={viewMode === "table" ? "default" : "ghost"}
            className="h-8 gap-2 px-3"
            onClick={() => setViewMode("table")}
          >
            <Table2 className="size-4" />
            Tabla
          </Button>
          <Button
            type="button"
            variant={viewMode === "map" ? "default" : "ghost"}
            className="h-8 gap-2 px-3"
            onClick={() => setViewMode("map")}
          >
            <Grid2X2 className="size-4" />
            Croquis
          </Button>
        </div>
      </div>

      {viewMode === "map" ? (
        <div className="flex flex-col gap-2 rounded-lg border bg-card p-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium">Filtrar croquis por zona</p>
            <p className="text-xs text-muted-foreground">
              Muestra solo las mesas pertenecientes a una zona.
            </p>
          </div>
          <select
            className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring sm:w-64"
            value={croquisZonaId}
            onChange={(event) => setCroquisZonaId(event.target.value)}
          >
            <option value="all">Todas las zonas</option>
            {zonas.map((zona) => (
              <option key={zona.id} value={zona.id}>
                {zona.nombre}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="grid gap-3 p-4">
              {Array.from({ length: 4 }).map((_, index) => (
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
          {!isLoading &&
          (viewMode === "map"
            ? croquisMesas?.length === 0
            : filteredMesas?.length === 0) ? (
            <div className="flex flex-col items-center gap-3 py-16">
              <div className="flex size-14 items-center justify-center rounded-full bg-muted">
                <Armchair className="size-7 text-muted-foreground/40" />
              </div>
              <p className="text-sm font-medium">No se encontraron mesas</p>
            </div>
          ) : null}
          {!isLoading &&
          filteredMesas &&
          filteredMesas.length > 0 &&
          viewMode === "table" ? (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead>Mesa</TableHead>
                  <TableHead>Capacidad</TableHead>
                  <TableHead>Zona</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMesas.map((mesa) => (
                  <TableRow key={mesa.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted">
                          {mesa.photoUrl ? (
                            <img
                              src={mesa.photoUrl}
                              alt={`Mesa ${mesa.numero}`}
                              className="size-full object-cover"
                            />
                          ) : (
                            <ImageIcon className="size-5 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">Mesa {mesa.numero}</p>
                          <p className="text-xs text-muted-foreground">
                            Photo URL configurable
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{mesa.capacidad} personas</TableCell>
                    <TableCell className="text-muted-foreground">
                      {zonaById.get(mesa.zonaId) ?? `Zona #${mesa.zonaId}`}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      #{mesa.id}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end">
                        <MesaActions mesa={mesa} zonas={zonas} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : null}
          {!isLoading &&
          croquisMesas &&
          croquisMesas.length > 0 &&
          viewMode === "map" ? (
            <FloorPlan
              mesas={croquisMesas}
              zonaById={zonaById}
              onSelectMesa={setSelectedMesa}
              onMoveMesa={(mesa, posicionX, posicionY) =>
                moveMesaPositionMutation.mutate({ mesa, posicionX, posicionY })
              }
            />
          ) : null}
        </CardContent>
      </Card>

      {selectedMesa ? (
        <MesaDetailSheet
          mesa={selectedMesa}
          zonaNombre={
            zonaById.get(selectedMesa.zonaId) ?? `Zona #${selectedMesa.zonaId}`
          }
          zonas={zonas}
          onClose={() => setSelectedMesa(null)}
        />
      ) : null}
    </div>
  );
}

type MesaActionsProps = {
  mesa: Mesa;
  zonas: ReturnType<typeof useGetZonas>["data"];
};

function MesaActions({ mesa, zonas = EMPTY_ZONAS }: MesaActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="ghost" className="size-9 px-0">
          <MoreHorizontal className="size-4" />
          <span className="sr-only">Acciones</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <UpdateMesa mesa={mesa} zonas={zonas} />
        <DropdownMenuSeparator />
        <DeleteMesa mesa={mesa} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

type FloorPlanProps = {
  mesas: Mesa[];
  zonaById: Map<number, string>;
  onSelectMesa: (mesa: Mesa) => void;
  onMoveMesa: (mesa: Mesa, posicionX: number, posicionY: number) => void;
};

const tablePositions = [
  { left: 10, top: 10 },
  { left: 27, top: 10 },
  { left: 44, top: 10 },
  { left: 61, top: 10 },
  { left: 16, top: 34 },
  { left: 31, top: 34 },
  { left: 46, top: 34 },
  { left: 61, top: 34 },
  { left: 51, top: 55 },
  { left: 68, top: 55 },
  { left: 35, top: 75 },
  { left: 51, top: 75 },
  { left: 67, top: 75 },
  { left: 83, top: 75 },
];

function FloorPlan({
  mesas,
  zonaById,
  onSelectMesa,
  onMoveMesa,
}: FloorPlanProps) {
  const sortedMesas = mesas.toSorted((a, b) => a.numero - b.numero);
  const floorRef = useRef<HTMLDivElement>(null);
  const draggingMesaIdRef = useRef<number | null>(null);
  const nowLabel = useClientNowLabel();
  const [positions, setPositions] = useState<
    Record<number, { left: number; top: number }>
  >(() => {
    return Object.fromEntries(
      sortedMesas.map((mesa, index) => [
        mesa.id,
        {
          left:
            mesa.posicionX ??
            tablePositions[index % tablePositions.length].left,
          top:
            mesa.posicionY ?? tablePositions[index % tablePositions.length].top,
        },
      ]),
    );
  });

  const moveMesa = (mesaId: number, clientX: number, clientY: number) => {
    const floor = floorRef.current;

    if (!floor) {
      return;
    }

    const rect = floor.getBoundingClientRect();
    const left = Math.min(
      94,
      Math.max(6, ((clientX - rect.left) / rect.width) * 100),
    );
    const top = Math.min(
      92,
      Math.max(8, ((clientY - rect.top) / rect.height) * 100),
    );

    setPositions((current) => ({ ...current, [mesaId]: { left, top } }));
  };

  const stopDragging = () => {
    if (draggingMesaIdRef.current == null) {
      return;
    }

    const mesa = sortedMesas.find(
      (item) => item.id === draggingMesaIdRef.current,
    );
    const position = positions[draggingMesaIdRef.current];

    if (mesa && position) {
      onMoveMesa(mesa, position.left, position.top);
    }

    draggingMesaIdRef.current = null;
  };

  return (
    <div className="grid min-h-[680px] bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100 lg:grid-cols-[18rem_1fr]">
      <aside className="border-b bg-background lg:border-b-0 lg:border-r">
        <div className="border-b p-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <div className="rounded-full border bg-background py-2 pl-9 pr-4 text-sm text-muted-foreground">
              Buscar mesa
            </div>
          </div>
        </div>
        <div className="divide-y">
          {sortedMesas.map((mesa) => (
            <div
              key={mesa.id}
              className="flex items-center justify-between gap-4 p-4"
            >
              <div className="min-w-0">
                <p className="truncate font-semibold">Mesa {mesa.numero}</p>
                <p className="text-sm text-muted-foreground">
                  {mesa.capacidad} personas,{" "}
                  {zonaById.get(mesa.zonaId) ?? `Zona #${mesa.zonaId}`}
                </p>
                <Badge className="mt-2 border-blue-200 bg-blue-100 text-blue-700">
                  ACTIVA
                </Badge>
              </div>
              <div className="text-right text-sm text-muted-foreground">
                <p>Ahora</p>
                <p>Libre</p>
              </div>
            </div>
          ))}
        </div>
      </aside>

      <section className="flex min-w-0 flex-col">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b bg-background px-4 py-3">
          <div className="flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium">
            <CalendarDays className="size-4" />
            Hoy
          </div>
          <div className="flex items-center gap-3 rounded-md border px-3 py-1.5 text-sm font-medium">
            <CalendarDays className="size-4" />
            {nowLabel?.date}
            <span className="h-4 w-px bg-border" />
            <Clock className="size-4" />
            {nowLabel?.time}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="inline-flex size-3 rounded-sm bg-blue-500" />
            Ocupada
            <span className="ml-2 inline-flex size-3 rounded-sm border border-blue-500 bg-background" />
            Libre
          </div>
        </div>

        <div className="overflow-auto p-4">
          <div
            ref={floorRef}
            className="relative mx-auto h-[560px] min-w-[820px] max-w-5xl overflow-hidden rounded-sm border-2 border-slate-400 bg-slate-200 shadow-inner dark:border-slate-600 dark:bg-slate-900"
            onPointerUp={stopDragging}
            onPointerLeave={stopDragging}
          >
            <div className="absolute inset-0 bg-[linear-gradient(rgba(100,116,139,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(100,116,139,0.18)_1px,transparent_1px)] bg-[size:48px_48px]" />

            {sortedMesas.map((mesa, index) => {
              const position =
                positions[mesa.id] ??
                tablePositions[index % tablePositions.length];
              const occupied = index % 3 === 1;

              return (
                <FloorTable
                  key={mesa.id}
                  mesa={mesa}
                  left={position.left}
                  top={position.top}
                  occupied={occupied}
                  onSelect={() => onSelectMesa(mesa)}
                  onDragStart={() => {
                    draggingMesaIdRef.current = mesa.id;
                  }}
                  onDragMove={(clientX, clientY) => {
                    if (draggingMesaIdRef.current === mesa.id) {
                      moveMesa(mesa.id, clientX, clientY);
                    }
                  }}
                />
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

type FloorTableProps = {
  mesa: Mesa;
  left: number;
  top: number;
  occupied: boolean;
  onSelect: () => void;
  onDragStart: () => void;
  onDragMove: (clientX: number, clientY: number) => void;
};

function FloorTable({
  mesa,
  left,
  top,
  occupied,
  onSelect,
  onDragStart,
  onDragMove,
}: FloorTableProps) {
  const shape =
    mesa.capacidad <= 2
      ? "rounded-md"
      : mesa.capacidad <= 4
        ? "rounded-full"
        : "rotate-45 rounded-sm";
  const contentShape = mesa.capacidad > 4 ? "-rotate-45" : "";
  const didDragRef = useRef(false);

  return (
    <button
      type="button"
      className={`absolute grid size-16 -translate-x-1/2 -translate-y-1/2 touch-none place-items-center border-2 border-blue-500 text-xs font-semibold shadow-sm transition hover:z-10 hover:scale-110 active:cursor-grabbing ${shape} ${occupied ? "bg-blue-500 text-white" : "bg-white text-slate-700 dark:bg-slate-950 dark:text-slate-100"}`}
      style={{ left: `${left}%`, top: `${top}%` }}
      title={`Mesa ${mesa.numero}, capacidad ${mesa.capacidad}`}
      onClick={() => {
        if (!didDragRef.current) {
          onSelect();
        }
        didDragRef.current = false;
      }}
      onPointerDown={(event) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        didDragRef.current = false;
        onDragStart();
      }}
      onPointerMove={(event) => {
        if (event.buttons !== 1) {
          return;
        }

        didDragRef.current = true;
        onDragMove(event.clientX, event.clientY);
      }}
    >
      <div className={`grid gap-0.5 ${contentShape}`}>
        <span>{mesa.numero}</span>
        <span
          className={`rounded-sm px-1 py-0.5 text-[10px] ${occupied ? "bg-slate-900 text-white" : "bg-slate-800 text-white"}`}
        >
          {mesa.capacidad} pax
        </span>
      </div>
    </button>
  );
}

type MesaDetailSheetProps = {
  mesa: Mesa;
  zonaNombre: string;
  zonas: ReturnType<typeof useGetZonas>["data"];
  onClose: () => void;
};

function MesaDetailSheet({
  mesa,
  zonaNombre,
  zonas = EMPTY_ZONAS,
  onClose,
}: MesaDetailSheetProps) {
  return (
    <Sheet
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <SheetContent className="flex flex-col p-0 sm:max-w-md">
        <SheetHeader className="border-b p-5 pr-12">
          <SheetTitle>Mesa {mesa.numero}</SheetTitle>
          <SheetDescription>
            Detalle rapido desde el croquis interactivo.
          </SheetDescription>
        </SheetHeader>

        <div className="grid flex-1 gap-5 overflow-y-auto p-5">
          <div className="overflow-hidden rounded-xl border bg-muted/30">
            {mesa.photoUrl ? (
              <img
                src={mesa.photoUrl}
                alt={`Mesa ${mesa.numero}`}
                className="h-48 w-full object-cover"
              />
            ) : (
              <div className="grid h-48 place-items-center text-muted-foreground">
                <Armchair className="size-10" />
              </div>
            )}
          </div>

          <div className="grid gap-3 rounded-xl border p-4 text-sm">
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">Numero</span>
              <span className="font-medium">{mesa.numero}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">Capacidad</span>
              <span className="font-medium">{mesa.capacidad} personas</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">Zona</span>
              <span className="font-medium">{zonaNombre}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">Estado visual</span>
              <Badge className="border-green-200 bg-green-100 text-green-700">
                Disponible
              </Badge>
            </div>
          </div>
        </div>

        <SheetFooter className="border-t p-5">
          <UpdateMesa mesa={mesa} zonas={zonas} trigger="button" />
          <DeleteMesa mesa={mesa} trigger="button" onDeleted={onClose} />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

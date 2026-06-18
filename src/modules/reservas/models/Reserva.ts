export const ESTADOS_RESERVA = [
  { id: 1, label: "Pendiente" },
  { id: 2, label: "Activa" },
  { id: 3, label: "Cancelada" },
  { id: 4, label: "Completada" },
] as const;

export type EstadoReserva = (typeof ESTADOS_RESERVA)[number]["id"];

export interface Reserva {
  id: number;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  capacidad: number;
  clienteId: number;
  estado: EstadoReserva;
  mesaId: number;
  turnoId: number;
}

export interface ReservaDto {
  fecha: string;
  capacidad: number;
  clienteId: number;
  mesaId: number;
  turnoId: number;
  estado: EstadoReserva;
}

export const reservaDefaultValues: ReservaDto = {
  fecha: new Date().toISOString().slice(0, 10),
  capacidad: 2,
  clienteId: 0,
  mesaId: 0,
  turnoId: 0,
  estado: 2,
};

export function getEstadoReservaLabel(estado: number) {
  return (
    ESTADOS_RESERVA.find((item) => item.id === estado)?.label ??
    `Estado ${estado}`
  );
}

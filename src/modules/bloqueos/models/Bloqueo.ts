export interface Bloqueo {
  id: number;
  mesaId: number;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  motivo: string;
}

export interface BloqueoDto {
  mesaId: number;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  motivo: string;
}

export const bloqueoDefaultValues: BloqueoDto = {
  mesaId: 0,
  fecha: new Date().toISOString().slice(0, 10),
  horaInicio: "",
  horaFin: "",
  motivo: "",
};

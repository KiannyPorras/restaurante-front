export interface Turno {
  id: number;
  nombre: string;
  horaInicio: string;
  horaFin: string;
}

export interface TurnoDto {
  nombre: string;
  horaInicio: string;
  horaFin: string;
}

export const turnoDefaultValues: TurnoDto = {
  nombre: "",
  horaInicio: "",
  horaFin: "",
};

export interface ListaEsperaDto {
  clienteId: number;
  fecha: string;
  cantidad: number;
  turnoId: number;
  zonaId?: number | null;
  mesaId?: number | null;
}

export interface ListaEspera extends ListaEsperaDto {
  id: number;
  horaInicio: string;
  horaFin: string;
}

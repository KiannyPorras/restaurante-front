export interface Mesa {
  id: number;
  numero: number;
  capacidad: number;
  zonaId: number;
  photoUrl?: string | null;
  posicionX?: number | null;
  posicionY?: number | null;
}

export interface MesaDto {
  numero: number;
  capacidad: number;
  zonaId: number;
  photoUrl?: string | null;
  posicionX?: number | null;
  posicionY?: number | null;
}

export const mesaDefaultValues: MesaDto = {
  numero: 1,
  capacidad: 2,
  zonaId: 1,
  photoUrl: "",
  posicionX: null,
  posicionY: null,
};

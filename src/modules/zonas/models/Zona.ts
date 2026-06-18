export interface Zona {
  id: number;
  nombre: string;
  disponibilidad: boolean;
  photoUrl?: string | null;
}

export interface ZonaDto {
  nombre: string;
  disponibilidad: boolean;
  photoUrl?: string | null;
}

export const zonaDefaultValues: ZonaDto = {
  nombre: "",
  disponibilidad: true,
  photoUrl: "",
};

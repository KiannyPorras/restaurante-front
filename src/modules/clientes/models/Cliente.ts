export interface Cliente {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: number;
  cedula: number;
}

export interface ClienteDto {
  nombre: string;
  apellido: string;
  email: string;
  telefono: number;
  cedula: number;
}

export const clienteDefaultValues: ClienteDto = {
  nombre: "",
  apellido: "",
  email: "",
  telefono: 0,
  cedula: 0,
};

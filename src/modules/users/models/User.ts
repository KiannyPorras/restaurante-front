export interface User {
  id: number;
  username: string;
  email: string;
  cedula: number;
}

export interface CreateUserDto {
  username: string;
  email: string;
  cedula: number;
  password: string;
}

export interface UpdateUserDto {
  username: string;
  email: string;
  cedula: number;
  password?: string;
}

export const createUserDefaultValues: CreateUserDto = {
  username: "",
  email: "",
  cedula: 0,
  password: "",
};

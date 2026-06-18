export interface SignInDto {
  userNameOrEmail: string;
  password: string;
}

export const signInDefaultValues: SignInDto = {
  userNameOrEmail: "",
  password: "",
};

export interface SessionUser {
  id: number;
  username: string;
  email: string;
}

export interface LoginResponse {
  token: string;
  expiresAt: string;
  user: SessionUser;
}

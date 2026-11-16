export interface User {
  id: number;
  name: string;
  email: string;
}

export interface AuthResponse {
  data: {
    user: User;
  };
}

export interface MeResponse {
  data: {
    user: User | null;
  };
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}
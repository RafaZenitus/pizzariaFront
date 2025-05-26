// import api from "../api/api.ts";
import api from "../api/api";

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  nome: string;
  email: string;
  cpf: string;
  telefone?: string;
  password: string;
}

export const login = async (data: LoginData) => {
  const response = await api.post("/login", data);
  return response.data; 
};

export const register = async (data: RegisterData) => {
  const response = await api.post("/clientes", data);
  return response.data;
};

export const forgotPassword = async (email: string) => {
  const response = await api.post("/auth/forgot-password", { email });
  return response.data;
};

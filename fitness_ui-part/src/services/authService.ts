import api from './api';

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const AuthService = {
  async register(payload: RegisterPayload) {
    try {
      const { data } = await api.post('/api/auth/register', payload);
      return data; // backend returns created User
    } catch (error: any) {
      const errorMessage = error.response?.data || 'Registration failed';
      throw new Error(errorMessage);
    }
  },

  async login(payload: LoginPayload) {
    try {
      const { data } = await api.post('/api/auth/login', payload);
      // backend returns token as string
      return data as string;
    } catch (error: any) {
      const errorMessage = error.response?.data || 'Login failed';
      throw new Error(errorMessage);
    }
  }
};



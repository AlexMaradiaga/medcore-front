import { defineStore } from 'pinia';
import type { User } from '@/modules/auth/domain/User';
import { AuthRepositoryImpl } from '@/modules/auth/infrastructure/AuthRepositoryImpl';
import { LoginUser } from '@/modules/auth/application/LoginUser';

const authRepository = new AuthRepositoryImpl();
const loginUserUseCase = new LoginUser(authRepository);

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user') || 'null') as User | null,
    token: localStorage.getItem('token') || null,
    loading: false,
  }),
  actions: {
    async login(credentials: { email: string; password: string }) {
      this.loading = true;
      try {
        const { user, token } = await loginUserUseCase.execute(credentials);

        this.user = user;
        this.token = token;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        return { success: true };
      } catch (error) {
        console.error('Error capturado en el Store:', error);

        return { success: false, message: 'Error en login' };
      } finally {
        this.loading = false;
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }
});

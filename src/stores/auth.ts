import { defineStore } from 'pinia';
import type { User } from '@/modules/auth/domain/User';
import { AuthRepositoryImpl } from '@/modules/auth/infrastructure/AuthRepositoryImpl';
import { LoginUser } from '@/modules/auth/application/LoginUser';

const authRepository = new AuthRepositoryImpl();
const loginUserUseCase = new LoginUser(authRepository);

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user') || 'null') as (User & { plan?: string; tipo_entidad?: string }) | null,
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

        // Guarda el plan si viene en el objeto user
        const planObtenido = (user as unknown as Record<string, unknown>)?.plan;
        if (planObtenido) {
          localStorage.setItem('user_plan', String(planObtenido));
        }

        return { success: true };
      } catch (error: unknown) {
        let message = 'Credenciales inválidas.';
        if (error && typeof error === 'object' && 'message' in error) {
          message = String((error as { message: unknown }).message);
        }
        return { success: false, message };
      } finally {
        this.loading = false;
      }
    },
    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('user_plan');
    }
  }
});

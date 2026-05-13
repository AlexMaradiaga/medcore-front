import type { User } from './User';

export interface AuthRepository {
    login(credentials: { email: string; password: string }): Promise<{ user: User; token: string }>;
    // Aquí podrías agregar métodos como logout() o register() más adelante
}

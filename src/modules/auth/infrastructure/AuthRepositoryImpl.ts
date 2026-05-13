import api from '@/shared/infrastructure/api';
import type { AuthRepository } from '@/modules/auth/domain/AuthRepository';
import type { User } from '@/modules/auth/domain/User';

export class AuthRepositoryImpl implements AuthRepository {
    async login(credentials: { email: string; password: string }): Promise<{ user: User; token: string }> {
        const response = await api.post('/login', credentials);
        const serverResponse = response.data;

        const rawUser = serverResponse.data;
        const token = serverResponse.access_token;

        if (!rawUser || !token) {
            throw new Error('La respuesta del servidor no tiene el formato esperado.');
        }

        const user: User = {
            id: rawUser.id,
            nombre: rawUser.nombre || rawUser.email.split('@')[0],
            email: rawUser.email,
            rol_id: rawUser.rol_id
        };

        return { user, token };
    }
}

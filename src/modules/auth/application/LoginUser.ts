import type { AuthRepository } from '@/modules/auth/domain/AuthRepository';
import type { User } from '@/modules/auth/domain/User';

export class LoginUser {
    constructor(private readonly authRepository: AuthRepository) {}

    async execute(credentials: { email: string; password: string }): Promise<{ user: User; token: string }> {
        // Aquí podrías agregar validaciones de lógica de negocio antes de llamar al repositorio
        if (!credentials.email.includes('@')) {
            throw new Error('El formato del correo no es válido');
        }

        return await this.authRepository.login(credentials);
    }
}

import { definePreset } from '@primevue/themes';
import Aura from '@primevue/themes/aura';

const MiEdicionPreset = definePreset(Aura, {
    semantic: {
        primary: {
            50: '#ebf1fa',
            100: '#c2d4f2',
            200: '#99b8ea',
            300: '#709be1',
            400: '#477fd9',
            500: '#3F6FD9', // Azul Primario Oficial (Botones, estados activos)
            600: '#3259ad',
            700: '#264382',
            800: '#192d57',
            900: '#0d162b',
            950: '#060b15'
        },
        colorScheme: {
            light: {
                surface: {
                    0: '#FFFFFF',
                    50: '#F4F7FA', // Gris Fondo General
                    100: '#E2E8F0',
                    200: '#CBD5E1',
                    300: '#94A3B8',
                    400: '#64748B',
                    500: '#475569',
                    600: '#334155',
                    700: '#2E3A46', // Gris Texto Principal
                    800: '#1E293B',
                    900: '#0F172A'
                }
            }
        }
    }
});

export default MiEdicionPreset;

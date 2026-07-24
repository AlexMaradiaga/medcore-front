import api from '@/shared/infrastructure/api';
import type { MonitoreoResponse, ServicioMedico } from '../domain/SaaSModels';

export class SaaSRepository {
    async obtenerMonitoreo(): Promise<MonitoreoResponse> {
        const response = await api.get('/admin/saas/monitoreo');
        return response.data.data;
    }

    async obtenerPreciosDoctor(): Promise<ServicioMedico[]> {
        const response = await api.get('/doctor/catalogo-precios');
        return response.data;
    }

    async guardarPrecioServicio(servicio: ServicioMedico): Promise<void> {
        await api.post('/admin/servicios/tarifa', servicio);
    }
}

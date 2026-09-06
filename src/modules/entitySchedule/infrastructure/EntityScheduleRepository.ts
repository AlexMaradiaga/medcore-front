import api from '@/shared/infrastructure/api';
import type { ScheduleItem } from '../domain/EntitySchedule';

export class EntityScheduleRepository {
  async getSchedules(entityId: number): Promise<ScheduleItem[]> {
    const { data } = await api.get(`/entidades/${entityId}/horarios`);
    return data.data || [];
  }

  async saveSchedules(entityId: number, schedules: ScheduleItem[]): Promise<void> {
    await api.put(`/entidades/${entityId}/horarios`, { schedules });
  }
}
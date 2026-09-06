export interface ScheduleItem {
  HorarioID?: number;
  EntidadID?: number;
  dia_semana: number;
  hora_apertura: string;
  hora_cierre: string;
  es_inactivo: boolean;
  notas?: string;
}

export const DIAS_SEMANA = [
  { id: 1, nombre: 'Lunes' },
  { id: 2, nombre: 'Martes' },
  { id: 3, nombre: 'Miércoles' },
  { id: 4, nombre: 'Jueves' },
  { id: 5, nombre: 'Viernes' },
  { id: 6, nombre: 'Sábado' },
  { id: 7, nombre: 'Domingo' }
];
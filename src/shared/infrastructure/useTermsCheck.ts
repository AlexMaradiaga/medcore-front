// src/shared/infrastructure/useTermsCheck.ts
import { ref, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';

export function useTermsCheck() {
  const authStore = useAuthStore();
  const showModalTerminos = ref(false);
  const diasFrecuencia = ref(30); // Configurable a 15 o 30 días

  // Entidades objetivo: Médicos (Rol 2), Clínicas, Laboratorios, Farmacias
  const esEntidadRequerida = computed(() => {
    if (!authStore.user) return false;

    const rolId = Number(authStore.user.rol_id || 0);
    const tipoEntidad = String(authStore.user.tipo_entidad || '').toLowerCase();

    // 1. Médicos (Rol 2)
    if (rolId === 2) return true;

    // 2. Clínicas, Laboratorios y Farmacias
    const tiposPermitidos = ['clinica', 'laboratorio', 'farmacia', 'medico'];
    return tiposPermitidos.includes(tipoEntidad);
  });

  const verificarAceptacionTerminos = () => {
    if (!esEntidadRequerida.value || !authStore.user) {
      showModalTerminos.value = false;
      return;
    }

    // Leer la última fecha de aceptación guardada localmente
    const ultimaFechaRaw =
      (authStore.user as Record<string, unknown>).fecha_aceptacion_terminos ||
      localStorage.getItem('medcore_fecha_terminos');

    if (!ultimaFechaRaw) {
      // Nunca ha aceptado los términos en este navegador
      showModalTerminos.value = true;
      return;
    }

    const fechaUltimaAceptacion = new Date(String(ultimaFechaRaw));
    const fechaActual = new Date();

    // Calcular diferencia en milisegundos y convertir a días
    const diffMs = fechaActual.getTime() - fechaUltimaAceptacion.getTime();
    const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    // Si pasaron 15 o 30 días o más, volver a mostrar el recordatorio
    if (diffDias >= diasFrecuencia.value) {
      showModalTerminos.value = true;
    } else {
      showModalTerminos.value = false;
    }
  };

  /**
   * Procesa la aceptación localmente sin realizar peticiones a la BD
   */
  const registrarAceptacionAPI = async () => {
    try {
      const ahoraIso = new Date().toISOString();

      // 1. Actualizar memoria de Pinia / AuthStore
      if (authStore.user) {
        (authStore.user as Record<string, unknown>).fecha_aceptacion_terminos = ahoraIso;
        localStorage.setItem('user', JSON.stringify(authStore.user));
      }

      // 2. Guardar marca de fecha local
      localStorage.setItem('medcore_fecha_terminos', ahoraIso);

      // 3. Ocultar el modal de inmediato
      showModalTerminos.value = false;
      console.log('✅ Aceptación de términos guardada en almacenamiento local.');
    } catch (error) {
      console.error('Error al guardar la aceptación local de términos:', error);
      showModalTerminos.value = false;
    }
  };

  return {
    showModalTerminos,
    diasFrecuencia,
    esEntidadRequerida,
    verificarAceptacionTerminos,
    registrarAceptacionAPI
  };
}

// src/shared/infrastructure/useTermsCheck.ts
import { ref, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';

export function useTermsCheck() {
  const authStore = useAuthStore();
  const showModalTerminos = ref(false);
  const diasFrecuencia = ref(30);

  // Clave de almacenamiento local exclusiva para MedGo+
  const STORAGE_KEY_MEDGO = 'medgo_fecha_terminos';

  const esEntidadRequerida = computed(() => {
    if (!authStore.user) return false;

    const rolId = Number(authStore.user.rol_id || 0);
    const tipoEntidad = String(authStore.user.tipo_entidad || '').toLowerCase();

    if (rolId === 2) return true;

    const tiposPermitidos = ['clinica', 'laboratorio', 'farmacia', 'medico'];
    return tiposPermitidos.includes(tipoEntidad);
  });

  const verificarAceptacionTerminos = () => {
    if (!esEntidadRequerida.value || !authStore.user) {
      showModalTerminos.value = false;
      return;
    }

    // Busca en el objeto de usuario o en el almacenamiento local de MedGo+
    const ultimaFechaRaw =
      (authStore.user as Record<string, unknown>).fecha_aceptacion_terminos ||
      localStorage.getItem(STORAGE_KEY_MEDGO);

    if (!ultimaFechaRaw) {
      showModalTerminos.value = true;
      return;
    }

    const fechaUltimaAceptacion = new Date(String(ultimaFechaRaw));
    const fechaActual = new Date();

    const diffMs = fechaActual.getTime() - fechaUltimaAceptacion.getTime();
    const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDias >= diasFrecuencia.value) {
      showModalTerminos.value = true;
    } else {
      showModalTerminos.value = false;
    }
  };

  const registrarAceptacionAPI = async () => {
    try {
      const ahoraIso = new Date().toISOString();

      if (authStore.user) {
        (authStore.user as Record<string, unknown>).fecha_aceptacion_terminos = ahoraIso;
        localStorage.setItem('user', JSON.stringify(authStore.user));
      }

      // Guardado exclusivo bajo el identificador MedGo+
      localStorage.setItem(STORAGE_KEY_MEDGO, ahoraIso);

      showModalTerminos.value = false;
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

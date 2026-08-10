<template>
  <RouterView />
  <ModalTerminos
    :show="showModalTerminos"
    :entidad-nombre="nombreEntidadUsuario"
    :tipo-entidad="tipoEntidadUsuario"
    :dias-frecuencia="diasFrecuencia"
    @aceptado="registrarAceptacionAPI"
  />
</template>

<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import { computed, watch, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import ModalTerminos from '@/shared/ui/components/ModalTerminos.vue';
import { useTermsCheck } from '@/shared/infrastructure/useTermsCheck';

const route = useRoute();
const authStore = useAuthStore();

const {
  showModalTerminos,
  diasFrecuencia,
  verificarAceptacionTerminos,
  registrarAceptacionAPI
} = useTermsCheck();

const nombreEntidadUsuario = computed(() => {
  return authStore.user?.nombre || 'Entidad MedCore';
});

const tipoEntidadUsuario = computed(() => {
  return authStore.user?.tipo_entidad || 'Módulo Profesional';
});

watch(
  () => [route.path, authStore.token],
  () => {
    if (authStore.token) {
      verificarAceptacionTerminos();
    }
  },
  { immediate: true }
);

onMounted(() => {
  if (authStore.token) {
    verificarAceptacionTerminos();
  }
});
</script>

<template>
  <div class="p-8">
    <header class="mb-8">
      <h2 class="text-2xl font-bold text-slate-800">
        Bienvenido, {{ authStore.user?.nombre || 'admin' }}
      </h2>
      <p class="text-slate-500 text-sm">Panel de control médico</p>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <p class="text-slate-400 text-xs font-bold uppercase">Total Pacientes</p>
        <p v-if="!loadingStats" class="text-3xl font-black text-medgo-teal">{{ stats.total_pacientes }}</p>
        <p v-else class="animate-pulse text-slate-200">...</p>
      </div>

      <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <p class="text-slate-400 text-xs font-bold uppercase">Citas Pendientes</p>
        <p v-if="!loadingStats" class="text-3xl font-black text-medgo-blue">{{ stats.citas_pendientes }}</p>
        <p v-else class="animate-pulse text-slate-200">...</p>
      </div>

      <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <p class="text-slate-400 text-xs font-bold uppercase">Total Doctores</p>
        <p v-if="!loadingStats" class="text-3xl font-black text-indigo-600">{{ stats.total_doctores }}</p>
        <p v-else class="animate-pulse text-slate-200">...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { DashboardRepositoryImpl, type DashboardStats } from '../infrastructure/DashboardRepositoryImpl';

const authStore = useAuthStore();
const dashboardRepo = new DashboardRepositoryImpl();

// Estado para las métricas
const stats = ref<DashboardStats>({
  citas_pendientes: '0',
  total_pacientes: '0',
  total_doctores: '0'
});
const loadingStats = ref(true);

onMounted(async () => {
  loadingStats.value = true;
  try {
    const data = await dashboardRepo.getStats();
    console.log("Stats en el componente:", data);
    stats.value = data;
  } catch (error: unknown) {
    // Verificamos si es un error de Axios para obtener detalles del servidor
    if (axios.isAxiosError(error)) {
      console.error("Error de la API:", error.response?.data || error.message);
    } else {
      console.error("Error inesperado:", error);
    }
  } finally {
    loadingStats.value = false;
  }
});
</script>

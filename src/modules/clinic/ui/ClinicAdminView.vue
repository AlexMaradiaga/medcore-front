<template>
  <div class="min-h-screen bg-[#f1f5f9] text-left font-premium p-8 animate-fade-in select-none">
   
    <header class="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-200 pb-8 gap-6">
      <div class="space-y-1">
        <span class="bg-linear-to-r from-purple-600 to-indigo-600 text-white text-[10px] font-black px-3.5 py-1.5 rounded-lg uppercase tracking-[0.2em] shadow-xs">
          Panel de Institución Clínica
        </span>
        <h2 class="text-4xl font-black text-slate-800 uppercase tracking-tight mt-3">
          Bienvenido, <span class="text-transparent bg-clip-text bg-linear-to-r from-purple-600 to-indigo-600">{{ authStore.user?.nombre || 'Administrador' }}</span>
        </h2>
        <p class="text-slate-500 text-xs font-bold flex items-center gap-2 mt-1">
          <v-icon name="ri-building-fill" scale="0.75" class="text-slate-400" />
          Gestión operativa, especialistas y control de citas médicas
        </p>
      </div>

      <div class="flex items-center gap-4">
        <button @click="handleLogout" title="Cerrar Sesión" class="p-4 bg-white text-rose-500 hover:bg-rose-50 hover:text-rose-600 rounded-2xl shadow-sm border border-slate-200 transition-all cursor-pointer flex items-center justify-center">
          <v-icon name="bi-box-arrow-right" scale="1.1" />
        </button>
      </div>
    </header>

    <div class="mt-4 animate-fade-in">
      <ClinicDashboard />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import ClinicDashboard from './components/ClinicDashboard.vue';

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = () => {
  if (!confirm('¿Está seguro que desea cerrar la sesión de la plataforma clínica?')) return;
  localStorage.clear();
  router.push('/');
};
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>

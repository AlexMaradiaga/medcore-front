<template>
  <div class="min-h-screen bg-[#f8fafc] text-left font-sans">
    <header class="bg-linear-to-r from-[#005596] to-[#00345c] text-white px-8 py-3 flex justify-between items-center shadow-lg">
      <div class="flex items-center gap-4">
        <div class="bg-white/20 p-2 rounded-lg font-black text-lg">M+</div>
        <div class="text-left">
          <h1 class="text-lg font-bold leading-tight">Panel Médico - MedGo+</h1>
          <p class="text-blue-100 text-[10px] font-medium">Dr. {{ medicalStore.doctorFullName }}</p>
        </div>
      </div>
      <div class="flex items-center gap-4">
        <div class="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-[10px] font-bold border border-green-500/30 flex items-center gap-2">
          <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Verificado
        </div>
        <button @click="handleLogout" class="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition-all border border-white/10 flex items-center gap-2 cursor-pointer">
          <span>↪</span> Salir
        </button>
      </div>
    </header>

    <nav class="bg-white border-b border-slate-200 px-8 py-2 sticky top-0 z-20 shadow-sm">
      <div class="max-w-350 mx-auto flex gap-2">
        <button
          v-for="item in menuItems"
          :key="item.path"
          @click="handleNavigation(item.path)"
          :disabled="isItemDisabled(item.path)"
          :class="[
            'px-5 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center gap-2',

            currentPath === item.path
              ? 'bg-[#005596]! text-white! shadow-md shadow-blue-900/10'
              : '',

            currentPath !== item.path && !isItemDisabled(item.path)
              ? 'text-[#005596] hover:bg-slate-50 cursor-pointer'
              : '',

            // 3. PESTAÑA BLOQUEADA
            isItemDisabled(item.path)
              ? 'text-slate-400/60 bg-slate-50/50 cursor-not-allowed pointer-events-none'
              : ''
          ]"
        >
          <span v-if="item.icon">{{ item.icon }}</span>
          {{ item.name }}
        </button>
      </div>
    </nav>

    <main>
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useMedicalStore } from '@/stores/medicalStore';
import { storeToRefs } from 'pinia';

const router = useRouter();
const route = useRoute();
const medicalStore = useMedicalStore();

const currentPath = computed(() => route.path);
const { isConsultationActive } = storeToRefs(medicalStore);

const menuItems = [
  { name: 'Panel', path: '/medico/dashboard', icon: '⊞' },
  { name: 'Agenda', path: '/medico/agenda', icon: '📅' },
  { name: 'Perfil', path: '/medico/perfil', icon: '👤' },
  { name: 'Consulta', path: '/medico/consulta', icon: '📄' },
  { name: 'Historial', path: '/medico/historial', icon: '📋' },
  { name: 'Receta', path: '/medico/receta', icon: '💊' },
  //{ name: 'Cierre', path: '/medico/cierre', icon: '✅' },
  { name: 'Mis Pacientes', path: '/medico/pacientes', icon: '👥' },
];

const isItemDisabled = (path: string): boolean => {
  if (
    path === '/medico/dashboard' ||
    path === '/medico/agenda' ||
    path === '/medico/pacientes'
  ) {
    return false;
  }

  if (isConsultationActive.value) {
    return false;
  }

  if (
    currentPath.value === '/medico/dashboard' ||
    currentPath.value === '/medico/agenda' ||
    currentPath.value === '/medico/pacientes'
  ) {
    return true;
  }

  return !isConsultationActive.value;
};

const handleNavigation = (path: string) => {
  if (!isItemDisabled(path)) {
    router.push(path);
  }
};

const handleLogout = () => {
  localStorage.clear();
  router.push('/');
};
</script>

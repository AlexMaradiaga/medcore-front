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
        <!-- Modificado @click para abrir el modal premium -->
        <button @click="preLogout" title="Cerrar Sesión" class="p-4 bg-white text-rose-500 hover:bg-rose-50 hover:text-rose-600 rounded-2xl shadow-sm border border-slate-200 transition-all cursor-pointer flex items-center justify-center">
          <v-icon name="bi-box-arrow-right" scale="1.1" />
        </button>
      </div>
    </header>

    <div class="mt-4 animate-fade-in">
      <ClinicDashboard />
    </div>

    <!-- MODAL DE CONFIRMACIÓN DE CIERRE DE SESIÓN PREMIUM -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div v-if="showLogoutModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <!-- Fondo oscuro difuminado -->
        <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-md" @click="showLogoutModal = false"></div>

        <!-- Tarjeta del Modal -->
        <div class="bg-white rounded-3xl p-7 max-w-md w-full shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-slate-100 relative z-10 text-center space-y-5 transform transition-all">

          <!-- Icono de Advertencia Estilizado -->
          <div class="mx-auto w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 shadow-xs border border-rose-100">
            <v-icon name="bi-box-arrow-right" scale="1.8" class="animate-pulse" />
          </div>

          <!-- Texto Informativo -->
          <div class="space-y-2">
            <h3 class="text-xl font-black text-slate-800 tracking-tight uppercase">
              ¿Cerrar Sesión Activa?
            </h3>
            <p class="text-slate-500 text-xs font-medium leading-relaxed px-2">
              Está a punto de salir de la plataforma clínica. Deberá introducir de nuevo sus credenciales de acceso para gestionar sus consultas.
            </p>
          </div>

          <!-- Botones de Acción de Alta Gama -->
          <div class="grid grid-cols-2 gap-3 pt-2">
            <button
              @click="showLogoutModal = false"
              class="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer active:scale-95"
            >
              Cancelar
            </button>
            <button
              @click="confirmarLogout"
              class="px-5 py-3 bg-linear-to-r from-rose-500 to-red-600 hover:brightness-110 text-white text-[11px] font-black uppercase tracking-wider rounded-xl shadow-md shadow-rose-500/20 transition-all cursor-pointer active:scale-95"
            >
              Sí, Salir
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import ClinicDashboard from './components/ClinicDashboard.vue';

const authStore = useAuthStore();
const router = useRouter();

// Estado reactivo para controlar el modal
const showLogoutModal = ref(false);

const preLogout = () => {
  showLogoutModal.value = true;
};

const confirmarLogout = () => {
  showLogoutModal.value = false;
  localStorage.clear();
  router.push('/');
};
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>

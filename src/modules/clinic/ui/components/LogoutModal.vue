<!-- src/components/clinica/LogoutModal.vue -->
<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in"
  >
    <div class="bg-white rounded-3xl p-7 max-w-md w-full shadow-2xl border border-slate-100 text-center space-y-5">
      <!-- Icono Alerta -->
      <div class="mx-auto w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 border border-rose-100">
        <svg class="w-8 h-8 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      </div>

      <!-- Texto -->
      <div class="space-y-2">
        <h3 class="text-xl font-extrabold text-slate-900 tracking-tight uppercase">
          ¿Cerrar Sesión Activa?
        </h3>
        <p class="text-slate-500 text-xs font-medium leading-relaxed px-2">
          Está a punto de salir de la plataforma clínica. Deberá introducir de nuevo sus credenciales de acceso para gestionar sus consultas y expedientes.
        </p>
      </div>

      <!-- Botones -->
      <div class="grid grid-cols-2 gap-3 pt-2">
        <button
          type="button"
          @click="$emit('cancelar')"
          class="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold uppercase tracking-wider rounded-xl transition-all cursor-pointer active:scale-95"
        >
          Cancelar
        </button>
        <button
          type="button"
          @click="$emit('confirmar')"
          class="px-5 py-3 bg-linear-to-r from-rose-500 to-red-600 hover:brightness-110 text-white text-xs font-extrabold uppercase tracking-wider rounded-xl shadow-md shadow-rose-500/20 transition-all cursor-pointer active:scale-95"
        >
          Sí, Salir
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  isOpen: boolean;
}>();

defineEmits<{
  (e: 'cancelar'): void;
  (e: 'confirmar'): void;
}>();
</script>

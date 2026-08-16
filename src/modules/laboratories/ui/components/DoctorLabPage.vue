<template>
  <DoctorLayout>
    <main class="p-8 max-w-4xl mx-auto animate-fade-in text-left">
      <div class="bg-white border border-slate-200/80 rounded-4xl p-10 shadow-sm space-y-6">
        <div class="w-16 h-16 bg-blue-50 text-[#005596] rounded-3xl flex items-center justify-center text-3xl shadow-xs border border-blue-100">
          <v-icon name="si-flask" scale="1.4" />
        </div>
        <div class="space-y-2">
          <h2 class="text-2xl font-black text-slate-800 uppercase tracking-tight">
            Módulo de Muestras y Exámenes de Laboratorio
          </h2>
          <p class="text-xs font-bold text-slate-500 leading-relaxed">
            Las órdenes de laboratorio ahora están integradas directamente dentro de la <strong>Ficha de Consulta Médica Activa</strong> (entre las etapas de <em>Evaluación</em> y <em>Plan</em>).
          </p>
        </div>

        <div class="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-3">
          <h4 class="text-xs font-black text-[#005596] uppercase tracking-wider">Flujo de Trabajo Automatizado:</h4>
          <ul class="text-xs text-slate-600 font-medium space-y-2 list-disc pl-5">
            <li>Seleccione los exámenes analíticos del catálogo en la pestaña <strong>Laboratorio</strong> de la consulta.</li>
            <li>Al hacer clic en <strong>Finalizar Consulta</strong>, los exámenes se agendarán automáticamente.</li>
            <li>Se emitirá una notificación de alerta en el panel del laboratorio para su procesamiento.</li>
            <li>Los resultados quedarán asociados de inmediato al <strong>Historial del Paciente</strong>.</li>
          </ul>
        </div>

        <button
          @click="router.push('/medico/dashboard')"
          class="px-8 py-4 bg-[#005596] hover:bg-blue-700 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-md transition-all cursor-pointer"
        >
          Ir a la Agenda del Día
        </button>
      </div>
    </main>
  </DoctorLayout>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import DoctorLayout from '@/shared/ui/layouts/DoctorLayout.vue';

const router = useRouter();
</script>

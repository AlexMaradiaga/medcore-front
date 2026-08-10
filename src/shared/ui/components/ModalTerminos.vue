<!-- src/shared/ui/components/ModalTerminos.vue -->
<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="opacity-0 scale-95"
    enter-to-class="opacity-100 scale-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-95"
  >
    <div v-if="isVisible" class="fixed inset-0 z-9999 flex items-center justify-center p-4 font-sans text-left">
      <!-- Fondo oscuro de bloqueo -->
      <div class="fixed inset-0 bg-slate-900/80 backdrop-blur-md"></div>

      <!-- Tarjeta del Modal al estilo MedGo+ -->
      <div class="bg-white rounded-4xl max-w-3xl w-full shadow-2xl border border-slate-100 relative z-10 overflow-hidden flex flex-col max-h-[92vh]">

        <!-- CABECERA -->
        <header class="bg-[#0b1727] text-white p-5 flex items-center justify-between shrink-0">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-xl bg-[#00c49f] text-slate-900 font-black flex items-center justify-center text-xs shadow-md">
              MedGo+
            </div>
            <div>
              <h3 class="text-base font-black uppercase tracking-tight text-white leading-none">
                Términos y Condiciones de Uso
              </h3>
              <p class="text-[10px] font-bold text-slate-400 mt-1">
                Inversiones Digitales SanRA S.A. — {{ entidadNombre }} ({{ tipoEntidad }})
              </p>
            </div>
          </div>
        </header>

        <!-- SUB-CABECERA -->
        <div class="bg-slate-50 px-6 py-3 border-b border-slate-200/80 flex justify-between items-center text-xs font-black uppercase tracking-wider shrink-0">
          <span class="text-slate-500 text-[10px]">DOCUMENTO OFICIAL DE CONTROL INTERNO</span>
          <a
            :href="pdfPath"
            target="_blank"
            download
            class="text-rose-600 hover:text-rose-700 flex items-center gap-1.5 transition-colors cursor-pointer text-[11px]"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z"/>
            </svg>
            Descargar / Abrir PDF Completo
          </a>
        </div>

        <!-- CUERPO DEL MODAL CON VISOR DE PDF -->
        <div class="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-100/50">
          <div class="bg-white rounded-2xl border border-slate-300 shadow-inner overflow-hidden h-96 w-full">
            <iframe
              :src="`${pdfPath}#toolbar=1&navpanes=0&scrollbar=1`"
              class="w-full h-full border-0"
              title="Términos y Condiciones"
            ></iframe>
          </div>

          <div class="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-2 text-xs text-slate-600 text-left">
            <h4 class="font-black uppercase tracking-wider text-slate-800 text-[11px] mb-3">
              RESUMEN DE PUNTOS CLAVE:
            </h4>
            <ul class="space-y-2 list-disc pl-4 font-medium leading-relaxed">
              <li>
                <strong class="text-slate-800">Tratamiento de Datos:</strong> MedGo+ recopila datos identificativos y sensibles de salud únicamente para prestar los servicios contratados con medidas reinforcedas de seguridad y cifrado.
              </li>
              <li>
                <strong class="text-slate-800">Expediente Clínico:</strong> Los registros clínicos son elaborados por profesionales autorizados y no pueden ser alterados de forma no auditada.
              </li>
              <li>
                <strong class="text-slate-800">Responsabilidad:</strong> MedGo+ actúa como plataforma tecnológica intermediaria; la responsabilidad sobre diagnósticos y tratamientos corresponde al profesional tratante.
              </li>
              <li>
                <strong class="text-slate-800">Ley Aplicable:</strong> Regido conforme a las leyes aplicables de la República de Honduras.
              </li>
            </ul>
          </div>
        </div>

        <!-- PIE DE PÁGINA Y BOTÓN PRINCIPAL -->
        <footer class="bg-white px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0">
          <p class="text-[11px] text-slate-400 font-medium text-left max-w-md leading-tight">
            Al hacer clic en "ACEPTAR Y ENTENDIDO", confirma que ha revisado la documentación legal correspondiente.
          </p>

          <button
            type="button"
            @click="confirmarAceptacion"
            :disabled="enviando"
            class="w-full sm:w-auto px-8 py-3.5 bg-[#00a86b] hover:bg-[#008f5b] disabled:opacity-50 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-md active:scale-95 flex items-center justify-center shrink-0 border-none"
          >
            <span>{{ enviando ? 'Procesando...' : 'ACEPTAR Y ENTENDIDO' }}</span>
          </button>
        </footer>

      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';

const props = withDefaults(
  defineProps<{
    show?: boolean;
    entidadNombre?: string;
    tipoEntidad?: string;
    minutosFrecuencia?: number; // ⏱️ Frecuencia configurable en minutos (Default: 5)
    pdfFileName?: string;
    storageKey?: string;
  }>(),
  {
    show: true,
    entidadNombre: 'Profesional / Entidad',
    tipoEntidad: 'SaaS',
    minutosFrecuencia: 5,
    pdfFileName: 'Terminos_condiciones_MedGo.pdf',
    storageKey: 'medgo_terminos_aceptados_at'
  }
);

const emit = defineEmits<{
  (e: 'aceptado'): void;
}>();

const enviando = ref(false);
const isVisible = ref(false);
const pdfPath = ref(`/${props.pdfFileName}`);
let timerCheck: number | null = null;

const verificarVisualizacion = () => {
  if (!props.show) {
    isVisible.value = false;
    return;
  }

  const ultimaAceptacion = localStorage.getItem(props.storageKey);

  if (!ultimaAceptacion) {
    isVisible.value = true;
    return;
  }

  const msFrecuencia = props.minutosFrecuencia * 60 * 1000;
  const tiempoTranscurrido = Date.now() - parseInt(ultimaAceptacion, 10);

  isVisible.value = tiempoTranscurrido >= msFrecuencia;
};

const confirmarAceptacion = async () => {
  enviando.value = true;
  try {
    localStorage.setItem(props.storageKey, Date.now().toString());
    isVisible.value = false;
    emit('aceptado');
  } finally {
    enviando.value = false;
  }
};

watch(() => props.show, () => {
  verificarVisualizacion();
});

onMounted(() => {
  verificarVisualizacion();
  timerCheck = window.setInterval(verificarVisualizacion, 10000);
});

onUnmounted(() => {
  if (timerCheck) clearInterval(timerCheck);
});
</script>

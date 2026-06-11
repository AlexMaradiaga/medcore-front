<template>
  <DoctorLayout>
    <main class="p-8 max-w-4xl mx-auto space-y-8 animate-fade-in text-left font-premium">

      <div class="flex justify-between items-center mb-4 print:hidden border-b border-slate-200 pb-4">
        <div class="text-left">
          <h2 class="text-3xl font-black text-[#005596] tracking-tighter uppercase">Orden de Prescripción</h2>
          <p class="text-slate-400 font-bold text-xs">Visualización, auditoría y exportación de fármacos bajo estándar institucional</p>
        </div>
        <div class="flex gap-3">
          <button
            @click="router.back()"
            class="bg-white text-slate-500 border border-slate-200 px-6 py-3.5 rounded-2xl font-black uppercase text-xs hover:bg-slate-50 transition-all cursor-pointer flex items-center gap-2"
          >
            ← Volver
          </button>
          <button
            @click="imprimirDocumentoReceta"
            :disabled="cargandoReceta || medicamentosPrescritos.length === 0"
            class="bg-linear-to-r from-[#005596] to-[#00345c] text-white px-8 py-3.5 rounded-2xl font-black uppercase text-xs shadow-xl hover:brightness-110 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 flex items-center gap-2"
          >
            🖨️ Imprimir / Guardar PDF
          </button>
        </div>
      </div>

      <div v-if="cargandoReceta" class="text-center py-32 bg-white border border-slate-100 rounded-[2.5rem] shadow-xs flex flex-col items-center justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#005596] mb-4"></div>
        <span class="text-xs font-black text-slate-400 uppercase tracking-widest animate-pulse">
          Consultando registros en la tabla [Recetas] de SQL Server...
        </span>
      </div>

      <div v-else class="max-w-3xl mx-auto print:max-w-full">
        <section class="bg-white border-2 border-slate-100 rounded-[2.5rem] p-12 shadow-2xl space-y-10 flex flex-col justify-between min-h-180 relative overflow-hidden print:border-0 print:shadow-none print:p-0 print:min-h-0">

          <div class="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-full flex items-center justify-center text-slate-200/50 text-5xl font-black select-none print:hidden">
            Rx
          </div>

          <div class="flex flex-col sm:flex-row justify-between items-start gap-6 border-b-2 border-[#005596] pb-6 text-left">
            <div class="space-y-1">
              <h3 class="text-2xl font-black text-slate-800 uppercase tracking-tight">
                Dr. {{ medicalStore.doctorFullName || 'Médico Especialista' }}
              </h3>
              <p class="text-[10px] font-black text-[#005596] uppercase tracking-widest">
                MedCore Global — Servicios Médicos Integrales
              </p>
              <div class="pt-4 space-y-1 text-xs font-bold text-slate-500 uppercase">
                <p>Paciente: <span class="text-slate-900 font-black tracking-tight">{{ nombrePaciente }}</span></p>
                <p>Edad: <span class="text-slate-700 font-black">{{ edadPaciente }}</span></p>
              </div>
            </div>

            <div class="text-left sm:text-right text-[10px] font-bold text-slate-400 uppercase space-y-1.5 self-end sm:self-auto">
              <p class="bg-blue-50 text-[#005596] px-3 py-1.5 rounded-xl border border-blue-100 font-black inline-block tracking-wider">
                Cita ID: #{{ route.params.id || '---' }}
              </p>
              <p class="pt-1 text-slate-500">Fecha Emisión: <span class="text-slate-700 font-black">{{ fechaActual }}</span></p>
              <p class="text-slate-400">Origen: SQL Server Reg-Fármaco</p>
            </div>
          </div>

          <div class="text-left text-3xl font-black text-[#005596] tracking-tighter mt-4 select-none">
            Rx:
          </div>

          <div class="flex-1 py-2">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="border-b border-slate-200 text-slate-400 font-black text-[10px] uppercase tracking-widest">
                  <th class="py-3 px-2 w-12 text-center">#</th>
                  <th class="py-3 px-4 text-[#005596]">Medicamento Prescrito</th>
                  <th class="py-3 px-4 w-1/4">Dosis</th>
                  <th class="py-3 px-4 w-1/2">Indicaciones Especiales</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="medicamentosPrescritos.length === 0">
                  <td colspan="4" class="text-center py-24 text-slate-400 text-[10px] font-black uppercase tracking-widest bg-slate-50/50 rounded-3xl border border-dashed border-slate-100">
                    📭 No se registran medicamentos asignados a este folio de consulta.
                  </td>
                </tr>
                <tr
                  v-else
                  v-for="(med, index) in medicamentosPrescritos"
                  :key="index"
                  class="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-all font-bold text-slate-700 text-xs animate-fade-in"
                >
                  <td class="py-5 px-2 text-center text-slate-400 font-black">{{ Number(index) + 1 }}</td>
                  <td class="py-5 px-4 text-slate-900 font-black uppercase text-[13px] tracking-tight">{{ med.NombreMedicamento }}</td>
                  <td class="py-5 px-4 text-slate-600 font-bold bg-slate-50/50 sm:bg-transparent rounded-lg">{{ med.Dosis }}</td>
                  <td class="py-5 px-4 text-slate-500 font-medium italic leading-relaxed">{{ med.Indicaciones }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="border-t border-slate-100 pt-8 flex flex-col sm:flex-row justify-between items-end gap-6 text-[9px] font-bold text-slate-400 uppercase">
            <div class="text-left space-y-1.5 max-w-md">
              <p class="text-slate-500">MedCore Global © 2026 — Documento Médico Autenticado Electrónicamente</p>
              <p v-if="codigoVerificacion" class="text-slate-400 font-mono tracking-tight font-medium normal-case bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 inline-block">
                🔒 Hash de Seguridad (CodigoCanje): <span class="font-bold text-[#005596] uppercase tracking-wider">{{ codigoVerificacion }}</span>
              </p>
            </div>
            <div class="w-48 border-b-2 border-slate-400 text-center pb-2 font-black text-slate-500 italic tracking-wide print:mt-16">
              Firma y Sello Médico Autorizado
            </div>
          </div>

        </section>
      </div>
    </main>
  </DoctorLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import DoctorLayout from '@/shared/ui/layouts/DoctorLayout.vue';
import { useMedicalStore } from '@/stores/medicalStore';
import { DoctorRepository } from '../infrastructure/DoctorRepository';
import type { DoctorAppointment } from '../domain/DoctorAppointment';

interface FilaRecetaSQL {
  NombreMedicamento: string;
  Dosis: string;
  Indicaciones: string;
  CodigoCanje?: string;
}

const route = useRoute();
const router = useRouter();
const medicalStore = useMedicalStore();
const repo = new DoctorRepository();

const appointment = ref<DoctorAppointment | null>(null);
const medicamentosPrescritos = ref<FilaRecetaSQL[]>([]);
const cargandoReceta = ref<boolean>(true);

// Variables auxiliares locales para renderizar los datos si no hay cita cargada en memoria activa
const pacienteBackup = ref('');
const edadBackup = ref('');

const nombrePaciente = computed(() => appointment.value?.Paciente || pacienteBackup.value || 'No especificado');
const edadPaciente = computed(() => appointment.value?.Edad ? `${appointment.value.Edad} Años` : (edadBackup.value ? `${edadBackup.value} Años` : '---'));

const fechaActual = computed(() => {
  return new Date().toLocaleDateString('es-HN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

const codigoVerificacion = computed(() => {
  return medicamentosPrescritos.value[0]?.CodigoCanje || 'MCG-AUTOGEN-2026';
});

onMounted(async () => {
  try {
    const idUrl = Number(route.params.id);

    // 🧠 PASO 1: Intentamos alimentar la UI desde el LocalStorage compartido de la consulta activa
    const resumenGuardado = localStorage.getItem('medcore_resumen_compartir');
    const savedAppointment = localStorage.getItem('current_appointment');

    if (savedAppointment) {
      appointment.value = JSON.parse(savedAppointment) as DoctorAppointment;
    }

    if (resumenGuardado) {
      const datosResumen = JSON.parse(resumenGuardado);
      medicamentosPrescritos.value = datosResumen.detalle_medicamentos;
      pacienteBackup.value = datosResumen.paciente;
      edadBackup.value = datosResumen.edad;
    }

    // 🧠 PASO 2: Si por alguna razón el LocalStorage viene vacío (por ejemplo un refresco forzado),
    // hacemos el fallback directo consultando los datos a SQL Server a través de la API
    if (medicamentosPrescritos.value.length === 0 && idUrl > 0) {
      const res = await repo.getRecetaPorConsulta(idUrl);
      if (res.estado === 'success' && res.datos && res.datos.length > 0) {
        medicamentosPrescritos.value = res.datos;
      }
    }
  } catch (error) {
    console.error("Error cargando el historial de la receta física:", error);
  } finally {
    cargandoReceta.value = false;
  }
});

const imprimirDocumentoReceta = () => {
  window.print();
};
</script>

<style scoped>
.font-premium { font-family: 'Montserrat', 'Inter', system-ui, sans-serif; }
.rounded-4xl { border-radius: 2rem; }
.animate-fade-in { animation: fadeIn 0.35s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

@media print {
  body {
    background-color: #ffffff !important;
    color: #000000 !important;
  }
  nav, header, .print\:hidden, button, footer {
    display: none !important;
  }
  main {
    padding: 0 !important;
    margin: 0 !important;
    width: 100% !important;
  }
  section {
    border: none !important;
    box-shadow: none !important;
    padding: 0 !important;
  }
}
</style>

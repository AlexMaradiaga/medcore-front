<template>
  <DoctorLayout>
    <main class="p-8 max-w-350 mx-auto space-y-8 animate-fade-in text-left font-premium">

      <div class="flex justify-between items-end mb-4 print:hidden">
        <div class="text-left">
          <h2 class="text-4xl font-black text-[#005596] tracking-tighter uppercase">Documento de Receta</h2>
          <p class="text-slate-400 font-bold text-sm">Visualización, auditoría y descarga de fármacos prescritos en consulta</p>
        </div>
        <div class="flex gap-4">
          <button
            @click="imprimirDocumentoReceta"
            :disabled="cargandoReceta || medicamentosPrescritos.length === 0"
            class="bg-linear-to-r from-[#005596] to-[#00345c] text-white px-10 py-4 rounded-2xl font-black uppercase text-xs shadow-xl hover:brightness-110 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 flex items-center gap-2"
          >
            🖨️ Imprimir / Guardar PDF
          </button>
        </div>
      </div>

      <div v-if="cargandoReceta" class="text-center py-32 bg-white border border-slate-100 rounded-[3rem] shadow-sm flex flex-col items-center justify-center">
        <span class="text-xs font-black text-slate-400 animate-pulse uppercase tracking-widest">
          Consultando registros en la tabla [Recetas] de SQL Server...
        </span>
      </div>

      <div v-else class="max-w-5xl mx-auto">
        <section class="bg-white border border-slate-100 rounded-[3rem] p-12 shadow-xl space-y-8 flex flex-col justify-between min-h-150 print:border-0 print:shadow-none print:p-0">

          <div class="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-slate-100 pb-6 text-left">
            <div class="space-y-1.5">
              <h3 class="text-2xl font-black text-slate-800 uppercase tracking-tight">
                Dr. {{ medicalStore.doctorFullName || 'Médico Especialista' }}
              </h3>
              <p class="text-xs font-black text-[#005596] uppercase tracking-wider">
                MedCore Global — Panel de Control Farmacéutico
              </p>
              <p class="text-xs font-bold text-slate-400 uppercase pt-2">
                Paciente: <span class="text-slate-900 font-black tracking-tight">{{ appointment?.Paciente || 'No especificado' }}</span>
              </p>
            </div>

            <div class="text-left sm:text-right text-[10px] font-bold text-slate-400 uppercase space-y-1">
              <p class="bg-slate-50 text-slate-600 px-3 py-1 rounded-md border border-slate-100 inline-block">
                Consulta ID: <span class="text-slate-700 font-black">#{{ appointment?.ConsultaID || '---' }}</span>
              </p>
              <p class="pt-1">Edad Paciente: {{ appointment?.Edad ? appointment.Edad + ' Años' : '---' }}</p>
              <p>Fecha Emisión: {{ fechaActual }}</p>
            </div>
          </div>

          <div class="flex-1 py-4">
            <table class="w-full text-left border-collapse min-w-125">
              <thead>
                <tr class="border-b border-slate-100 text-slate-400 font-black text-[10px] uppercase tracking-wider">
                  <th class="py-3 px-2 w-12 text-center">#</th>
                  <th class="py-3 px-4">Medicamento</th>
                  <th class="py-3 px-4 w-1/4">Dosis</th>
                  <th class="py-3 px-4 w-1/3">Indicaciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="medicamentosPrescritos.length === 0">
                  <td colspan="4" class="text-center py-24 text-slate-400 text-[11px] font-black uppercase tracking-widest bg-slate-50/50 rounded-4xl border border-dashed border-slate-100">
                    📭 No se registran medicamentos indexados para esta consulta médica.
                  </td>
                </tr>
                <tr
                  v-else
                  v-for="(med, index) in medicamentosPrescritos"
                  :key="index"
                  class="border-b border-slate-50 hover:bg-slate-50/30 transition-all font-bold text-slate-700 text-xs animate-fade-in"
                >
                  <td class="py-5 px-2 text-center text-slate-400 font-black">{{ index + 1 }}</td>
                  <td class="py-5 px-4 text-slate-900 font-black uppercase text-[12px]">{{ med.NombreMedicamento }}</td>
                  <td class="py-5 px-4 text-slate-600 font-semibold">{{ med.Dosis }}</td>
                  <td class="py-5 px-4 text-slate-500 font-medium italic leading-relaxed">{{ med.Indicaciones }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="border-t border-slate-100 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[9px] font-bold text-slate-400 uppercase">
            <div class="text-left space-y-1">
              <p>MedCore Global © 2026 — Documento Clínico Autenticado</p>
              <p v-if="codigoVerificacion" class="text-slate-400/80 font-mono tracking-tight font-medium normal-case">
                🔒 Hash de Seguridad (CodigoCanje): <span class="font-bold text-[#005596] uppercase">{{ codigoVerificacion }}</span>
              </p>
            </div>
            <div class="w-40 border-b border-slate-300 text-center Jack-signature pb-1 font-semibold text-slate-400 italic print:mt-12">
              Firma y Sello Médico
            </div>
          </div>

        </section>
      </div>
    </main>
  </DoctorLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
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

const medicalStore = useMedicalStore();
const repo = new DoctorRepository();

const appointment = ref<DoctorAppointment | null>(null);
const medicamentosPrescritos = ref<FilaRecetaSQL[]>([]);
const cargandoReceta = ref<boolean>(true);

const fechaActual = computed(() => {
  return new Date().toLocaleDateString('es-HN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

const codigoVerificacion = computed(() => {
  return medicamentosPrescritos.value[0]?.CodigoCanje || '';
});

onMounted(async () => {
  const saved = localStorage.getItem('current_appointment');
  if (saved) {
    appointment.value = JSON.parse(saved) as DoctorAppointment;

    const consultaId = appointment.value.ConsultaID || 0;
    if (consultaId > 0) {
      try {
        const res = await repo.getRecetaPorConsulta(consultaId);
        if (res.estado === 'success') {
          medicamentosPrescritos.value = res.datos;
        }
      } catch (error) {
        console.error("Error cargando el historial de la receta física:", error);
      } finally {
        cargandoReceta.value = false;
      }
    } else {
      cargandoReceta.value = false;
    }
  } else {
    cargandoReceta.value = false;
  }
});

const imprimirDocumentoReceta = () => {
  window.print();
};
</script>

<style scoped>
.font-premium {
  font-family: 'Montserrat', 'Inter', system-ui, sans-serif;
}
.rounded-\[3rem\] {
  border-radius: 3rem;
}
.animate-fade-in { animation: fadeIn 0.35s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }


@media print {
  body {
    background-color: #ffffff;
  }
  nav, header, .print\:hidden, button {
    display: none !important;
  }
  main {
    padding: 0 !important;
    margin: 0 !important;
  }
}
</style>

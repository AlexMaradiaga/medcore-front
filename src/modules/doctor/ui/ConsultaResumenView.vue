<template>
  <DoctorLayout>
    <main class="p-8 max-w-5xl mx-auto space-y-8 font-premium">

      <div class="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-200 pb-6 text-left gap-4">
        <div>
          <h2 class="text-3xl font-black text-[#005596] tracking-tighter uppercase">Consulta Completada</h2>
          <p class="text-slate-400 font-bold text-sm">Comparta el resumen clínico y las recetas con el paciente</p>
        </div>

        <div class="flex gap-3 w-full md:w-auto">
          <button
            @click="router.push(`/medico/receta/${route.params.id}`)"
            class="flex-1 md:flex-none bg-[#005596] hover:bg-[#00345c] text-white px-6 py-3.5 rounded-2xl font-black uppercase text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            📄 Ver Prescripción (Rx)
          </button>
          <button
            @click="compartirWhatsApp"
            class="flex-1 md:flex-none bg-[#25D366] hover:bg-[#20ba5a] text-white px-6 py-3.5 rounded-2xl font-black uppercase text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            💬 WhatsApp
          </button>
          <button
            @click="compartirCorreo"
            class="flex-1 md:flex-none bg-[#ea4335] hover:bg-[#d63b2f] text-white px-6 py-3.5 rounded-2xl font-black uppercase text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            ✉️ Enviar Correo
          </button>
          <button
            @click="router.push('/medico/dashboard')"
            class="flex-1 md:flex-none bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-3.5 rounded-2xl font-black uppercase text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            Ir al Inicio
          </button>
        </div>
      </div>

      <section class="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xs space-y-8 text-left">
        <h3 class="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-3">
          Información General del Paciente
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-bold text-slate-700">
          <div class="space-y-1">
            <p class="text-slate-400 font-medium">Nombre Completo:</p>
            <p class="text-sm font-black text-slate-800 uppercase">{{ datos.paciente }}</p>
          </div>
          <div class="space-y-1">
            <p class="text-slate-400 font-medium">Edad / Género:</p>
            <p class="text-slate-800 font-black uppercase">
              {{ datos.edad }} Años / {{ datos.genero === 'M' ? 'Masculino' : 'Femenino' }}
            </p>
          </div>
          <div class="space-y-1">
            <p class="text-slate-400 font-medium">Contactos del Registro:</p>
            <p class="text-slate-600 font-medium">{{ datos.telefono || 'Sin Teléfono' }} • {{ datos.email || 'Sin Correo' }}</p>
          </div>
        </div>
      </section>

      <section class="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xs space-y-4 text-left">
        <h4 class="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-3">
          Diagnóstico Clínico Registrado
        </h4>
        <p class="text-sm font-black text-slate-800 uppercase bg-slate-50 p-4 rounded-2xl border border-slate-100/70">
          🩺 {{ datos.diagnostico || 'Sin diagnóstico registrado.' }}
        </p>
      </section>

      <section class="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xs space-y-6 text-left">
        <h4 class="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-3">
          Medicamentos Prescritos
        </h4>

        <div class="border border-slate-100 rounded-3xl overflow-hidden bg-white">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50 border-b border-slate-100 text-slate-400 font-black text-[9px] uppercase tracking-wider">
                <th class="py-4 px-4 w-12 text-center">#</th>
                <th class="py-4 px-4">Medicamento</th>
                <th class="py-4 px-4 w-1/4">Dosis</th>
                <th class="py-4 px-4 w-1/2">Indicaciones</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(med, index) in datos.detalle_medicamentos"
                :key="index"
                class="border-b border-slate-50 last:border-0 font-bold text-slate-700 text-xs hover:bg-slate-50/30 transition-all"
              >
                <td class="py-4 px-4 text-center text-slate-400 font-black">{{ Number(index) + 1 }}</td>
                <td class="py-4 px-4 text-slate-900 font-black uppercase text-[11px]">{{ med.NombreMedicamento }}</td>
                <td class="py-4 px-4 text-slate-600 font-semibold">{{ med.Dosis }}</td>
                <td class="py-4 px-4 text-slate-500 font-medium italic leading-relaxed">{{ med.Indicaciones }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

    </main>
  </DoctorLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router'; 
import { useToast } from 'vue-toastification';
import DoctorLayout from '@/shared/ui/layouts/DoctorLayout.vue';

const router = useRouter();
const route = useRoute();
const toast = useToast();

const datos = ref({
  paciente: '',
  telefono: '',
  email: '',
  edad: '',
  genero: '',
  diagnostico: '',
  detalle_medicamentos: [] as Array<{ NombreMedicamento: string; Dosis: string; Indicaciones: string; }>
});

onMounted(() => {
  const resumenGuardado = localStorage.getItem('medcore_resumen_compartir');

  if (resumenGuardado) {
    datos.value = JSON.parse(resumenGuardado);
  } else {
    const state = window.history.state?.resumenCompartir;
    if (state) {
      datos.value = state;
    } else {
      toast.error("No se detectaron datos de la consulta completada.");
      router.push('/medico/dashboard');
    }
  }
});

const construirTextoResumen = () => {
  let texto = `*MEDCORE GLOBAL - RESUMEN DE CONSULTA*\n\n`;
  texto += `*Paciente:* ${datos.value.paciente}\n`;
  texto += `*Diagnóstico:* ${datos.value.diagnostico}\n\n`;
  texto += `*TRATAMIENTO PRESCRITO:*\n`;

  datos.value.detalle_medicamentos.forEach((med, idx) => {
    texto += `${idx + 1}. ${med.NombreMedicamento} - ${med.Dosis}\n    _Indicaciones:_ ${med.Indicaciones}\n`;
  });

  return texto;
};

const compartirWhatsApp = () => {
  if (!datos.value.telefono) {
    toast.error("El paciente no cuenta con un número telefónico registrado.");
    return;
  }
  const numeroLimpio = datos.value.telefono.replace(/[^0-9+]/g, '');
  const mensajeEncode = encodeURIComponent(construirTextoResumen());

  window.open(`https://api.whatsapp.com/send?phone=${numeroLimpio}&text=${mensajeEncode}`, '_blank');
};

const compartirCorreo = () => {
  if (!datos.value.email) {
    toast.error("El paciente no cuenta con un correo electrónico registrado.");
    return;
  }
  const asunto = encodeURIComponent(`Resumen de Consulta Médica - MedCore Global`);
  const cuerpo = encodeURIComponent(construirTextoResumen().replace(/\*/g, ''));

  window.location.href = `mailto:${datos.value.email}?subject=${asunto}&body=${cuerpo}`;
};
</script>

<style scoped>
.font-premium { font-family: 'Montserrat', 'Inter', system-ui, sans-serif; }
.rounded-4xl { border-radius: 2rem; }
</style>

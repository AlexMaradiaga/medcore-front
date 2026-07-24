<template>
  <div class="fixed inset-0 z-50 flex justify-end font-sans">
    <div
      @click="$emit('close')"
      class="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
    ></div>

    <aside class="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col z-10 animate-slide-in overflow-hidden">

      <header class="bg-linear-to-r from-[#4d3eff] via-[#b616e6] to-[#f30077] p-6 text-white relative overflow-hidden shrink-0 shadow-md">
        <div class="relative z-10 flex justify-between items-start">
          <div class="flex items-center gap-3 text-left">
            <div class="p-2.5 bg-white/20 rounded-xl text-xl flex items-center justify-center text-white">
              <v-icon :name="iconoRol" scale="1.2" />
            </div>
            <div>
              <h2 class="text-xl font-black tracking-tight text-white">Planes para Clínicas</h2>
              <p class="text-white/80 text-[11px] font-semibold mt-0.5">{{ authStore.user?.nombre || 'Dr. Usuario' }}</p>
            </div>
          </div>

          <button
            @click="$emit('close')"
            class="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all cursor-pointer border border-white/10 flex items-center justify-center text-white"
          >
            <v-icon name="bi-x" scale="1.1" stroke-width="3" />
          </button>
        </div>

        <div class="flex gap-2.5 mt-5 text-left">
          <div class="flex-1 bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10">
            <span class="block text-[10px] font-bold text-white/80 tracking-tight">Visualizaciones</span>
            <span class="text-xl font-black tracking-tight">187</span>
          </div>
          <div class="flex-1 bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10">
            <span class="block text-[10px] font-bold text-white/80 tracking-tight">Citas/mes</span>
            <span class="text-xl font-black tracking-tight">{{ citasContadas }}</span>
          </div>
          <div class="flex-1 bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10">
            <span class="block text-[10px] font-bold text-white/80 tracking-tight">Médicos</span>
            <span class="text-xl font-black tracking-tight">{{ medicosActivosContados }}</span>
          </div>
        </div>
      </header>

      <nav class="flex border-b border-slate-100 bg-slate-50/50 shrink-0">
        <button
          @click="subTabActual = 'planes'"
          :class="subTabActual === 'planes' ? 'border-b-2 border-[#4d3eff] text-[#4d3eff] font-black' : 'text-slate-400 font-bold'"
          class="flex-1 py-3.5 text-xs text-center cursor-pointer transition-all"
        >
          Planes
        </button>
        <button
          @click="subTabActual = 'metricas'"
          :class="subTabActual === 'metricas' ? 'border-b-2 border-[#4d3eff] text-[#4d3eff] font-black' : 'text-slate-400 font-bold'"
          class="flex-1 py-3.5 text-xs text-center cursor-pointer transition-all"
        >
          Mis Métricas
        </button>
      </nav>

      <div class="flex-1 overflow-y-auto p-6 bg-white text-left scrollbar-none space-y-6">

        <div v-if="subTabActual === 'planes'" class="space-y-6 animate-fade-in">

          <div class="bg-[#eff6ff] border border-[#bfdbfe] rounded-2xl p-4 flex items-start gap-3">
            <div class="text-blue-600 mt-0.5">
              <v-icon name="bi-lightning-charge-fill" scale="0.9" />
            </div>
            <p class="text-[11px] text-blue-700 font-medium leading-relaxed">
              <span class="font-black">🧪 Fase Piloto Roatán:</span> Los planes mostrados son los que regirán al lanzar oficialmente. Valores simulados.
            </p>
          </div>

          <div class="bg-linear-to-r from-amber-500 to-orange-500 rounded-2xl p-4 text-white relative overflow-hidden shadow-xs space-y-2">
            <div class="flex justify-between items-center">
              <h4 class="text-xs font-black tracking-tight uppercase">Únete como Founder MedGo+</h4>
              <span class="bg-white text-orange-600 font-black text-[9px] px-2 py-0.5 rounded-full">Nivel 1</span>
            </div>
            <p class="text-[11px] text-white/90 font-medium leading-tight">Participa en la fase piloto y recibe beneficios exclusivos.</p>
            <ul class="grid grid-cols-1 gap-y-1 text-[11px] font-bold text-white/90 pt-1">
              <li class="flex items-center gap-1.5"><v-icon name="bi-check" scale="0.8"/> ✓ Insignia Founder</li>
              <li class="flex items-center gap-1.5"><v-icon name="bi-check" scale="0.8"/> ✓ Acceso anticipado a nuevas funciones</li>
              <li class="flex items-center gap-1.5"><v-icon name="bi-check" scale="0.8"/> ✓ Beneficios especiales durante el piloto</li>
              <li class="flex items-center gap-1.5"><v-icon name="bi-check" scale="0.8"/> ✓ Prioridad en futuras actualizaciones</li>
            </ul>
          </div>

          <div class="border-2 border-[#00b04f] bg-white rounded-3xl p-5 relative overflow-hidden shadow-2xs space-y-4">
            <div class="flex justify-between items-start">
              <div>
                <h4 class="text-base font-black text-slate-800 tracking-tight flex items-center gap-1.5">
                  Plan Popular <v-icon name="bi-star-fill" class="text-[#00b04f]" scale="0.85" />
                </h4>
                <p class="text-slate-400 text-[11px] font-semibold mt-0.5">Perfecto para comenzar y ganar visibilidad institucional.</p>
              </div>
              <span class="bg-[#00b04f] text-white font-black text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1 shadow-3xs">
                <v-icon name="bi-check-lg" scale="0.8" /> Activo
              </span>
            </div>
            <div class="py-1">
              <span class="text-4xl font-black text-[#00b04f] tracking-wide">GRATIS</span>
            </div>
            <ul class="space-y-2 text-[11px] font-semibold text-slate-600 border-t border-slate-50 pt-3">
              <li class="flex items-center gap-2 text-slate-700"><v-icon name="bi-check" class="text-teal-600" scale="0.9"/> Perfil institucional en MedGo+</li>
              <li class="flex items-center gap-2 text-slate-700"><v-icon name="bi-check" class="text-teal-600" scale="0.9"/> Directorio MedGo+</li>
              <li class="flex items-center gap-2 text-slate-700"><v-icon name="bi-check" class="text-teal-600" scale="0.9"/> Geolocalización</li>
              <li class="flex items-center gap-2 text-slate-700"><v-icon name="bi-check" class="text-teal-600" scale="0.9"/> Horarios de atención</li>
              <li class="flex items-center gap-2 text-slate-700"><v-icon name="bi-check" class="text-teal-600" scale="0.9"/> 1 licencia médica incluida</li>
            </ul>
            <button :disabled="planEnProceso !== null" @click="subTabActual = 'planes'" class="w-full py-2.5 border border-blue-600 text-blue-600 hover:bg-blue-50 font-black text-xs rounded-xl transition-all cursor-pointer text-center">
              Actualizar a Ejecutivo
            </button>
          </div>

          <div class="border border-slate-200 bg-white rounded-3xl relative overflow-hidden shadow-2xs flex flex-col">
            <div class="bg-blue-600 text-white font-black text-[10px] uppercase tracking-widest py-1.5 text-center w-full">
              MÁS POPULAR
            </div>
            <div class="p-5 space-y-4">
              <div class="flex justify-between items-start">
                <div>
                  <h4 class="text-base font-black text-slate-800 tracking-tight flex items-center gap-1.5">
                    Plan Ejecutivo <v-icon name="bi-lightning-charge-fill" class="text-blue-600" scale="0.85" />
                  </h4>
                  <p class="text-slate-400 text-[11px] font-semibold mt-0.5">Para clínicas pequeñas y medianas con varios médicos.</p>
                </div>
                <div class="text-slate-300"><v-icon name="bi-lock-fill" scale="0.9" /></div>
              </div>
              <div class="py-1">
                <span class="text-3xl font-black text-blue-600 tracking-tight">US$99<span class="text-slate-400 text-sm font-bold">/mes</span></span>
              </div>
              <ul class="space-y-2 text-[11px] font-semibold text-slate-600 border-t border-slate-50 pt-3">
                <li class="flex items-center gap-2 text-slate-700"><v-icon name="bi-check" class="text-teal-600" scale="0.9"/> Todo lo del Plan Popular</li>
                <li class="flex items-center gap-2 text-slate-700"><v-icon name="bi-check" class="text-teal-600" scale="0.9"/> Dashboard administrativo</li>
                <li class="flex items-center gap-2 text-slate-700"><v-icon name="bi-check" class="text-teal-600" scale="0.9"/> Gestión de médicos</li>
                <li class="flex items-center gap-2 text-slate-700"><v-icon name="bi-check" class="text-teal-600" scale="0.9"/> Estadísticas operativas</li>
                <li class="flex items-center gap-2 text-slate-700"><v-icon name="bi-check" class="text-teal-600" scale="0.9"/> Hasta 3 licencias médicas Pro</li>
                <li class="flex items-center gap-2 text-slate-700"><v-icon name="bi-check" class="text-teal-600" scale="0.9"/> Expedientes autorizados</li>
              </ul>

              <div class="bg-slate-50 border p-2.5 rounded-xl flex items-center justify-center gap-2 text-slate-400 font-bold text-[10px] uppercase">
                <v-icon name="bi-lock-fill" scale="0.75" /> Disponible en Plan Ejecutivo
              </div>

              <div class="flex gap-2 pt-1">
                <button
                  @click="procesarPagoPlan('Ejecutivo')"
                  :disabled="planEnProceso !== null"
                  class="flex-1 py-3 bg-[#0070f3] hover:bg-blue-700 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer"
                >
                  {{ planEnProceso === 'Ejecutivo' ? 'Procesando...' : 'Actualizar a Ejecutivo' }}
                </button>
                <button :disabled="planEnProceso !== null" class="px-4 py-3 border border-slate-200 text-slate-600 hover:bg-slate-50 font-black text-xs rounded-xl transition-all cursor-pointer">
                  Me interesa
                </button>
              </div>
            </div>
          </div>

          <div class="border border-slate-200 bg-white rounded-3xl relative overflow-hidden shadow-2xs flex flex-col">
            <div class="bg-linear-to-r from-[#b616e6] to-[#f30077] text-white font-black text-[10px] uppercase tracking-widest py-1.5 text-center w-full flex items-center justify-center gap-1">
              <v-icon name="fa-crown" scale="0.85" /> RECOMENDADO
            </div>
            <div class="p-5 space-y-4">
              <div class="flex justify-between items-start">
                <div>
                  <h4 class="text-base font-black text-slate-800 tracking-tight flex items-center gap-1.5">
                    Plan VIP <v-icon name="fa-crown" class="text-purple-600" scale="0.9" />
                  </h4>
                  <p class="text-slate-400 text-[11px] font-semibold mt-0.5">Para hospitales pequeños, policlínicos y centros con múltiples especialidades.</p>
                </div>
                <div class="text-slate-300"><v-icon name="bi-lock-fill" scale="0.9" /></div>
              </div>
              <div class="py-1">
                <span class="text-3xl font-black text-purple-600 tracking-tight">US$299<span class="text-slate-400 text-sm font-bold">/mes</span></span>
              </div>
              <ul class="space-y-2 text-[11px] font-semibold text-slate-600 border-t border-slate-50 pt-3">
                <li class="flex items-center gap-2 text-slate-700"><v-icon name="bi-check" class="text-teal-600" scale="0.9"/> Todo lo del Plan Ejecutivo</li>
                <li class="flex items-center gap-2 text-slate-700"><v-icon name="bi-check" class="text-teal-600" scale="0.9"/> Hasta 8 licencias médicas Elite</li>
                <li class="flex items-center gap-2 text-slate-700"><v-icon name="bi-check" class="text-teal-600" scale="0.9"/> Dashboard ejecutivo en tiempo real</li>
                <li class="flex items-center gap-2 text-slate-700"><v-icon name="bi-check" class="text-teal-600" scale="0.9"/> Reportes gerenciales</li>
                <li class="flex items-center gap-2 text-slate-700"><v-icon name="bi-check" class="text-teal-600" scale="0.9"/> Facturación consolidada</li>
                <li class="flex items-center gap-2 text-slate-700"><v-icon name="bi-check" class="text-teal-600" scale="0.9"/> Gestión multiservicio</li>
              </ul>

              <div class="bg-slate-50 border p-2.5 rounded-xl flex items-center justify-center gap-2 text-slate-400 font-bold text-[10px] uppercase">
                <v-icon name="bi-lock-fill" scale="0.75" /> Disponible en Plan VIP
              </div>

              <div class="flex gap-2 pt-1">
                <button
                  @click="procesarPagoPlan('VIP')"
                  :disabled="planEnProceso !== null"
                  class="flex-1 py-3 bg-linear-to-r from-[#b616e6] to-[#f30077] hover:brightness-110 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer"
                >
                  {{ planEnProceso === 'VIP' ? 'Procesando...' : 'Actualizar a VIP' }}
                </button>
                <button :disabled="planEnProceso !== null" class="px-4 py-3 border border-slate-200 text-slate-600 hover:bg-slate-50 font-black text-xs rounded-xl transition-all cursor-pointer">
                  Me interesa
                </button>
              </div>
            </div>
          </div>

        </div>

        <div v-if="subTabActual === 'metricas'" class="space-y-4 animate-fade-in">
          <div class="flex items-center gap-2 text-slate-700">
            <v-icon name="bi-bar-chart-fill" class="text-blue-600" scale="0.95" />
            <h4 class="text-sm font-black uppercase tracking-tight">Estadísticas del Piloto</h4>
          </div>

          <div class="grid grid-cols-2 gap-3.5">
            <div class="bg-white border border-blue-100 shadow-2xs p-4 rounded-2xl text-left">
              <span class="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase"><v-icon name="bi-eye-fill" class="text-blue-500" scale="0.8" /> Visualizaciones</span>
              <span class="text-3xl font-black text-blue-600 block mt-2">187</span>
            </div>

            <div class="bg-white border border-purple-100 shadow-2xs p-4 rounded-2xl text-left">
              <span class="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase"><v-icon name="bi-calendar-event" class="text-purple-500" scale="0.8" /> Citas/mes</span>
              <span class="text-3xl font-black text-purple-500 block mt-2">{{ citasContadas }}</span>
            </div>

            <div class="bg-white border border-emerald-100 shadow-2xs p-4 rounded-2xl text-left">
              <span class="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase"><v-icon name="gi-stethoscope" class="text-emerald-500" scale="0.8" /> Médicos activos</span>
              <span class="text-3xl font-black text-emerald-600 block mt-2">{{ medicosActivosContados }}</span>
            </div>

            <div class="bg-white border border-teal-100 shadow-2xs p-4 rounded-2xl text-left">
              <span class="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase"><v-icon name="bi-check-circle-fill" class="text-teal-500" scale="0.8" /> Asistencia</span>
              <span class="text-3xl font-black text-teal-600 block mt-2">{{ tasaAsistenciaReal }}%</span>
            </div>
          </div>

          <div class="flex items-center justify-between bg-slate-50 border border-slate-100 p-4 rounded-2xl text-xs font-bold text-slate-700 mt-2 shadow-3xs">
            <span class="flex items-center gap-2"><v-icon name="bi-people-fill" class="text-blue-600" scale="0.85"/> Días activa en piloto:</span>
            <span class="bg-[#0070f3] text-white px-3 py-1 rounded-full text-[10px] font-black font-mono">18 days</span>
          </div>
        </div>

      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '@/stores/auth';
import api from '@/shared/infrastructure/api';
import { ReportRepository } from '../../admin/infrastructure/ReportRepository';
import { OhVueIcon as VIcon, addIcons } from 'oh-vue-icons';
import {
  BiX, BiLightningChargeFill, BiCheck, BiStarFill, BiCheckLg,
  BiLockFill, BiEyeFill, BiCalendarEvent, BiCheckCircleFill, BiPeopleFill, BiBarChartFill,
  IoMedal, FaCrown, GiStethoscope
} from 'oh-vue-icons/icons';

addIcons(
  BiX, BiLightningChargeFill, BiCheck, BiStarFill, BiCheckLg,
  BiLockFill, BiEyeFill, BiCalendarEvent, BiCheckCircleFill, BiPeopleFill, BiBarChartFill,
  IoMedal, FaCrown, GiStethoscope
);

defineEmits(['close']);
const toast = useToast();
const authStore = useAuthStore();
const repo = new ReportRepository();

const subTabActual = ref<string>('planes');
const citasContadas = ref<number>(0);
const medicosActivosContados = ref<number>(6);
const tasaAsistenciaReal = ref<number>(88);

const planEnProceso = ref<string | null>(null);

interface CitaContract {
  EstadoCita?: string;
  Estado?: string | number;
}

const rolActual = computed<number>(() => {
  return authStore.user?.rol_id || 2;
});

const iconoRol = computed<string>(() => {
  return rolActual.value === 2 ? 'gi-stethoscope' : 'bi-star-fill';
});

const consultarCitasOperacionales = async () => {
  const usuarioId = authStore.user?.id;
  console.group('🔍 [MedGo+ Log] Consultando Citas Operacionales');
  console.log('👤 Usuario en AuthStore:', authStore.user);
  console.log('🆔 ID del Usuario autenticado:', usuarioId);

  if (!usuarioId) {
    console.warn('⚠️ No se encontró usuarioId en authStore, abortando consulta de citas.');
    console.groupEnd();
    return;
  }

  try {
    console.log(`📡 GET Endpoint Citas: doctor/citas/${usuarioId}`);
    const res = await api.get(`doctor/citas/${usuarioId}`);
    console.log('📥 Respuesta Citas API:', res.data);

    if (Array.isArray(res.data)) {
      const citas: CitaContract[] = res.data;
      citasContadas.value = citas.length;

      if (citas.length > 0) {
        const completadas = citas.filter(c => {
          const estado = (c.EstadoCita || '').toUpperCase();
          return estado === 'FINALIZADA' || estado === 'COMPLETADA' || estado === 'ASISTIDA';
        }).length;

        tasaAsistenciaReal.value = Math.round((completadas / citas.length) * 100);
      }
    }

    console.log('📡 GET Endpoint Doctores: doctores');
    const resDoctores = await api.get('doctores');
    console.log('📥 Respuesta Doctores API:', resDoctores.data);

    if (Array.isArray(resDoctores.data)) {
      medicosActivosContados.value = resDoctores.data.length;
    } else if (resDoctores.data && Array.isArray(resDoctores.data.data)) {
      medicosActivosContados.value = resDoctores.data.data.length;
    }
  } catch (error) {
    console.error("❌ Error al recuperar métricas del médico:", error);
  } finally {
    console.groupEnd();
  }
};

const procesarPagoPlan = async (plan: string): Promise<void> => {
  planEnProceso.value = plan;

  const payload = {
    tipo_plan: plan,
    dias_vigencia: 30,
    token_pasarela: 'TOK_HN_' + Math.random().toString(36).substring(5).toUpperCase()
  };

  try {
    await repo.cambiarPlanSaaS(payload);

    if (authStore.user) {
      (authStore.user as Record<string, unknown>).plan = plan;
    }

    localStorage.setItem('user_plan', plan);

    toast.success(`¡Plan ${plan} solicitado con éxito para validación!`);
    window.location.reload();
  } catch {
    toast.error("Error al procesar la solicitud del plan.");
  } finally {
    planEnProceso.value = null;
  }
};

onMounted(() => {
  console.log('🏁 Componente Planes/Métricas montado.');
  consultarCitasOperacionales();
});
</script>

<style scoped>
.scrollbar-none::-webkit-scrollbar { display: none; }
.scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
.animate-slide-in { animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.animate-fade-in { animation: fadeIn 0.2s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
</style>

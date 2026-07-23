<template>
  <div class="space-y-6">
    <!-- Sub-Tabs Operativas del Control de Citas -->
    <div class="flex gap-4 border-b border-slate-200 pb-3">
      <button
        @click="subTab = 'activas'"
        :class="subTab === 'activas' ? 'bg-sky-50 text-[#005596] font-black' : 'text-slate-500 font-bold hover:bg-slate-50'"
        class="px-4 py-2 text-xs uppercase tracking-wider rounded-xl cursor-pointer transition-all border-none flex items-center gap-2"
      >
        <v-icon name="bi-calendar-check-fill" scale="0.8" /> Citas Activas
      </button>
      <button
        @click="subTab = 'completo'"
        :class="subTab === 'completo' ? 'bg-purple-50 text-purple-700 font-black' : 'text-slate-500 font-bold hover:bg-slate-50'"
        class="px-4 py-2 text-xs uppercase tracking-wider rounded-xl cursor-pointer transition-all border-none flex items-center gap-2"
      >
        <v-icon name="bi-clock-history" scale="0.8" /> Historial Completo
      </button>
    </div>

    <!-- Indicador de Carga -->
    <div v-if="loading" class="text-center py-12 text-slate-400 font-bold text-xs uppercase tracking-widest animate-pulse">
      Sincronizando control de citas...
    </div>

    <!-- Sin Registros -->
    <div v-else-if="filteredAppointments.length === 0" class="bg-white rounded-[2.5rem] p-16 text-center border border-slate-100 shadow-xs flex flex-col items-center justify-center space-y-4 min-h-87.5">
      <div class="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 text-slate-300">
        <v-icon name="bi-calendar-x" scale="1.5" />
      </div>
      <h3 class="text-sm font-black text-slate-700 uppercase tracking-wider">Sin Registros Encontrados</h3>
      <p class="text-xs font-semibold text-slate-400 max-w-xs leading-relaxed">No posees citas médicas programadas o completadas bajo esta categoría.</p>
    </div>

    <!-- Grid de Tarjetas Reutilizando la Interfaz del Dominio -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="app in filteredAppointments"
        :key="app.CitaID"
        class="bg-white rounded-3xl p-6 border border-slate-100 shadow-3xs flex flex-col justify-between space-y-6 relative transition-all hover:border-slate-200"
      >
        <!-- Encabezado de Tarjeta -->
        <div class="flex justify-between items-start">
          <div class="flex flex-col gap-1 items-start">
            <span
              :class="{
                'bg-amber-50 text-amber-700 border-amber-200/60': app.EstadoCita?.toLowerCase() === 'pendiente',
                'bg-emerald-50 text-emerald-700 border-emerald-200/60': ['completada', 'finalizada', 'confirmada'].includes(app.EstadoCita?.toLowerCase()),
                'bg-rose-50 text-rose-700 border-rose-200/60': app.EstadoCita?.toLowerCase() === 'cancelada'
              }"
              class="text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md border"
            >
              {{ app.EstadoCita }}
            </span>
            <!-- Badge para Cita de Seguimiento -->
            <span
              v-if="app.TipoCita?.toLowerCase() === 'seguimiento'"
              class="bg-purple-50 text-purple-700 border-purple-200/60 text-[8px] font-black uppercase px-2 py-0.5 rounded border tracking-wide mt-1 flex items-center gap-1"
            >
              <v-icon name="bi-arrow-repeat" scale="0.6" /> Seguimiento
            </span>
          </div>
          <span class="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Folio: #{{ app.CitaID }}</span>
        </div>

        <!-- Información Mapeada desde la Consulta Limpia del Repositorio -->
        <div class="text-left space-y-1">
          <p class="text-[10px] font-black uppercase text-slate-400 tracking-wider">Médico Especialista</p>
          <h4 class="text-base font-black text-slate-800 leading-tight">
            {{ app.Doctor || 'Dr. Por Asignar' }}
          </h4>
          <p class="text-xs font-bold text-sky-600 uppercase tracking-wide">
            {{ app.Clinica || 'Clínica Asociada' }}
          </p>
        </div>

        <!-- Contenedor de Fecha y Hora -->
        <div class="bg-slate-50 rounded-2xl p-4 space-y-2 text-left border border-slate-100/50">
          <div class="flex items-center gap-2 text-xs font-bold text-slate-600">
            <v-icon name="bi-calendar-event" class="text-sky-500" scale="0.85" />
            <span>{{ formatFecha(app.FechaHora || app.fecha_hora) }}</span>
          </div>
          <div class="flex items-center gap-2 text-xs font-bold text-slate-600">
            <v-icon name="bi-clock" class="text-sky-500" scale="0.85" />
            <span>{{ formatHora(app.FechaHora || app.fecha_hora) }} M.</span>
          </div>
        </div>

        <!-- Sintomatología / Motivo -->
        <div class="text-left space-y-1">
          <p class="text-[10px] font-black uppercase text-slate-400 tracking-wider">Sintomatología / Motivo</p>
          <p class="text-xs font-semibold text-slate-500 italic bg-slate-50/40 px-3 py-2 rounded-xl border border-dashed border-slate-200/60">
            "{{ app.Motivo || app.motivo || 'Consulta de control general.' }}"
          </p>
        </div>

        <!-- Acciones Operativas -->
        <div v-if="app.EstadoCita?.toLowerCase() === 'pendiente' || app.EstadoCita?.toLowerCase() === 'confirmada'" class="pt-2">
          <button
            @click="abrirGestionCita(app)"
            class="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-sky-700 border border-slate-200 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all border-none cursor-pointer flex items-center justify-center gap-2"
          >
            <v-icon name="bi-gear-fill" scale="0.8" /> Gestionar Cita
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="showActionModal"
      class="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in"
    >
      <div class="bg-white rounded-4xl p-8 w-full max-w-md shadow-2xl border border-slate-100 space-y-6">

        <div class="text-center space-y-2">
          <div :class="modoConfirmacion === 'reprogramar' ? 'bg-sky-50 text-sky-600 border-sky-100' : 'bg-slate-50 text-slate-600 border-slate-100'" class="w-14 h-14 rounded-2xl flex items-center justify-center border mx-auto shadow-2xs">
            <v-icon :name="modoConfirmacion === 'reprogramar' ? 'bi-calendar-range-fill' : 'bi-gear-fill'" scale="1.4" />
          </div>
          <h3 class="text-lg font-black text-slate-800 uppercase tracking-tight">
            {{ modoConfirmacion === 'reprogramar' ? 'Reprogramar Cita' : 'Opciones de Cita' }}
          </h3>
          <p class="text-xs font-semibold text-slate-400 leading-relaxed max-w-xs mx-auto">
            Seleccione la acción correspondiente para el folio <span class="text-slate-700 font-bold">#{{ citaSeleccionada?.CitaID }}</span> con el especialista.
          </p>
        </div>

        <div v-if="modoConfirmacion === 'menu'" class="flex flex-col gap-3">
          <button
            @click="modoConfirmacion = 'reprogramar'"
            class="w-full bg-sky-50 hover:bg-sky-100/80 text-[#005596] border border-sky-200/60 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <v-icon name="bi-calendar-event" scale="0.9" /> Reprogramar Fecha y Hora
          </button>

          <button
            @click="modoConfirmacion = 'anular'"
            class="w-full bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/40 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <v-icon name="bi-calendar-x" scale="0.9" /> Anular Reserva Médica
          </button>
        </div>

        <!-- FLUJO B: SUBFORMULARIO REPROGRAMACIÓN -->
        <div v-else-if="modoConfirmacion === 'reprogramar'" class="space-y-4 text-left">
          <div class="grid grid-cols-1 gap-3">
            <div>
              <label class="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1.5">Nueva Fecha y Hora:</label>
              <input
                v-model="nuevaFechaHora"
                type="datetime-local"
                class="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-sky-100 focus:border-sky-400 text-xs font-bold text-slate-700"
              />
            </div>
          </div>

          <div class="flex gap-3 pt-2">
            <button
              @click="modoConfirmacion = 'menu'"
              class="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer border-none"
            >
              Atrás
            </button>
            <button
              @click="ejecutarReprogramacion"
              :disabled="loadingAccion || !nuevaFechaHora"
              class="flex-1 bg-sky-600 hover:bg-sky-700 text-white py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer border-none shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{{ loadingAccion ? 'Guardando...' : 'Confirmar Cambio' }}</span>
            </button>
          </div>
        </div>

        <!-- FLUJO C: CONFIRMACIÓN ANULACIÓN -->
        <div v-else-if="modoConfirmacion === 'anular'" class="space-y-4">
          <p class="text-xs font-bold text-rose-600 bg-rose-50/50 p-3 rounded-xl border border-dashed border-rose-200/60 leading-normal">
            Advertencia: Esta acción liberará el espacio en la agenda. La cita no podrá reactivarse.
          </p>
          <div class="flex gap-3 pt-2">
            <button
              @click="modoConfirmacion = 'menu'"
              class="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer border-none"
            >
              Atrás
            </button>
            <button
              @click="ejecutarAnulacion"
              :disabled="loadingAccion"
              class="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer border-none shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{{ loadingAccion ? 'Cancelando...' : 'Confirmar Anulación' }}</span>
            </button>
          </div>
        </div>

        <!-- Botón General para Cerrar Modal Completo -->
        <div v-if="modoConfirmacion === 'menu'" class="pt-2 border-t border-slate-100">
          <button
            @click="showActionModal = false"
            class="w-full bg-slate-100 hover:bg-slate-200 text-slate-500 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer border-none"
          >
            Cerrar Ventana
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useToast } from 'vue-toastification';
import { AppointmentRepository } from '../infrastructure/AppointmentRepo';
import type { Appointment } from '../domain/Appointment';

// Extendemos localmente la interfaz para que reconozca la propiedad que agregaste en Laravel
type ExtendedAppointment = Appointment & { TipoCita?: string };

const toast = useToast();
const appointmentRepo = new AppointmentRepository();

const appointments = ref<ExtendedAppointment[]>([]);
const loading = ref<boolean>(false);
const subTab = ref<'activas' | 'completo'>('activas');

// ESTADOS OPERATIVOS DEL MODAL MULTI-ACCIÓN
const showActionModal = ref<boolean>(false);
const modoConfirmacion = ref<'menu' | 'reprogramar' | 'anular'>('menu');
const loadingAccion = ref<boolean>(false);
const citaSeleccionada = ref<ExtendedAppointment | null>(null);
const nuevaFechaHora = ref<string>('');

const fetchAppointments = async (): Promise<void> => {
  const userJson = localStorage.getItem('user');
  let searchId: number | null = null;

  if (userJson) {
    const parsed = JSON.parse(userJson);
    searchId = parsed.id;
  } else {
    const pacienteIdStr = localStorage.getItem('paciente_actual_id');
    if (pacienteIdStr) searchId = Number(pacienteIdStr);
  }

  if (!searchId) return;

  loading.value = true;
  try {
    const data = await appointmentRepo.getHistory(searchId);
    appointments.value = data || [];

    if (subTab.value === 'activas') {
      const canceladasPorMedico = appointments.value.filter(
        app => app.EstadoCita?.toLowerCase() === 'cancelada' &&
              app.Motivo !== 'Cancelada desde el portal' &&
              app.motivo !== 'Cancelada desde el portal'
      );

      // Verificamos si ya le mostramos esta alerta en la sesión actual
      const yaNotificado = sessionStorage.getItem('medgo_cancelacion_notificada');

      if (canceladasPorMedico.length > 0 && !yaNotificado) {
        toast.error(`Notificación: Tienes ${canceladasPorMedico.length} cita(s) cancelada(s) recientemente por el personal médico.`, {
          timeout: 5000
        });
        // Marcamos que ya se enteró durante esta sesión
        sessionStorage.setItem('medgo_cancelacion_notificada', 'true');
      }
    }
  } catch (error) {
    console.error("Error cargando control de citas:", error);
    toast.error("Error al sincronizar el historial de citas.");
  } finally {
    loading.value = false;
  }
};

const filteredAppointments = computed<ExtendedAppointment[]>(() => {
  if (subTab.value === 'activas') {
    return appointments.value.filter(app => {
      const estado = app.EstadoCita?.toLowerCase() || '';
      return estado === 'pendiente' || estado === 'confirmada';
    });
  }
  return appointments.value;
});

// APERTURA DEL MODAL MULTI-ACCIÓN
const abrirGestionCita = (app: ExtendedAppointment): void => {
  citaSeleccionada.value = app;
  modoConfirmacion.value = 'menu';
  nuevaFechaHora.value = '';
  showActionModal.value = true;
};

// ACCIÓN: EJECUTAR ANULACIÓN ORIGINAL
const ejecutarAnulacion = async (): Promise<void> => {
  if (!citaSeleccionada.value) return;

  loadingAccion.value = true;
  try {
    await appointmentRepo.cancel(citaSeleccionada.value.CitaID);
    toast.success("Cita anulada correctamente.");
    showActionModal.value = false;
    await fetchAppointments();
  } catch {
    toast.error("No se pudo procesar la cancelación de la cita.");
  } finally {
    loadingAccion.value = false;
  }
};

// NUEVA ACCIÓN: EJECUTAR REPROGRAMACIÓN
const ejecutarReprogramacion = async (): Promise<void> => {
  if (!citaSeleccionada.value || !nuevaFechaHora.value) return;

  const fechaFormateada = nuevaFechaHora.value.replace('T', ' ') + ':00';

  loadingAccion.value = true;
  try {
    await appointmentRepo.reschedule(citaSeleccionada.value.CitaID, fechaFormateada);
    toast.success("Cita reprogramada con éxito.");
    showActionModal.value = false;
    await fetchAppointments();
  } catch (error) {
    console.error(error);
    toast.error("Error al reprogramar. Verifique que el formato de fecha sea correcto.");
  } finally {
    loadingAccion.value = false;
  }
};

const formatFecha = (dateStr?: string): string => {
  if (!dateStr) return 'Por definir';
  const date = new Date(dateStr);
  return date.toLocaleDateString('es-HN', { day: 'numeric', month: 'long', year: 'numeric' });
};

const formatHora = (dateStr?: string): string => {
  if (!dateStr) return '00:00';
  const date = new Date(dateStr);
  return date.toLocaleTimeString('es-HN', { hour: '2-digit', minute: '2-digit', hour12: false });
};

watch(() => localStorage.getItem('paciente_actual_id'), (): void => {
  fetchAppointments();
});

onMounted((): void => {
  fetchAppointments();
});
</script>

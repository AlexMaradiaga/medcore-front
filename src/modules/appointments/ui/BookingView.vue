<template>
  <div class="space-y-8 animate-fade-in pb-20 text-left">
    <div class="text-left">
      <h2 class="text-3xl font-black text-slate-800 tracking-tight">AGENDAR NUEVA CITA</h2>
      <p class="text-slate-500 font-medium mt-1">Complete el formulario para registrar su cita médica con el especialista.</p>
    </div>

    <div v-if="selectedDoctor" class="bg-blue-600 rounded-2xl p-6 text-white flex justify-between items-center shadow-lg relative overflow-hidden">
      <div class="flex items-center gap-6 relative z-10">
        <div class="w-20 h-20 bg-white rounded-xl overflow-hidden border-2 border-white/20">
          <img v-if="selectedDoctor.FotoPath" :src="selectedDoctor.FotoPath" class="w-full h-full object-cover" />
          <div v-else class="w-full h-full flex items-center justify-center text-4xl bg-slate-100">👨‍⚕️</div>
        </div>
        <div>
          <h3 class="text-2xl font-bold tracking-tight">Dr. {{ selectedDoctor.Nombre }} {{ selectedDoctor.Apellido }}</h3>
          <p class="text-blue-100 font-medium">{{ selectedDoctor.Especialidad }}</p>
          <p class="text-xs text-blue-200 mt-1">Centro Dermatológico</p>
        </div>
      </div>
      <div class="text-right relative z-10">
        <p class="text-[10px] uppercase font-bold opacity-80 tracking-widest">Tarifa de Consulta</p>
        <p class="text-4xl font-black">$90</p>
      </div>
    </div>

    <div class="bg-white rounded-3xl p-10 shadow-sm border border-slate-100">
      <form @submit.prevent="confirmAppointment" class="space-y-12">

        <section class="space-y-6">
          <div class="flex items-center gap-3 border-l-4 border-blue-600 pl-4">
            <h4 class="text-lg font-black text-slate-800 uppercase tracking-tight">Información Personal</h4>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="flex items-center gap-2 text-xs font-bold text-slate-700"><UsersIcon class="h-4 w-4 text-blue-600"/> Nombre Completo *</label>
              <input v-model="userData.nombre" type="text" readonly class="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium text-slate-500 outline-none" />
            </div>
            <div class="space-y-2">
              <label class="flex items-center gap-2 text-xs font-bold text-slate-700"><EnvelopeIcon class="h-4 w-4 text-blue-600"/> Email *</label>
              <input v-model="userData.email" type="email" readonly class="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium text-slate-500 outline-none" />
            </div>
            <div class="space-y-2">
              <label class="flex items-center gap-2 text-xs font-bold text-slate-700"><PhoneIcon class="h-4 w-4 text-blue-600"/> Teléfono *</label>
              <input type="text" placeholder="+1234567890" class="w-full border border-slate-200 rounded-xl p-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition-all outline-none" />
            </div>
            <div class="space-y-2">
              <label class="flex items-center gap-2 text-xs font-bold text-slate-700"> Edad *</label>
              <input v-model="form.edad" type="number" placeholder="30" class="w-full border border-slate-200 rounded-xl p-3 text-sm focus:border-blue-500 outline-none" />
            </div>
            <div class="md:col-span-2 space-y-2">
              <label class="block text-xs font-bold text-slate-700">Género *</label>
              <select v-model="form.genero" class="w-full border border-slate-200 rounded-xl p-3 text-sm outline-none bg-white">
                <option value="">Seleccione su género</option>
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
              </select>
            </div>
          </div>
        </section>

        <section class="space-y-6">
          <div class="flex items-center gap-3 border-l-4 border-blue-600 pl-4">
            <h4 class="text-lg font-black text-slate-800 uppercase tracking-tight">Detalles de la Cita</h4>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="flex items-center gap-2 text-xs font-bold text-slate-700"><CalendarIcon class="h-4 w-4 text-blue-600"/> Fecha de Cita *</label>
              <input v-model="form.fecha" type="date" class="w-full border border-slate-200 rounded-xl p-3 text-sm outline-none" />
            </div>
            <div class="space-y-2">
              <label class="flex items-center gap-2 text-xs font-bold text-slate-700"><ClockIcon class="h-4 w-4 text-blue-600"/> Hora de Cita *</label>
              <input v-model="form.hora" type="time" @change="closeTimePicker" class="w-full border border-slate-200 rounded-xl p-3 text-sm outline-none" />
            </div>
            <div class="md:col-span-2 space-y-2">
              <label class="flex items-center gap-2 text-xs font-bold text-slate-700"><DocumentTextIcon class="h-4 w-4 text-blue-600"/> Motivo de Consulta *</label>
              <input v-model="form.motivo" type="text" placeholder="Describa brevemente el motivo de su consulta..." class="w-full border border-slate-200 rounded-xl p-3 text-sm outline-none" />
            </div>
            <div class="md:col-span-2 space-y-2">
              <label class="block text-xs font-bold text-slate-700">Síntomas (Opcional)</label>
              <textarea v-model="form.sintomas" rows="2" placeholder="Describa sus síntomas..." class="w-full border border-slate-200 rounded-xl p-3 text-sm outline-none resize-none"></textarea>
            </div>
          </div>
        </section>

        <section class="space-y-6">
          <div class="flex items-center gap-3 border-l-4 border-blue-600 pl-4">
            <h4 class="text-lg font-black text-slate-800 uppercase tracking-tight">Información Médica</h4>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="block text-xs font-bold text-slate-700">Alergias (Opcional)</label>
              <textarea v-model="form.alergias" placeholder="Liste cualquier alergia a medicamentos..." class="w-full border border-slate-200 rounded-xl p-3 text-sm outline-none h-20"></textarea>
            </div>
            <div class="space-y-2">
              <label class="block text-xs font-bold text-slate-700">Medicamentos Actuales (Opcional)</label>
              <textarea v-model="form.medicamentos" placeholder="Liste los medicamentos que está tomando..." class="w-full border border-slate-200 rounded-xl p-3 text-sm outline-none h-20"></textarea>
            </div>
          </div>
        </section>

        <section class="space-y-6">
          <div class="flex items-center gap-3 border-l-4 border-blue-600 pl-4">
            <h4 class="text-lg font-black text-slate-800 uppercase tracking-tight">Información del Seguro (Opcional)</h4>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="block text-xs font-bold text-slate-700">Aseguradora</label>
              <input v-model="form.aseguradora" type="text" placeholder="Nombre de la aseguradora" class="w-full border border-slate-200 rounded-xl p-3 text-sm outline-none" />
            </div>
            <div class="space-y-2">
              <label class="block text-xs font-bold text-slate-700">Número de Póliza</label>
              <input v-model="form.poliza" type="text" placeholder="Número de póliza" class="w-full border border-slate-200 rounded-xl p-3 text-sm outline-none" />
            </div>
          </div>
        </section>

        <section class="space-y-6">
          <div class="flex items-center gap-3 border-l-4 border-blue-600 pl-4">
            <h4 class="text-lg font-black text-slate-800 uppercase tracking-tight">Contacto de Emergencia</h4>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="flex items-center gap-2 text-xs font-bold text-slate-700"><UserIcon class="h-4 w-4 text-blue-600"/> Nombre del Contacto *</label>
              <input v-model="form.contactoNombre" type="text" placeholder="Nombre completo" class="w-full border border-slate-200 rounded-xl p-3 text-sm outline-none" />
            </div>
            <div class="space-y-2">
              <label class="flex items-center gap-2 text-xs font-bold text-slate-700"><PhoneIcon class="h-4 w-4 text-blue-600"/> Teléfono del Contacto *</label>
              <input v-model="form.contactoTel" type="text" placeholder="+1234567890" class="w-full border border-slate-200 rounded-xl p-3 text-sm outline-none" />
            </div>
          </div>
        </section>

        <div class="flex justify-end gap-4 pt-6">
          <button type="button" @click="$emit('cancel')" class="px-6 py-2 rounded-xl text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all">Cancelar</button>
          <button type="submit" class="px-8 py-2 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md transition-all active:scale-95">Confirmar Cita</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { AppointmentRepository } from '../infrastructure/AppointmentRepo';
import type { AppointmentRequest } from '../domain/Appointment';
import {
  UsersIcon, EnvelopeIcon, PhoneIcon, CalendarIcon,
  ClockIcon, DocumentTextIcon, UserIcon
} from '@heroicons/vue/24/outline';

interface Doctor {
  DoctorID: number;
  Nombre: string;
  Apellido: string;
  Especialidad: string;
  EntidadID?: number;
  FotoPath?: string;
}

const props = defineProps<{
  selectedDoctor: Doctor | null;
}>();

const emit = defineEmits(['cancel']);
const appointmentRepo = new AppointmentRepository();
const toast = useToast();
const userData = ref({ id: 0, nombre: '', email: '' });

const form = reactive({
  fecha: '',
  hora: '',
  motivo: '',
  sintomas: '',
  edad: '' as string | number,
  genero: '',
  alergias: '',
  aseguradora: '',
  poliza: '',
  contactoNombre: '',
  contactoTel: '',
  medicamentos: ''
});

onMounted(() => {
  const userJson = localStorage.getItem('user');
  if (userJson) {
    const parsed = JSON.parse(userJson);
    userData.value = {
      id: parsed.id ?? 0,
      nombre: parsed.nombre ?? 'Usuario',
      email: parsed.email ?? ''
    };
  }
});

const confirmAppointment = async () => {
  if (!props.selectedDoctor) return;
  const payload: AppointmentRequest = {
    UsuarioID: userData.value.id,
    doctor_id: Number(props.selectedDoctor.DoctorID),
    entidad_id: props.selectedDoctor.EntidadID || 1,
    fecha_hora: `${form.fecha} ${form.hora}:00`,
    motivo: form.motivo,
    sintomas: form.sintomas,
    alergias: form.alergias,
    edad: Number(form.edad),
    genero: form.genero,
    aseguradora: form.aseguradora,
    numero_poliza: form.poliza,
    nombre_contacto_emergencia: form.contactoNombre,
    telefono_contacto_emergencia: form.contactoTel,
    medicamentos_actuales: form.medicamentos
  };

  try {
    await appointmentRepo.create(payload);
    toast.success("¡Cita agendada correctamente!");
    emit('cancel');
  } catch (error: unknown) {
    let msg = "Error al agendar la cita médica.";
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: { mensaje?: string } } };
      msg = axiosError.response?.data?.mensaje || msg;
    } else if (error instanceof Error) {
      msg = error.message;
    } else if (typeof error === 'string') {
      msg = error;
    }
    toast.error(msg);
  }
};

const closeTimePicker = (event: Event) => {
  const input = event.target as HTMLInputElement;
  input.blur();
};
</script>

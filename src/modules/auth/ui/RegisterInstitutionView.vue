<template>
  <div class="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 sm:p-6 font-premium select-none">
    <div class="max-w-2xl w-full bg-white rounded-[2.5rem] p-6 sm:p-10 shadow-2xl border border-slate-100 relative overflow-hidden text-left">

      <!-- BARRA DE PROGRESO (3 PASOS) -->
      <div class="space-y-2 mb-8">
        <div class="flex justify-between items-center text-xs font-black text-slate-400 uppercase tracking-widest">
          <span>Paso {{ currentStep }} de 3</span>
          <span class="text-[#005596]">{{ porcentajeProgreso }}%</span>
        </div>
        <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            class="h-full bg-linear-to-r from-[#005596] to-[#00a8b5] transition-all duration-500"
            :style="{ width: `${porcentajeProgreso}%` }"
          ></div>
        </div>
      </div>

      <form @submit.prevent="handleNextStep" class="space-y-6">

        <!-- PASO 1: CREACIÓN DE CUENTA INSTITUCIONAL -->
        <div v-if="currentStep === 1" class="space-y-4 animate-fade-in">
          <div>
            <h2 class="text-2xl font-black text-slate-800 uppercase tracking-tight">Creación de Cuenta Institucional</h2>
            <p class="text-slate-400 text-xs font-bold mt-0.5">Crea las credenciales principales de acceso para tu entidad</p>
          </div>

          <div class="space-y-1">
            <label class="block text-[10px] font-black text-slate-500 uppercase tracking-wider">Correo Electrónico Institucional *</label>
            <input v-model="form.email_usuario" type="email" placeholder="admin@clinica.com" class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium outline-none focus:border-[#005596]" required />
          </div>

          <div class="space-y-1">
            <label class="block text-[10px] font-black text-slate-500 uppercase tracking-wider">Teléfono Principal de Contacto *</label>
            <input v-model="form.telefono_principal" type="tel" placeholder="+504 9988-7766" class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium outline-none focus:border-[#005596]" required />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="block text-[10px] font-black text-slate-500 uppercase tracking-wider">Contraseña *</label>
              <input v-model="form.password_usuario" type="password" placeholder="••••••••" class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium outline-none focus:border-[#005596]" required />
            </div>
            <div class="space-y-1">
              <label class="block text-[10px] font-black text-slate-500 uppercase tracking-wider">Confirmar Contraseña *</label>
              <input v-model="passwordConfirm" type="password" placeholder="••••••••" class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium outline-none focus:border-[#005596]" required />
            </div>
          </div>
        </div>

        <!-- PASO 2: INFORMACIÓN GENERAL Y UBICACIÓN -->
        <div v-else-if="currentStep === 2" class="space-y-4 animate-fade-in">
          <div>
            <h2 class="text-2xl font-black text-slate-800 uppercase tracking-tight">Información General de la Entidad</h2>
            <p class="text-slate-400 text-xs font-bold mt-0.5">Datos legales, fiscales y ubicación física del establecimiento</p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="block text-[10px] font-black text-slate-500 uppercase tracking-wider">Nombre Comercial *</label>
              <input v-model="form.nombre_comercial" type="text" placeholder="Ej. Centro Médico San Juan" class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:border-[#005596]" required />
            </div>
            <div class="space-y-1">
              <label class="block text-[10px] font-black text-slate-500 uppercase tracking-wider">Razón Social *</label>
              <input v-model="form.razon_social" type="text" placeholder="Ej. Inversiones Médicas S.A." class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:border-[#005596]" required />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="block text-[10px] font-black text-slate-500 uppercase tracking-wider">RTN *</label>
              <input v-model="form.rtn" type="text" placeholder="08011990123456" class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-mono outline-none focus:border-[#005596]" required />
            </div>
            <div class="space-y-1">
              <label class="block text-[10px] font-black text-slate-500 uppercase tracking-wider">Tipo de Entidad *</label>
              <select v-model="form.tipo_entidad" class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-700 outline-none focus:border-[#005596] cursor-pointer" required>
                <option value="Clinica">Clínica</option>
                <option value="Farmacia">Farmacia</option>
                <option value="Laboratorio">Laboratorio</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="block text-[10px] font-black text-slate-500 uppercase tracking-wider">Departamento *</label>
              <input v-model="form.departamento" type="text" placeholder="Ej. Francisco Morazán" class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:border-[#005596]" required />
            </div>
            <div class="space-y-1">
              <label class="block text-[10px] font-black text-slate-500 uppercase tracking-wider">Municipio *</label>
              <input v-model="form.municipio" type="text" placeholder="Ej. Distrito Central" class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:border-[#005596]" required />
            </div>
          </div>

          <div class="space-y-1">
            <label class="block text-[10px] font-black text-slate-500 uppercase tracking-wider">Dirección Completa *</label>
            <input v-model="form.direccion_completa" type="text" placeholder="Col. Las Mermeladas, Ave. Los Próceres, Edificio 3" class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:border-[#005596]" required />
          </div>
        </div>

        <!-- PASO 3: REPRESENTANTE LEGAL -->
        <div v-else-if="currentStep === 3" class="space-y-4 animate-fade-in">
          <div>
            <h2 class="text-2xl font-black text-slate-800 uppercase tracking-tight">Representante Legal</h2>
            <p class="text-slate-400 text-xs font-bold mt-0.5">Información del apoderado o responsable de la institución</p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="block text-[10px] font-black text-slate-500 uppercase tracking-wider">Nombre Completo *</label>
              <input v-model="form.rep_nombre" type="text" placeholder="Julio Alberto Martínez" class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:border-[#005596]" required />
            </div>
            <div class="space-y-1">
              <label class="block text-[10px] font-black text-slate-500 uppercase tracking-wider">Número de Identidad (DNI) *</label>
              <input v-model="form.rep_dni" type="text" placeholder="0801197820178" class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:border-[#005596]" required />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="block text-[10px] font-black text-slate-500 uppercase tracking-wider">Correo de Contacto *</label>
              <input v-model="form.rep_email" type="email" placeholder="representante@clinica.com" class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:border-[#005596]" required />
            </div>
            <div class="space-y-1">
              <label class="block text-[10px] font-black text-slate-500 uppercase tracking-wider">Teléfono de Contacto *</label>
              <input v-model="form.rep_telefono" type="tel" placeholder="+504 9988-7766" class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:border-[#005596]" required />
            </div>
          </div>

          <div class="space-y-1">
            <label class="block text-[10px] font-black text-slate-500 uppercase tracking-wider">Cargo *</label>
            <input v-model="form.rep_cargo" type="text" placeholder="Ej. Gerente General / Apoderado Legal" class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:border-[#005596]" required />
          </div>
        </div>

        <!-- BOTONES DE NAVEGACIÓN -->
        <div class="flex items-center justify-between pt-6 border-t border-slate-100 gap-4">
          <button
            v-if="currentStep > 1"
            type="button"
            @click="currentStep--"
            class="px-6 py-3 rounded-xl text-xs font-black uppercase text-slate-500 hover:bg-slate-100 transition-all cursor-pointer"
          >
            ← Atrás
          </button>
          <div v-else></div>

          <button
            type="submit"
            :disabled="loading"
            class="px-8 py-3.5 bg-[#005596] hover:bg-[#003d6d] text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md cursor-pointer disabled:opacity-50"
          >
            {{ currentStep === 3 ? 'Finalizar Registro' : 'Continuar →' }}
          </button>
        </div>

      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import type { InstitutionRegistrationPayload } from '../domain/InstitutionRegistration';
import { InstitutionRepositoryImpl } from '../infrastructure/InstitutionRepositoryImpl';

const router = useRouter();
const toast = useToast();
const repo = new InstitutionRepositoryImpl();

const currentStep = ref(1);
const loading = ref(false);
const passwordConfirm = ref('');

const form = reactive<InstitutionRegistrationPayload>({
  email_usuario: '',
  password_usuario: '',
  telefono_principal: '',
  nombre_comercial: '',
  razon_social: '',
  rtn: '',
  tipo_entidad: 'Clinica',
  email_institucional: '',
  telefono_institucional: '',
  rep_nombre: '',
  rep_dni: '',
  rep_email: '',
  rep_telefono: '',
  rep_cargo: 'Gerente General',
  san_nombre: '',
  san_profesion: '',
  san_colegiacion: '',
  san_colegio: '',
  san_email: '',
  san_telefono: '',
  direccion_completa: '',
  departamento: '',
  municipio: ''
});

const porcentajeProgreso = computed(() => Math.round((currentStep.value / 3) * 100));

const handleNextStep = () => {
  if (currentStep.value === 1 && form.password_usuario !== passwordConfirm.value) {
    toast.error('Las contraseñas no coinciden.');
    return;
  }

  if (currentStep.value < 3) {
    currentStep.value++;
  } else {
    void enviarSolicitudFinal();
  }
};

const enviarSolicitudFinal = async () => {
  loading.value = true;

  // Auto-asignación de equivalencias para cumplir las reglas del backend
  form.email_institucional = form.email_usuario;
  form.telefono_institucional = form.telefono_principal;

  if (!form.rep_email) form.rep_email = form.email_usuario;
  if (!form.rep_telefono) form.rep_telefono = form.telefono_principal;

  // Relleno preventivo de valores sanitarios predeterminados
  if (!form.san_nombre) form.san_nombre = form.rep_nombre;
  if (!form.san_profesion) form.san_profesion = 'Director / Regente Sanitario';
  if (!form.san_colegiacion) form.san_colegiacion = 'N/A';
  if (!form.san_colegio) form.san_colegio = 'N/A';
  if (!form.san_email) form.san_email = form.email_usuario;
  if (!form.san_telefono) form.san_telefono = form.telefono_principal;

  try {
    const res = await repo.registerInstitution(form);
    toast.success(res.message || 'Solicitud de alta institucional enviada con éxito.');
    await router.push('/');
  } catch (error: unknown) {
    console.error(error);
    if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error('Ocurrió un error al enviar el expediente institucional.');
    }
  } finally {
    loading.value = false;
  }
};
</script>

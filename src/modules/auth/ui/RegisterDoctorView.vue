<template>
  <div class="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 font-premium select-none">
    <div class="max-w-3xl w-full bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100 relative overflow-hidden animate-fade-in">
      <div class="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-[#005596] to-cyan-500"></div>

      <div class="mb-6 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-2xl font-black text-slate-800 uppercase tracking-tight">Registro de Especialista</h2>
          <p class="text-slate-400 text-xs font-bold mt-0.5">Solicitud de alta médica - Sujeta a validación administrativa</p>
        </div>

        <div class="flex items-center gap-3 bg-slate-50 p-2.5 rounded-2xl border border-slate-100 self-start sm:self-center">
          <div class="w-14 h-14 rounded-xl bg-slate-200 border border-slate-300 overflow-hidden flex items-center justify-center relative group">
            <img v-if="fotoPreview" :src="fotoPreview" class="w-full h-full object-cover" />
            <span v-else class="text-[10px] font-black text-slate-400 text-center uppercase p-1">Sin Foto</span>
          </div>
          <div class="text-left">
            <label class="block text-[9px] font-black text-slate-400 uppercase tracking-wider">Fotografía Profesional</label>
            <input @change="handleFotoUpload" type="file" accept=".jpg,.png" class="hidden" id="foto-doctor" required />
            <label for="foto-doctor" class="mt-1 inline-block bg-[#005596] text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg cursor-pointer hover:brightness-110 transition-all">
              Seleccionar
            </label>
          </div>
        </div>
      </div>

      <form @submit.prevent="registrarDoctor" class="space-y-5 text-left">

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="space-y-1">
            <label class="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Nombre</label>
            <input v-model="form.nombre" type="text" class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/40 text-sm font-medium outline-hidden focus:border-[#005596] transition-all text-slate-700" required />
          </div>
          <div class="space-y-1">
            <label class="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Apellido</label>
            <input v-model="form.apellido" type="text" class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/40 text-sm font-medium outline-hidden focus:border-[#005596] transition-all text-slate-700" required />
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="space-y-1">
            <label class="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Especialidad</label>
            <select v-model="form.especialidad_id" class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/40 text-sm font-medium outline-hidden focus:border-[#005596] transition-all text-slate-700 cursor-pointer" required>
              <option value="" disabled>Seleccione...</option>
              <option :value="1">Medicina General</option>
              <option :value="2">Cardiología</option>
              <option :value="3">Pediatría</option>
            </select>
          </div>
          <div class="space-y-1">
            <label class="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Nº de Colegiación</label>
            <input v-model="form.numero_colegiado" type="text" placeholder="Ej. CMH-12345" class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/40 text-sm font-medium outline-hidden focus:border-[#005596] transition-all text-slate-700 uppercase font-mono" required />
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="space-y-1">
            <label class="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Correo Electrónico</label>
            <input v-model="form.email" type="email" class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/40 text-sm font-medium outline-hidden focus:border-[#005596] transition-all text-slate-700" required />
          </div>
          <div class="space-y-1">
            <label class="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Contraseña</label>
            <input v-model="form.password" type="password" class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/40 text-sm font-medium outline-hidden focus:border-[#005596] transition-all text-slate-700" required />
          </div>
        </div>

        <div class="bg-slate-50/60 p-5 rounded-3xl border border-slate-200/60 space-y-4">
          <h3 class="text-[11px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-200 pb-2">Documentación Legal Requerida (Archivos independientes)</h3>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="space-y-1.5 bg-white p-3 rounded-xl border border-slate-200/80">
              <label class="block text-[10px] font-black text-slate-700 uppercase tracking-tight">1. Título de Médico General (PDF/Imagen)</label>
              <input @change="handleFileChange($event, 'titulo_medico')" type="file" accept=".pdf,.jpg,.png" class="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-black file:bg-slate-800 file:text-white file:cursor-pointer cursor-pointer" required />
            </div>

            <div class="space-y-1.5 bg-white p-3 rounded-xl border border-slate-200/80">
              <label class="block text-[10px] font-black text-slate-700 uppercase tracking-tight">2. Título de Especialidad (PDF/Imagen)</label>
              <input @change="handleFileChange($event, 'titulo_especialista')" type="file" accept=".pdf,.jpg,.png" class="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-black file:bg-slate-800 file:text-white file:cursor-pointer cursor-pointer" required />
            </div>

            <div class="space-y-1.5 bg-white p-3 rounded-xl border border-slate-200/80">
              <label class="block text-[10px] font-black text-slate-700 uppercase tracking-tight">3. Constancia del Colegio Médico (PDF/Imagen)</label>
              <input @change="handleFileChange($event, 'constancia_colegio')" type="file" accept=".pdf,.jpg,.png" class="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-black file:bg-slate-800 file:text-white file:cursor-pointer cursor-pointer" required />
            </div>

            <div class="space-y-1.5 bg-white p-3 rounded-xl border border-slate-200/80">
              <label class="block text-[10px] font-black text-slate-700 uppercase tracking-tight">4. Documento de Identidad / DNI (PDF/Imagen)</label>
              <input @change="handleFileChange($event, 'dni')" type="file" accept=".pdf,.jpg,.png" class="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-black file:bg-slate-800 file:text-white file:cursor-pointer cursor-pointer" required />
            </div>
          </div>
        </div>

        <button type="submit" :disabled="loading" class="w-full py-4 bg-linear-to-r from-[#005596] to-[#00345c] text-white font-black text-xs uppercase tracking-widest rounded-xl hover:brightness-110 transition-all cursor-pointer shadow-md flex items-center justify-center">
          {{ loading ? 'Enviando auditoría de expedientes...' : '🚀 Enviar Solicitud de Registro' }}
        </button>

        <div class="text-center pt-2">
          <router-link to="/" class="text-[10px] font-black text-slate-400 hover:text-slate-600 uppercase tracking-wider underline cursor-pointer">← Volver al Login</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import api from '@/shared/infrastructure/api';

const router = useRouter();
const toast = useToast();
const loading = ref(false);
const fotoPreview = ref<string | null>(null);

const form = ref({
  nombre: '',
  apellido: '',
  especialidad_id: '',
  numero_colegiado: '',
  email: '',
  password: ''
});

interface ExpedienteDoctores {
  fotografia: File | null;
  titulo_medico: File | null;
  titulo_especialista: File | null;
  constancia_colegio: File | null;
  dni: File | null;
}

const archivos = ref<ExpedienteDoctores>({
  fotografia: null,
  titulo_medico: null,
  titulo_especialista: null,
  constancia_colegio: null,
  dni: null
});

const handleFotoUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const file = input.files[0] as File;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("La fotografía profesional no debe superar los 2 MB.");
      input.value = "";
      archivos.value.fotografia = null;
      fotoPreview.value = null;
      return;
    }

    archivos.value.fotografia = file;
    fotoPreview.value = URL.createObjectURL(file);
  } else {
    archivos.value.fotografia = null;
    fotoPreview.value = null;
  }
};

const handleFileChange = (event: Event, tipoKey: keyof ExpedienteDoctores) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const file = input.files[0] as File;

    if (file.size > 3 * 1024 * 1024) {
      toast.error("Este documento clínico no debe superar los 3 MB.");
      input.value = ""; 
      archivos.value[tipoKey] = null;
      return;
    }

    archivos.value[tipoKey] = file;
  } else {
    archivos.value[tipoKey] = null;
  }
};

const registrarDoctor = async () => {
  if (!archivos.value.fotografia) { return toast.warning("Debe cargar su fotografía profesional."); }
  if (!archivos.value.titulo_medico) { return toast.warning("Debe adjuntar el Título de Médico General."); }
  if (!archivos.value.titulo_especialista) { return toast.warning("Debe adjuntar el Título de Especialidad."); }
  if (!archivos.value.constancia_colegio) { return toast.warning("Debe adjuntar la Constancia del Colegio Médico."); }
  if (!archivos.value.dni) { return toast.warning("Debe adjuntar su documento de identidad (DNI)."); }

  loading.value = true;

  const formData = new FormData();
  formData.append('nombre', form.value.nombre);
  formData.append('apellido', form.value.apellido);
  formData.append('especialidad_id', form.value.especialidad_id);
  formData.append('numero_colegiado', form.value.numero_colegiado);
  formData.append('email', form.value.email);
  formData.append('password', form.value.password);

  formData.append('fotografia', archivos.value.fotografia);
  formData.append('titulo_medico', archivos.value.titulo_medico);
  formData.append('titulo_especialista', archivos.value.titulo_especialista);
  formData.append('constancia_colegio', archivos.value.constancia_colegio);
  formData.append('dni', archivos.value.dni);

  try {
    await api.post('/register-doctor', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    toast.success("Solicitud de alta enviada correctamente al departamento de auditoría.");
    router.push('/');
  } catch (error: unknown) {
    console.error(error);
    if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error("Ocurrió un error desconocido al procesar el registro.");
    }
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.font-premium { font-family: 'Montserrat', 'Inter', system-ui, sans-serif; }
.animate-fade-in { animation: fadeIn 0.3s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
</style>

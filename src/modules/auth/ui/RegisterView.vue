<template>
  <div class="min-h-screen w-full flex items-center justify-center bg-vibrante relative overflow-hidden font-sans">

    <div class="hidden lg:block absolute top-[-10%] left-[-10%] w-[45%] h-[45%] rounded-full circulo-azul blur-[130px]"></div>
    <div class="hidden lg:block absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] rounded-full circulo-teal blur-[130px]"></div>

    <div class="w-full h-screen sm:h-auto sm:max-w-md bg-white sm:rounded-[2.5rem] shadow-xl overflow-hidden z-10 flex flex-col border-t sm:border border-gray-100 my-8">

      <div class="bg-medgo-gradient p-8 text-center text-white relative">
        <div class="relative z-10">
          <div class="inline-block bg-white/20 p-3 rounded-xl mb-3 shadow-inner">
            <span class="text-2xl font-black tracking-tighter">M+</span>
          </div>
          <h2 class="text-2xl font-extrabold tracking-tight">Crear Cuenta</h2>
          <p class="text-blue-50 text-xs mt-1 font-medium">Únete al Portal Médico Integral</p>
        </div>
      </div>

      <form @submit.prevent="handleRegister" class="p-8 space-y-4 flex-1">

        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-1">
            <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nombre</label>
            <input v-model="form.nombre" type="text" placeholder="Ej. Juan" class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-medgo-blue outline-none transition-all text-sm" required />
          </div>
          <div class="space-y-1">
            <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Apellido</label>
            <input v-model="form.apellido" type="text" placeholder="Ej. Pérez" class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-medgo-blue outline-none transition-all text-sm" required />
          </div>
        </div>

        <div class="space-y-1">
          <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Número de DNI</label>
          <input v-model="form.dni" type="text" placeholder="0000-0000-00000" class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-medgo-blue outline-none transition-all text-sm" required />
        </div>

        <div class="space-y-1">
          <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Teléfono de Contacto</label>
          <input v-model="form.telefono" type="tel" placeholder="+504 0000-0000" class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-medgo-blue outline-none transition-all text-sm" required />
        </div>

        <div class="space-y-1">
          <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Correo Electrónico</label>
          <input v-model="form.email" type="email" placeholder="correo@ejemplo.com" class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-medgo-blue outline-none transition-all text-sm" required />
        </div>

        <div class="space-y-1">
          <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contraseña</label>
          <input v-model="form.password" type="password" placeholder="••••••••" class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-medgo-blue outline-none transition-all text-sm" required />
        </div>

        <button type="submit" :disabled="loading" class="w-full group relative pt-4">
          <div class="absolute inset-x-0 -bottom-1 h-full bg-black/10 rounded-2xl"></div>
          <div class="relative bg-medgo-blue py-4 rounded-2xl text-white font-black text-sm uppercase tracking-widest active:translate-y-0.5 transition-all flex items-center justify-center">
            <span v-if="!loading">Completar Registro</span>
            <div v-else class="flex space-x-1">
               <div class="w-2 h-2 bg-white rounded-full animate-bounce"></div>
               <div class="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-.3s]"></div>
               <div class="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-.5s]"></div>
            </div>
          </div>
        </button>

        <p class="text-center text-[13px] text-slate-400 font-medium pt-2">
          ¿Ya tienes una cuenta?
          <router-link to="/" class="text-medgo-blue font-black hover:underline ml-1">Inicia Sesión</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { PatientRepositoryImpl } from '@/modules/patients/infraestructure/PatientRepositoryImpl';
import type { Patient } from '@/modules/patients/domain/entities/Patient';

const router = useRouter();
const patientRepo = new PatientRepositoryImpl();
const toast = useToast();
const loading = ref(false);

const form = reactive({
  nombre: '',
  apellido: '',
  dni: '',
  email: '',
  password: '',
  telefono: ''
});

const handleRegister = async () => {
  loading.value = true;
  try {
    const newPatient: Patient = {
      Nombre: form.nombre,
      Apellido: form.apellido,
      DNI: form.dni,
      email: form.email,
      password: form.password,
      Telefono: form.telefono,
      entidad_id: 1
    };

    //await patientRepo.create(newPatient);
    await patientRepo.registerPublic(newPatient);

    toast.success("¡Registro exitoso! Ya puedes ingresar al sistema.");
    router.push('/');
  } catch (error: unknown) {
    let errorMessage = "Ocurrió un problema al procesar su solicitud.";

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'object' && error !== null && 'response' in error) {
      const axiosError = error as { response: { data: { message: string } } };
      errorMessage = axiosError.response.data.message || errorMessage;
    }

    toast.error(errorMessage);
  } finally {
    loading.value = false;
  }
};
</script>

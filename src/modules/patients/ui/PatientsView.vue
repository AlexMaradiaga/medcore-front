<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { PatientRepositoryImpl } from '../infraestructure/PatientRepositoryImpl';
import type { Patient } from '../domain/entities/Patient';
import api from '@/shared/infrastructure/api';

const patientRepo = new PatientRepositoryImpl();
const toast = useToast();

const patients = ref<Patient[]>([]);
const loading = ref(true);
const showModal = ref(false);
const isEditing = ref(false);
const isDependent = ref(false);
const selectedPatientId = ref<string | null>(null);

const showEmancipateModal = ref(false);
const emancipatingPatientName = ref('');
const emancipateForm = ref({
  email: '',
  password: ''
});

const newPatient = ref({
  email: '',
  password: '',
  DNI: '',
  Nombre: '',
  Apellido: '',
  Telefono: '',
  tutor_dni: '',
  parentesco: ''
});

const openEditModal = (patient: Patient) => {
  isEditing.value = true;
  selectedPatientId.value = patient.PacienteID || null;
  const patientData = patient as unknown as Record<string, string | boolean>;

  isDependent.value = !!patientData['es_dependiente'];

  newPatient.value = {
    Nombre: patient.Nombre || '',
    Apellido: patient.Apellido || '',
    DNI: patient.DNI || '',
    Telefono: patient.Telefono || '',
    email: (patientData['email'] as string) || (patientData['Email'] as string) || '',
    password: '',
    tutor_dni: (patientData['tutor_dni'] as string) || '',
    parentesco: (patientData['parentesco'] as string) || ''
  };
  showModal.value = true;
};

const openEmancipateModal = (patient: Patient) => {
  selectedPatientId.value = patient.PacienteID || null;
  emancipatingPatientName.value = `${patient.Nombre} ${patient.Apellido}`;
  emancipateForm.value = {
    email: '',
    password: ''
  };
  showEmancipateModal.value = true;
};

const handleEmancipate = async () => {
  if (!emancipateForm.value.email || !emancipateForm.value.password) {
    toast.warning("Por favor, rellene todos los campos requeridos.");
    return;
  }

  loading.value = true;
  try {
    const response = await api.post(`/pacientes/${selectedPatientId.value}/emancipar`, {
      email: emancipateForm.value.email,
      password: emancipateForm.value.password
    });

    toast.success(response.data.message || "Paciente promovido a cuenta titular con éxito.");
    showEmancipateModal.value = false;

    patients.value = await patientRepo.getAll();
  } catch (error: unknown) {
    let errorMsg = "Ocurrió un error al intentar emancipar al paciente.";

    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      if (axiosError.response?.data?.message) {
        errorMsg = axiosError.response.data.message;
      }
    }

    toast.error(errorMsg);
  } finally {
    loading.value = false;
  }
};

const resetForm = () => {
  showModal.value = false;
  isEditing.value = false;
  isDependent.value = false;
  selectedPatientId.value = null;
  newPatient.value = {
    email: '',
    password: '',
    DNI: '',
    Nombre: '',
    Apellido: '',
    Telefono: '',
    tutor_dni: '',
    parentesco: ''
  };
};

const savePatient = async () => {
  loading.value = true;
  try {
    const payload = {
      ...newPatient.value,
      es_dependiente: isDependent.value
    };

    if (isEditing.value && selectedPatientId.value) {
      await patientRepo.update(selectedPatientId.value, payload);
      toast.success("Paciente actualizado con éxito.");
    } else {
      await patientRepo.create(payload);
      toast.success("Paciente registrado con éxito.");
    }
    resetForm();
    patients.value = await patientRepo.getAll();
  } catch {
    toast.error("Ocurrió un error al intentar procesar el registro clínico.");
  } finally {
    loading.value = false;
  }
};

const deletePatient = async (id: string) => {
  if (window.confirm('¿Está seguro de que desea desactivar este paciente en el sistema?')) {
    try {
      loading.value = true;
      await patientRepo.delete(id);
      patients.value = await patientRepo.getAll();
      toast.success("Paciente desactivado con éxito.");
    } catch {
      toast.error("No se pudo remover el acceso del paciente seleccionado.");
    } finally {
      loading.value = false;
    }
  }
};

onMounted(async () => {
  try {
    patients.value = await patientRepo.getAll();
  } catch {
    toast.error("Error al sincronizar el listado general de pacientes.");
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="p-8">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-slate-800">Listado de Pacientes</h2>
      <button @click="showModal = true; isEditing = false;" class="bg-medgo-blue text-white px-4 py-2 rounded-xl font-bold hover:bg-blue-700 transition">
        + Nuevo Paciente
      </button>
    </div>

    <div class="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
      <table class="w-full text-left border-collapse">
        <thead class="bg-slate-50 border-b border-slate-100 text-slate-400 text-xs font-bold uppercase">
          <tr>
            <th class="p-4">Nombre Completo</th>
            <th class="p-4">Identidad (DNI)</th>
            <th class="p-4">Teléfono</th>
            <th class="p-4 text-center">Tipo</th>
            <th class="p-4 text-center">Estado</th>
            <th class="p-4 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-50">
          <tr v-for="patient in patients" :key="patient.PacienteID" class="hover:bg-slate-50/50 transition">
            <td class="p-4 font-medium text-slate-700">
              {{ patient.Nombre }} {{ patient.Apellido }}
            </td>
            <td class="p-4 text-slate-600">{{ patient.DNI }}</td>
            <td class="p-4 text-slate-600">{{ patient.Telefono }}</td>
            <td class="p-4 text-center">
              <span :class="patient.es_dependiente ? 'text-blue-600 bg-blue-50' : 'text-slate-500 bg-slate-100'"
                    class="px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider">
                {{ patient.es_dependiente ? 'Dependiente' : 'Titular' }}
              </span>
            </td>
            <td class="p-4 text-center">
               <span :class="patient.Estado === '1' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'"
                     class="px-2 py-1 rounded-lg text-xs font-bold">
                 {{ patient.Estado === '1' ? 'Activo' : 'Inactivo' }}
               </span>
            </td>
            <td class="p-4 text-center">
              <button
                v-if="patient.es_dependiente && patient.Estado === '1'"
                @click="openEmancipateModal(patient)"
                class="text-emerald-600 hover:underline font-bold mr-3 cursor-pointer"
                title="Convertir a Cuenta Titular Independiente"
              >
                Independizar
              </button>

              <button @click="openEditModal(patient)" class="text-medgo-blue hover:underline font-bold mr-3 cursor-pointer">Editar</button>
              <button @click="deletePatient(patient.PacienteID!)" class="text-red-500 hover:underline font-bold cursor-pointer">Borrar</button>
            </td>
          </tr>
          <tr v-if="loading && patients.length === 0">
             <td colspan="6" class="p-8 text-center text-slate-400 animate-pulse">Cargando...</td>
          </tr>
          <tr v-if="!loading && patients.length === 0">
             <td colspan="6" class="p-8 text-center text-slate-400">No hay registros.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div v-if="showModal" class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-3xl p-8 w-full max-w-md shadow-xl">
      <h3 class="text-xl font-bold mb-6 text-slate-800">
        {{ isEditing ? 'Editar Paciente' : 'Registrar Nuevo Paciente' }}
      </h3>

      <div class="flex bg-slate-50 p-1 rounded-xl mb-6 border border-slate-100 gap-1">
        <button
          @click="isDependent = false"
          :class="!isDependent ? 'bg-white text-slate-900 font-black shadow-3xs' : 'text-slate-500 font-bold hover:text-slate-800'"
          class="flex-1 py-2 text-[10px] uppercase rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          Paciente Titular
        </button>
        <button
          @click="isDependent = true"
          :class="isDependent ? 'bg-white text-slate-900 font-black shadow-3xs' : 'text-slate-500 font-bold hover:text-slate-800'"
          class="flex-1 py-2 text-[10px] uppercase rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          Dependiente (Menor/Mayor)
        </button>
      </div>

      <div class="space-y-4">
        <input v-model="newPatient.Nombre" placeholder="Nombre" class="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-medgo-blue text-sm font-medium text-slate-700" />
        <input v-model="newPatient.Apellido" placeholder="Apellido" class="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-medgo-blue text-sm font-medium text-slate-700" />
        <input v-model="newPatient.DNI" placeholder="DNI (Identidad)" class="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-medgo-blue text-sm font-medium text-slate-700" />
        <input v-model="newPatient.Telefono" placeholder="Teléfono" class="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-medgo-blue text-sm font-medium text-slate-700" />

        <template v-if="!isDependent">
          <hr class="border-slate-100" />
          <input v-model="newPatient.email" type="email" placeholder="Correo Electrónico" class="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-medgo-blue text-sm font-medium text-slate-700" />
          <input v-if="!isEditing" v-model="newPatient.password" type="password" placeholder="Contraseña de acceso" class="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-medgo-blue text-sm font-medium text-slate-700" />
        </template>

        <template v-else>
          <hr class="border-slate-100" />
          <div class="bg-blue-50/50 p-4 rounded-xl border border-blue-100/50 space-y-4">
            <input v-model="newPatient.tutor_dni" placeholder="DNI del Tutor o Padre" class="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-medgo-blue text-sm font-medium text-slate-700 bg-white" />
            <select v-model="newPatient.parentesco" class="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-medgo-blue text-sm font-medium text-slate-600 bg-white cursor-pointer">
              <option value="" disabled>Seleccione Parentesco...</option>
              <option value="Padre/Madre">Padre / Madre</option>
              <option value="Hijo/a">Hijo /a</option>
              <option value="Tutor Legal">Tutor Legal</option>
              <option value="Cónyuge">Cónyuge</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
        </template>
      </div>

      <div class="flex justify-end mt-8 gap-3">
        <button @click="resetForm" class="px-4 py-2 text-slate-400 font-bold hover:text-slate-600 cursor-pointer">Cancelar</button>
        <button
          @click="savePatient"
          :disabled="loading"
          class="bg-medgo-blue text-white px-6 py-2 rounded-xl font-bold disabled:opacity-50 hover:bg-blue-700 transition cursor-pointer"
        >
          {{ loading ? 'Procesando...' : (isEditing ? 'Actualizar' : 'Guardar') }}
        </button>
      </div>
    </div>
  </div>

  <div v-if="showEmancipateModal" class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-3xl p-8 w-full max-w-md shadow-xl animate-fade-in">
      <div class="flex items-center gap-3 mb-4 text-emerald-600">
        <h3 class="text-xl font-bold text-slate-800">Independizar Paciente</h3>
      </div>

      <p class="text-slate-500 text-xs font-semibold mb-6">
        Estás promoviendo el expediente de <span class="text-slate-800 font-black">{{ emancipatingPatientName }}</span>. Al hacerlo, dejará de depender de su tutor y se le asignarán credenciales de acceso individuales perpetuas.
      </p>

      <div class="space-y-4">
        <div>
          <label class="block text-[11px] font-black uppercase text-slate-400 tracking-wider mb-1.5">Nuevo Correo de Acceso</label>
          <input
            v-model="emancipateForm.email"
            type="email"
            placeholder="ejemplo@correo.com"
            class="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium text-slate-700"
          />
        </div>

        <div>
          <label class="block text-[11px] font-black uppercase text-slate-400 tracking-wider mb-1.5">Contraseña Temporal</label>
          <input
            v-model="emancipateForm.password"
            type="password"
            placeholder="Mínimo 6 caracteres"
            class="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium text-slate-700"
          />
        </div>
      </div>

      <div class="flex justify-end mt-8 gap-3">
        <button @click="showEmancipateModal = false" :disabled="loading" class="px-4 py-2 text-slate-400 font-bold hover:text-slate-600 cursor-pointer">Cancelar</button>
        <button
          @click="handleEmancipate"
          :disabled="loading"
          class="bg-emerald-600 text-white px-6 py-2 rounded-xl font-bold disabled:opacity-50 hover:bg-emerald-700 transition cursor-pointer shadow-xs"
        >
          {{ loading ? 'Sincronizando...' : 'Confirmar Independencia' }}
        </button>
      </div>
    </div>
  </div>
</template>

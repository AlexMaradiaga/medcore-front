<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { PatientRepositoryImpl } from '../infraestructure/PatientRepositoryImpl';
import type { Patient } from '../domain/entities/Patient';

const patientRepo = new PatientRepositoryImpl();
const patients = ref<Patient[]>([]);
const loading = ref(true);

const showModal = ref(false);
const isEditing = ref(false);
const selectedPatientId = ref<string | null>(null);

const newPatient = ref({
  email: '',
  password: '',
  DNI: '',
  Nombre: '',
  Apellido: '',
  Telefono: ''
});

const openEditModal = (patient: Patient) => {
  isEditing.value = true;
  selectedPatientId.value = patient.PacienteID|| null;

  const patientData = patient as unknown as Record<string, string>;

  console.log("Datos del paciente a editar:", patient);
  newPatient.value = {
    Nombre: patient.Nombre || '',
    Apellido: patient.Apellido || '',
    DNI: patient.DNI || '',
    Telefono: patient.Telefono || '',
    email: patientData['email'] || patientData['Email'] || '',
    password: ''
  };
  showModal.value = true;
};

const resetForm = () => {
  showModal.value = false;
  isEditing.value = false;
  selectedPatientId.value = null;
  newPatient.value = { email: '', password: '', DNI: '', Nombre: '', Apellido: '', Telefono: '' };
};

const savePatient = async () => {
  loading.value = true;
  try {
    if (isEditing.value && selectedPatientId.value) {
      await patientRepo.update(selectedPatientId.value, newPatient.value);
      alert("Paciente actualizado con éxito");
    } else {
      await patientRepo.create(newPatient.value);
      alert("Paciente creado con éxito");
    }

    resetForm();
    patients.value = await patientRepo.getAll();
  } catch (error) {
    alert("Error al procesar la solicitud: " + error);
  } finally {
    loading.value = false;
  }
};

const deletePatient = async (id: string) => {
  if (confirm('¿Está seguro de desactivar este paciente?')) {
    try {
      await patientRepo.delete(id);
      patients.value = await patientRepo.getAll();
      alert("Paciente desactivado con éxito");
    } catch {
      alert("No se pudo desactivar al paciente.");
    }
  }
};

onMounted(async () => {
  try {
    patients.value = await patientRepo.getAll();
  } catch (error) {
    console.error("Error al cargar pacientes:", error);
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
            <th class="p-4">Estado</th>
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
            <td class="p-4 text-slate-600">
               <span :class="patient.Estado === '1' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'"
                     class="px-2 py-1 rounded-lg text-xs font-bold">
                 {{ patient.Estado === '1' ? 'Activo' : 'Inactivo' }}
               </span>
            </td>
            <td class="p-4 text-center">
              <button @click="openEditModal(patient)" class="text-medgo-blue hover:underline font-bold mr-3">Editar</button>
              <button @click="deletePatient(patient.PacienteID!)" class="text-red-500 hover:underline font-bold">Borrar</button>
            </td>
          </tr>

          <tr v-if="loading && patients.length === 0">
             <td colspan="5" class="p-8 text-center text-slate-400 animate-pulse">Cargando...</td>
          </tr>
          <tr v-if="!loading && patients.length === 0">
             <td colspan="5" class="p-8 text-center text-slate-400">No hay registros.</td>
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

      <div class="space-y-4">
        <input v-model="newPatient.Nombre" placeholder="Nombre" class="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-medgo-blue" />
        <input v-model="newPatient.Apellido" placeholder="Apellido" class="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-medgo-blue" />
        <input v-model="newPatient.DNI" placeholder="DNI (Identidad)" class="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-medgo-blue" />
        <input v-model="newPatient.Telefono" placeholder="Teléfono" class="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-medgo-blue" />

        <template v-if="!isEditing">
          <hr />
          <input v-model="newPatient.email" type="email" placeholder="Correo Electrónico" class="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-medgo-blue" />
          <input v-model="newPatient.password" type="password" placeholder="Contraseña de acceso" class="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-medgo-blue" />
        </template>
      </div>

      <div class="flex justify-end mt-8 gap-3">
        <button @click="resetForm" class="px-4 py-2 text-slate-400 font-bold hover:text-slate-600">Cancelar</button>
        <button
          @click="savePatient"
          :disabled="loading"
          class="bg-medgo-blue text-white px-6 py-2 rounded-xl font-bold disabled:opacity-50 hover:bg-blue-700 transition"
        >
          {{ loading ? 'Procesando...' : (isEditing ? 'Actualizar' : 'Guardar') }}
        </button>
      </div>
    </div>
  </div>
</template>

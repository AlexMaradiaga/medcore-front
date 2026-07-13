import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Patient } from '@/modules/patients/domain/entities/Patient';
import type { Doctor } from '@/modules/directory/domain/entities/Doctor';

export const useMedicalStore = defineStore('medical', () => {

  const userStorageRaw = localStorage.getItem('user');
  const doctorStorageRaw = localStorage.getItem('doctor_profile');


  const sessionUser = JSON.parse(userStorageRaw || '{}');
  const profileDoctor = JSON.parse(doctorStorageRaw || '{}');

  const doctor = ref<Partial<Doctor>>({
    ...sessionUser,
    ...profileDoctor
  });


  const selectedPatient = ref<Partial<Patient>>(
    JSON.parse(localStorage.getItem('selectedPatient') || '{}')
  );

  const isConsultationActive = ref<boolean>(
    JSON.parse(localStorage.getItem('isConsultationActive') || 'false')
  );

  const doctorFullName = computed(() => {
    const docObj = doctor.value as Record<string, unknown>;

    const nombre = (docObj.Nombre || docObj.nombre) as string | undefined;
    const apellido = (docObj.Apellido || docObj.apellido) as string | undefined;
    const nombreCompleto = (docObj.NombreCompleto || docObj.nombreCompleto) as string | undefined;


    if (nombre) {
      return `${nombre} ${apellido || ''}`.trim();
    } else if (nombreCompleto) {
      return `${nombreCompleto}`.trim();
    }

    return 'Médico';
  });

  const canAccessMedicalMenu = computed(() => {
    return !!selectedPatient.value.PacienteID && isConsultationActive.value;
  });

  const hasPatientSelected = computed(() => !!selectedPatient.value.PacienteID);

  function setConsultationActive(status: boolean) {
    isConsultationActive.value = status;
    localStorage.setItem('isConsultationActive', JSON.stringify(status));
  }

  function setPatient(patientData: Patient) {
    selectedPatient.value = patientData;
    localStorage.setItem('selectedPatient', JSON.stringify(patientData));
  }

  function setDoctor(doctorData: Doctor) {

    const userSession = JSON.parse(localStorage.getItem('user') || '{}');

    doctor.value = {
      ...userSession,
      ...doctorData
    };

    localStorage.setItem('doctor_profile', JSON.stringify(doctorData));
  }

  function clearPatient() {
    selectedPatient.value = {};
    localStorage.removeItem('selectedPatient');
  }

  return {
    doctor,
    selectedPatient,
    isConsultationActive,
    doctorFullName,
    hasPatientSelected,
    canAccessMedicalMenu,
    setPatient,
    setConsultationActive,
    setDoctor,
    clearPatient
  };
});

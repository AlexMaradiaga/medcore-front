import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Patient } from '@/modules/patients/domain/entities/Patient'
import type { Doctor } from '@/modules/directory/domain/entities/Doctor';

export const useMedicalStore = defineStore('medical', () => {

  const doctor = ref<Partial<Doctor>>(
    JSON.parse(localStorage.getItem('user') || '{}')
  );

  const selectedPatient = ref<Partial<Patient>>(
    JSON.parse(localStorage.getItem('selectedPatient') || '{}')
  );

  const isConsultationActive = ref<boolean>(
    JSON.parse(localStorage.getItem('isConsultationActive') || 'false')
  );

  const doctorFullName = computed(() => {
    return doctor.value.Nombre
      ? `Dr. ${doctor.value.Nombre} ${doctor.value.Apellido || ''}`
      : 'Médico';
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
    doctor.value = doctorData;
    localStorage.setItem('user', JSON.stringify(doctorData));
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

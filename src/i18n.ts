import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  legacy: false,
  locale: 'es',
  fallbackLocale: 'en',
  messages: {
    es: {
      header: { portal: 'Portal del Paciente' },
      tabs: {
        directory: 'Directorio',
        schedule: 'Agendar',
        appointments: 'Mis Citas',
        history: 'Historial'
      },
      directory: {
        title: 'Directorio Médico',
        subtitle: 'Encuentre al especialista ideal para su salud',
        searchPlaceholder: 'Buscar por nombre o especialidad...',
        searchBtn: 'Buscar',
        advancedFilters: 'Filtros Avanzados',
        clearFilters: 'Limpiar filtros',
        specialty: 'Especialidad',
        allSpecialties: 'Todas las especialidades',
        orderBy: 'Ordenar por',
        proximity: 'Cercanía',
        rating: 'Puntuación',
        immediate: 'Consulta Inmediata',
        speaksEnglish: 'Habla Inglés',
        noResults: 'No se encontraron resultados',
        clearAll: 'Limpiar todos los filtros'
      },
      doctor: {
        active: 'Activo',
        bookAppointment: 'Agendar Cita'
      },
      schedule: {
        title: 'Agendar Cita',
        prompt: '"Seleccione un médico del directorio para agendar una cita"',
        goToDirectory: 'Ir al Directorio ahora',
        step1: 'Horario',
        step2: 'Paciente',
        step3: 'Clínica',
        step4: 'Pago'
      },
      settings: {
        languageTitle: 'Idioma del Sistema',
        languageSubtitle: 'Seleccione su idioma de preferencia para toda la plataforma MedCore',
        themeTitle: 'Personalización de Interfaz',
        themeSubtitle: 'Cambie el aspecto visual y el tema base de los componentes institucionales',
        selectLabel: 'Seleccionar Tema Base:',
        themeDefault: 'Por defecto',
        accentColor: 'Modificar color de acento:'
      }
    },
    en: {
      header: { portal: 'Patient Portal' },
      tabs: {
        directory: 'Directory',
        schedule: 'Schedule',
        appointments: 'My Appointments',
        history: 'Medical History'
      },
      directory: {
        title: 'Medical Directory',
        subtitle: 'Find the ideal specialist for your health',
        searchPlaceholder: 'Search by name or specialty...',
        searchBtn: 'Search',
        advancedFilters: 'Advanced Filters',
        clearFilters: 'Clear filters',
        specialty: 'Specialty',
        allSpecialties: 'All specialties',
        orderBy: 'Order by',
        proximity: 'Proximity',
        rating: 'Rating',
        immediate: 'Immediate Consultation',
        speaksEnglish: 'Speaks English',
        noResults: 'No results found',
        clearAll: 'Clear all filters'
      },
      doctor: {
        active: 'Active',
        bookAppointment: 'Book Appointment'
      },
      schedule: {
        title: 'Book Appointment',
        prompt: '"Select a doctor from the directory to schedule an appointment"',
        goToDirectory: 'Go to Directory now',
        step1: 'Schedule',
        step2: 'Patient',
        step3: 'Clinic',
        step4: 'Payment'
      },
      settings: {
        languageTitle: 'System Language',
        languageSubtitle: 'Select your preferred language for the entire MedCore platform',
        themeTitle: 'Interface Customization',
        themeSubtitle: 'Change the visual appearance and base theme of institutional components',
        selectLabel: 'Select Base Theme:',
        themeDefault: 'Default',
        accentColor: 'Modify accent color:'
      }
    }
  }
})

export default i18n

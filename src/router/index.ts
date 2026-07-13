import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/modules/auth/ui/LoginView.vue'
import DashboardView from '@/modules/auth/ui/DashboardView.vue';
import RegisterView from '@/modules/auth/ui/RegisterView.vue'
import DirectoryView from '@/modules/directory/ui/DirectoryView.vue'
import PatientProfileView from '@/modules/doctor/ui/PatientProfileView.vue';
import RegisterDoctorView from '@/modules/auth/ui/RegisterDoctorView.vue';
import DoctorLabPage from '@/modules/doctor/ui/DoctorLabPage.vue';
import ClinicAdminView from '@/modules/clinic/ui/ClinicAdminView.vue';


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: LoginView },
    { path: '/register', name: 'register', component: RegisterView },
    { path: '/dashboard', name: 'dashboard', component: DashboardView },
    { path: '/directorio', name: 'directory', component: DirectoryView },
    {
      path: '/pacientes',
      name: 'patients',
      component: () => import('@/modules/patients/ui/PatientsView.vue')
    },
    {
      path: '/medico/dashboard',
      name: 'doctor-dashboard',
      component: () => import('@/modules/doctor/ui/DoctorDashboard.vue'),
      meta: { requiresAuth: true, role: 'Doctor' }
    },
    {
      path: '/medico/consulta',
      name: 'doctor-consultation',
      component: () => import('@/modules/doctor/ui/ConsultationView.vue'),
      meta: { requiresAuth: true, role: 'Doctor' }
    },
    {
      path: '/medico/perfil',
      name: 'patient-profile',
      component: PatientProfileView,
      meta: { requiresAuth: true, role: 'Doctor' }
    },
    {
      path: '/medico/historial',
      name: 'Historial',
      component: () => import('@/modules/doctor/ui/HistoryPage.vue'),
      meta: { requiresAuth: true, role: 'Doctor' }
    },
    {
      path: '/medico/pacientes',
      name: 'medico-pacientes',
      component: () => import('@/modules/doctor/ui/MyPatientsPage.vue'),
      meta: { requiresAuth: true, role: 'Doctor' }
    },
    {
      path: '/medico/agenda',
      name: 'Agenda',
      component: () => import('@/modules/doctor/ui/AgendaPage.vue'),
      meta: { requiresAuth: true, role: 'Doctor' }
    },
    {
      path: '/medico/receta/:id?',
      name: 'doctor-prescription',
      component: () => import('@/modules/doctor/ui/PrescriptionPage.vue')
    },
    {
      path: '/medico/consulta/:id/resumen',
      name: 'consulta-resumen',
      component: () => import('@/modules/doctor/ui/ConsultaResumenView.vue'),
      meta: { requiresAuth: true, role: 'Doctor' }
    },
    {
      path: '/register-doctor',
      name: 'register-doctor',
      component: RegisterDoctorView
    },
    {
      path: '/medico/consulta/cierre/:id',
      name: 'ConsultaCierre',
      component: () => import('@/modules/consultations/ui/components/BillingModal.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/reporte-ejecutivo',
      name: 'ReporteEjecutivo',
      component: () => import('@/views/reports/ReporteEjecutivoView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/paciente/laboratorio',
      name: 'PacienteLaboratorio',
      component: () => import('@/modules/laboratories/ui/PatientLabView.vue'),
      meta: { requiresAuth: true, role: 'Paciente' }
    },
    {
      path: '/medico/laboratorio',
      name: 'doctor-laboratory',
      component: DoctorLabPage,
      meta: { requiresAuth: true, role: 'Doctor' }
    },
    {
      path: '/clinica/dashboard',
      name: 'ClinicDashboard',
      component: ClinicAdminView,
      meta: { requiresAuth: true }
    },
    {
      path: '/laboratorio/dashboard',
      name: 'LaboratoryDashboard',
      component: () => import('@/modules/laboratories/ui/components/LabDashboardView.vue'),
      meta: { requiresAuth: true }
    },
  ]
})


router.beforeEach((to, _from) => {
  const publicPages = ['/', '/register', '/register-doctor'];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem('token');

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const role = user.rol_id || user.RolID;
  const entidadId = user.entidadId || user.entidad_id || user.EntidadID;
  const tipoEntidad = user.tipo_entidad || user.TipoEntidad;

  if (authRequired && !loggedIn) {
    return '/';
  }

  if (to.path.startsWith('/medico') && role !== 2) {
    console.warn("Acceso denegado a ruta médica. Rol actual:", role);

    if (role === 3) return '/directorio';
    return '/';
  }
  if (to.path === '/dashboard' && role === 2) {
    return '/medico/dashboard';
  }

  if (to.path === '/dashboard' && role === 1 && entidadId && Number(entidadId) !== 1) {
    if (tipoEntidad === 'Laboratorio') return '/laboratorio/dashboard';
    if (tipoEntidad === 'Clinica') return '/clinica/dashboard';
  }

  return true;
});

export default router


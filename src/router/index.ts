import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/modules/auth/ui/LoginView.vue'
import DashboardView from '@/modules/auth/ui/DashboardView.vue';
import RegisterView from '@/modules/auth/ui/RegisterView.vue'
import DirectoryView from '@/modules/directory/ui/DirectoryView.vue'
import PatientProfileView from '@/modules/doctor/ui/PatientProfileView.vue';

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
      meta: { requiresAuth: true, role: 'Doctor' } // <-- CORREGIDO: Agregado protección
    },
    {
      path: '/medico/consulta',
      name: 'doctor-consultation',
      component: () => import('@/modules/doctor/ui/ConsultationView.vue'),
      meta: { requiresAuth: true, role: 'Doctor' } // <-- CORREGIDO: Agregado protección
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
      path: '/medico/receta',
      name: 'doctor-prescription',
      component: () => import('@/modules/doctor/ui/PrescriptionPage.vue')
    }
  ]
})


router.beforeEach((to, _from) => {
  const publicPages = ['/', '/register'];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem('token');

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const role = user.rol_id || user.RolID;


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

  
  return true;
});

export default router

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
      component: () => import('@/modules/doctor/ui/DoctorDashboard.vue')
    },
    {
      path: '/medico/consulta',
      name: 'doctor-consultation',
      component: () => import('@/modules/doctor/ui/ConsultationView.vue')
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
    }
  ]
})

router.beforeEach((to, from, next) => {
  const publicPages = ['/', '/register'];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem('token');

  // Obtenemos el usuario y normalizamos el acceso al ID del rol
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const role = user.rol_id || user.RolID; // Soporta ambos por si acaso

  // 1. Si no está logueado y va a una página privada -> al Login
  if (authRequired && !loggedIn) {
    return next('/');
  }

  // 2. Si intenta ir a rutas de médico pero NO tiene el rol 2
  if (to.path.startsWith('/medico') && role !== 2) {
    console.warn("Acceso denegado a ruta médica. Rol actual:", role);

    // Redirección inteligente: si es paciente (3) al directorio, si no al login
    if (role === 3) return next('/directorio');
    return next('/');
  }

  // 3. (Opcional) Si el médico intenta entrar al dashboard de Admin (ID 1 o 3 según tu lógica)
  if (to.path === '/dashboard' && role === 2) {
    return next('/medico/dashboard');
  }

  next();
});

export default router

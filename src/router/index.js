import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

import HomeView from '../views/HomeView.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import ForgotPasswordView from '../views/ForgotPasswordView.vue';
import UserProfileView from '../views/UserProfileView.vue';
import ActivitiesView from '../views/ActivitiesView.vue';
import MenuView from '../views/MenuView.vue';
import UserReservationsView from '../views/UserReservationsView.vue';
import UserDashboardView from '../views/UserDashboardView.vue';
import ConfirmEmailView from '../views/ConfirmEmailView.vue';
import ResetPasswordView from '../views/ResetPasswordView.vue';

// Admin Views
import AdminDashboardView from '../views/admin/AdminDashboardView.vue';
import AdminActivitiesView from '../views/admin/AdminActivitiesView.vue';
import AdminMenuView from '../views/admin/AdminMenuView.vue';
import AdminReservationsView from '../views/admin/AdminReservationsView.vue';
import AdminAvailabilityView from '../views/admin/AdminAvailabilityView.vue';
import AdminSchedulesView from '../views/admin/AdminSchedulesView.vue';
import AdminPricesView from '../views/admin/AdminPricesView.vue';
import AdminActivityTypesView from '../views/admin/AdminActivityTypesView.vue';
import AdminDocTypesView from '../views/admin/AdminDocTypesView.vue';
import AdminUsersView from '../views/admin/AdminUsersView.vue';
import AdminRolesView from '../views/admin/AdminRolesView.vue';

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/login', name: 'login', component: LoginView, meta: { publicOnly: true } },
  { path: '/registro', name: 'registro', component: RegisterView, meta: { publicOnly: true } },
  {
    path: '/confirmar-correo',
    name: 'confirmar-correo',
    component: ConfirmEmailView
  },
  { path: '/recuperar-clave', name: 'recuperar-clave', component: ForgotPasswordView },
  { path: '/restablecer-contrasena', name: 'restablecer-contrasena', component: ResetPasswordView },
  { path: '/actividades', name: 'actividades', component: ActivitiesView },
  { path: '/menu', name: 'menu', component: MenuView },

  // Rutas de Usuario Cliente Autenticado
  { path: '/panel-usuario', name: 'panel-usuario', component: UserDashboardView, meta: { requiresAuth: true } },
  { path: '/mis-reservas', name: 'mis-reservas', component: UserReservationsView, meta: { requiresAuth: true } },
  { path: '/perfil', name: 'perfil', component: UserProfileView, meta: { requiresAuth: true } },

  // Rutas de Administración (Admin o Empleado)
  { path: '/admin', name: 'admin-dashboard', component: AdminDashboardView, meta: { requiresAdminOrEmpleado: true } },
  { path: '/admin/actividades', name: 'admin-actividades', component: AdminActivitiesView, meta: { requiresAdminOrEmpleado: true } },
  { path: '/admin/menu', name: 'admin-menu', component: AdminMenuView, meta: { requiresAdminOrEmpleado: true } },
  { path: '/admin/reservas', name: 'admin-reservas', component: AdminReservationsView, meta: { requiresAdminOrEmpleado: true } },
  { path: '/admin/disponibilidad', name: 'admin-disponibilidad', component: AdminAvailabilityView, meta: { requiresAdminOrEmpleado: true } },
  { path: '/admin/horarios', name: 'admin-horarios', component: AdminSchedulesView, meta: { requiresAdminOrEmpleado: true } },
  { path: '/admin/precios', name: 'admin-precios', component: AdminPricesView, meta: { requiresAdminOrEmpleado: true } },
  { path: '/admin/tipos-actividad', name: 'admin-tipos-actividad', component: AdminActivityTypesView, meta: { requiresAdminOrEmpleado: true } },
  { path: '/admin/tipos-doc', name: 'admin-tipos-doc', component: AdminDocTypesView, meta: { requiresAdminOrEmpleado: true } },
  { path: '/admin/usuarios', name: 'admin-usuarios', component: AdminUsersView, meta: { requiresAdminOrEmpleado: true } },
  { path: '/admin/roles', name: 'admin-roles', component: AdminRolesView, meta: { requiresAdminOrEmpleado: true } },

  // Catch-all 404
  { path: '/:pathMatch(.*)*', redirect: '/' }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 };
  }
});

// Guardas de seguridad equivalentes a Filtro.java
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  if (authStore.loading) {
    await authStore.initSession();
  }

  // Redirigir a panel si ya tiene sesión e intenta abrir login/registro
  if (to.meta.publicOnly && authStore.isAuthenticated) {
    if (authStore.isAdminOrEmpleado) {
      return next('/admin');
    }
    return next('/panel-usuario');
  }

  // Protección de rutas privadas
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next({ path: '/login', query: { redirect: to.fullPath } });
  }

  // Protección de módulo administrativo
  if (to.meta.requiresAdminOrEmpleado && !authStore.isAdminOrEmpleado) {
    return next('/panel-usuario');
  }

  next();
});

export default router;

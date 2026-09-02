import { defineStore } from 'pinia';
import { authService } from '../services/auth.service';
import { supabase } from '../services/supabase';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    profile: null,
    loading: true
  }),

  getters: {
    isAuthenticated: (state) => !!state.profile,
    // Rol 1 = Administrador, Rol 3 = Empleado
    isAdmin: (state) => state.profile?.roles_idroles === 1,
    isEmpleado: (state) => state.profile?.roles_idroles === 3,
    isCliente: (state) => state.profile?.roles_idroles === 2,
    isAdminOrEmpleado: (state) => state.profile?.roles_idroles === 1 || state.profile?.roles_idroles === 3,
    idUsuario: (state) => state.profile?.idusuarios || null,
    nombreUsuario: (state) => state.profile ? `${state.profile.nombre} ${state.profile.apellido}` : ''
  },

  actions: {
    async initSession() {
      this.loading = true;
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.email) {
          this.user = session.user;
          this.profile = await authService.getProfile(session.user.email);
        } else {
          // Intentar recuperación desde localStorage mock si no hay Supabase Auth activo
          const savedProfile = localStorage.getItem('usuario_sesion');
          if (savedProfile) {
            this.profile = JSON.parse(savedProfile);
          }
        }
      } catch (err) {
        console.error('Error al inicializar sesión:', err);
      } finally {
        this.loading = false;
      }
    },

    setSession(user, profile) {
      this.user = user;
      this.profile = profile;
      localStorage.setItem('usuario_sesion', JSON.stringify(profile));
    },

    async logout() {
      try {
        await authService.logout();
      } catch (e) {
        // Ignorar si ya estaba desconectado
      }
      this.user = null;
      this.profile = null;
      localStorage.removeItem('usuario_sesion');
    }
  }
});

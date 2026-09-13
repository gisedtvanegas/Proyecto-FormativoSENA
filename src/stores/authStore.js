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
    // El perfil por sí solo no es una sesión válida: debe venir acompañado del
    // usuario autenticado por Supabase.
    isAuthenticated: (state) => !!state.user && !!state.profile,
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
          // auth_user_id no cambia cuando el usuario confirma un nuevo correo.
          this.profile = await authService.getProfileByAuthUserId(session.user.id);
        } else {
          this.user = null;
          this.profile = null;
          // Eliminar sesiones visuales de versiones anteriores. Nunca se debe
          // considerar autenticado a alguien solo por datos en localStorage.
          localStorage.removeItem('usuario_sesion');
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
      localStorage.removeItem('usuario_sesion');
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

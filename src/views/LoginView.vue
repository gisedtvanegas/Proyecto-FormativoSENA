<template>
  <div class="login-page-wrapper">
    <div class="Formulario">
      <h2>Iniciar Sesion</h2>
      
      <form @submit.prevent="handleLogin">
        <label for="usuario"><span class="material-symbols-outlined">account_circle</span></label>
        <input type="text" name="usuario" id="usuario" placeholder="Documento" v-model="usuario" required />

        <label for="pass"><span class="material-symbols-outlined">lock</span></label>
        <input type="password" name="pass" id="pass" placeholder="clave" v-model="pass" required />

        <p class="enlace-recuperacion">
          ¿Te olvidaste de la contraseña? <router-link to="/recuperar-clave">Recuperar</router-link>
        </p>

        <p v-if="mensajeError" class="mensaje">{{ mensajeError }}</p>
        <p v-if="mensajeExito" class="mensaje">{{ mensajeExito }}</p>

        <button type="submit" :disabled="cargando">
          {{ cargando ? 'Iniciando...' : 'Iniciar Sesión' }}
        </button>
        <button type="button" @click="goRegister">Registrarse</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../stores/authStore';
import { useRouter } from 'vue-router';

const usuario = ref('');
const pass = ref('');
const mensajeError = ref('');
const mensajeExito = ref('');
const cargando = ref(false);

const authStore = useAuthStore();
const router = useRouter();

const goRegister = () => {
  router.push('/registro');
};

const handleLogin = async () => {
  mensajeError.value = '';
  cargando.value = true;

  try {
    const { user, profile } = await authService.login(usuario.value, pass.value);
    authStore.setSession(user, profile);

    mensajeExito.value = `Bienvenido: ${profile.nombre}`;

    setTimeout(() => {
      if (profile.roles_idroles === 1 || profile.roles_idroles === 3) {
        router.push('/admin');
      } else {
        router.push('/panel-usuario');
      }
    }, 600);
  } catch (err) {
    mensajeError.value = err.message || 'Error al iniciar sesión';
  } finally {
    cargando.value = false;
  }
};
</script>

<style scoped>
.login-page-wrapper {
  padding-top: 140px;
  padding-bottom: 80px;
}
</style>

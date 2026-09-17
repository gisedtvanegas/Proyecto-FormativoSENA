<template>
  <div class="login-page-wrapper">
    <div class="login-container">
      <!-- Lado del Formulario -->
      <div class="login-form-section">
        <!-- Logo / Marca -->
        <div class="brand-header">
          <router-link to="/" class="brand-logo-link">
            <img src="../assets/img/logo.png" alt="Casa y Jardín" class="brand-logo" />
            <span class="brand-name">Casa y Jardín</span>
          </router-link>
        </div>

        <!-- Títulos -->
        <div class="login-title-box">
          <h1 class="login-main-title">Iniciar Sesión</h1>
          <p class="login-subtitle">Ingresa a tu cuenta</p>
        </div>

        <!-- Formulario -->
        <form class="login-form" @submit.prevent="handleLogin">
          <div class="input-group">
            <input
              type="text"
              name="usuario"
              id="usuario"
              placeholder="Documento"
              v-model="usuario"
              autocomplete="username"
              required
            />
          </div>

          <div class="input-group">
            <input
              type="password"
              name="pass"
              id="pass"
              placeholder="Contraseña"
              v-model="pass"
              autocomplete="current-password"
              required
            />
          </div>

          <div class="login-options">
            <router-link to="/recuperar-clave" class="forgot-link">
              ¿Te olvidaste de la contraseña?
            </router-link>
          </div>

          <div v-if="mensajeError" class="login-alert error">
            {{ mensajeError }}
          </div>
          <div v-if="mensajeExito" class="login-alert success">
            {{ mensajeExito }}
          </div>

          <!-- Botón Principal Verde -->
          <button type="submit" class="btn-primary-login" :disabled="cargando">
            {{ cargando ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
          </button>

          <!-- Divisor 'O' -->
          <div class="divider">
            <span>O</span>
          </div>

          <!-- Botón Secundario Registrarse -->
          <button type="button" class="btn-secondary-register" @click="goRegister">
            Registrarse
          </button>

          <!-- Pie con Enlace a Volver -->
          <div class="login-footer-links">
            <p class="account-switch">
              ¿No tienes una cuenta?
              <router-link to="/registro" class="text-link">Regístrate</router-link>
            </p>
            <button type="button" class="btn-back-home" @click="goHome">
              &#8592; Volver al inicio
            </button>
          </div>
        </form>
      </div>

      <!-- Lado de la Ilustración -->
      <div class="login-illustration-section">
        <div class="illustration-card">
          <img src="../assets/img/login-art.png" alt="Ilustración Casa y Jardín" class="illustration-image" />
        </div>
      </div>
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

const goHome = () => {
  router.push('/');
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
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f7f9fa;
  padding: 30px 20px;
  box-sizing: border-box;
}

.login-container {
  display: grid;
  grid-template-columns: minmax(320px, 1fr) minmax(320px, 1.05fr);
  width: min(940px, 100%);
  min-height: 560px;
  background: #ffffff;
  border-radius: 32px;
  box-shadow: 0 20px 60px rgba(20, 62, 94, 0.08);
  border: 1px solid rgba(229, 231, 235, 0.8);
  overflow: hidden;
  align-items: center;
}

/* Lado Izquierdo: Formulario */
.login-form-section {
  padding: 44px 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.brand-header {
  margin-bottom: 24px;
}

.brand-logo-link {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
}

.brand-logo {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.brand-name {
  font-size: 1.1rem;
  font-weight: 800;
  color: #111827;
  letter-spacing: -0.3px;
}

.login-title-box {
  margin-bottom: 22px;
}

.login-main-title {
  font-size: 1.95rem;
  font-weight: 800;
  color: #111827;
  margin: 0 0 6px 0;
  line-height: 1.2;
}

.login-subtitle {
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin: 0;
}

.login-form {
  display: flex;
  flex-direction: column;
}

.input-group {
  margin-bottom: 14px;
}

.input-group input {
  width: 100%;
  height: 48px;
  padding: 0 20px;
  border: 1.5px solid #d1d5db;
  border-radius: 9999px;
  font-size: 0.95rem;
  color: #111827;
  background-color: #ffffff;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.input-group input::placeholder {
  color: #9ca3af;
}

.input-group input:focus {
  border-color: #0d8650;
  box-shadow: 0 0 0 3px rgba(13, 134, 80, 0.14);
}

.login-options {
  display: flex;
  justify-content: flex-end;
  margin-top: 2px;
  margin-bottom: 18px;
}

.forgot-link {
  font-size: 0.85rem;
  color: #4b5563;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

.forgot-link:hover {
  color: #0d8650;
  text-decoration: underline;
}

.login-alert {
  padding: 10px 16px;
  border-radius: 12px;
  font-size: 0.88rem;
  font-weight: 600;
  margin-bottom: 16px;
  text-align: center;
}

.login-alert.error {
  background-color: #fee2e2;
  color: #991b1b;
  border: 1px solid #fecaca;
}

.login-alert.success {
  background-color: #dcfce7;
  color: #166534;
  border: 1px solid #bbf7d0;
}

/* Botón Principal Verde */
.btn-primary-login {
  width: 100%;
  height: 48px;
  background: #0d8650;
  color: #ffffff;
  border: none;
  border-radius: 9999px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
}

.btn-primary-login:hover:not(:disabled) {
  background: #0a6f42;
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(13, 134, 80, 0.28);
}

.btn-primary-login:disabled {
  opacity: 0.7;
  cursor: wait;
}

/* Divisor O */
.divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 16px 0;
  color: #6b7280;
  font-size: 0.88rem;
  font-weight: 600;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #e5e7eb;
}

.divider span {
  padding: 0 12px;
}

/* Botón Secundario Registrarse */
.btn-secondary-register {
  width: 100%;
  height: 48px;
  background: #ffffff;
  color: #374151;
  border: 1.5px solid #d1d5db;
  border-radius: 9999px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}

.btn-secondary-register:hover {
  background-color: #f9fafb;
  border-color: #9ca3af;
  color: #111827;
}

/* Footer Links */
.login-footer-links {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.account-switch {
  margin: 0;
  font-size: 0.88rem;
  color: #4b5563;
}

.text-link {
  color: #0d8650;
  font-weight: 700;
  text-decoration: none;
  margin-left: 4px;
}

.text-link:hover {
  text-decoration: underline;
}

.btn-back-home {
  background: transparent;
  border: none;
  color: #143e5e;
  font-size: 0.88rem;
  font-weight: 700;
  cursor: pointer;
  padding: 6px 10px;
  transition: transform 0.2s ease, color 0.2s ease;
}

.btn-back-home:hover {
  color: #0b253a;
  transform: translateX(-3px);
  text-decoration: underline;
}

/* Lado Derecho: Ilustración */
.login-illustration-section {
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  box-sizing: border-box;
}

.illustration-card {
  width: 100%;
  max-width: 420px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.illustration-image {
  width: 100%;
  height: auto;
  max-height: 520px;
  object-fit: contain;
  border-radius: 28px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}

/* Responsive */
@media (max-width: 820px) {
  .login-container {
    grid-template-columns: 1fr;
    max-width: 480px;
  }

  .login-illustration-section {
    display: none;
  }

  .login-form-section {
    padding: 36px 24px;
  }
}
</style>


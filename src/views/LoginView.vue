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
          <p class="login-subtitle">Ingresa con tu documento o correo electrónico</p>
        </div>

        <!-- Formulario -->
        <form class="login-form" @submit.prevent="handleLogin">
          <div class="input-group">
            <input
              type="text"
              name="usuario"
              id="usuario"
              placeholder="Documento o Correo"
              v-model="usuario"
              @input="onUsuarioInput"
              autocomplete="username"
              required
            />
          </div>

          <div class="input-group password-group">
            <input
              :type="mostrarClave ? 'text' : 'password'"
              name="pass"
              id="pass"
              placeholder="Contraseña"
              v-model="pass"
              autocomplete="current-password"
              required
            />
            <button
              type="button"
              class="toggle-pass-btn"
              @click="mostrarClave = !mostrarClave"
              :aria-label="mostrarClave ? 'Ocultar contraseña' : 'Ver contraseña'"
            >
              <!-- Ojo abierto -->
              <svg v-if="!mostrarClave" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              <!-- Ojo cerrado -->
              <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
              </svg>
            </button>
          </div>

          <div class="login-options">
            <router-link to="/recuperar-clave" class="forgot-link">
              ¿Olvidaste tu contraseña?
            </router-link>
          </div>

          <div v-if="mensajeError" class="login-alert error">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>{{ mensajeError }}</span>
          </div>

          <div v-if="mensajeExito" class="login-alert success">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>{{ mensajeExito }}</span>
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
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              <span>Volver al inicio</span>
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
const mostrarClave = ref(false);

const authStore = useAuthStore();
const router = useRouter();

const onUsuarioInput = (e) => {
  // Limpiar espacios en blanco innecesarios
  usuario.value = e.target.value.trim();
};

const goRegister = () => {
  router.push('/registro');
};

const goHome = () => {
  router.push('/');
};

const handleLogin = async () => {
  mensajeError.value = '';
  mensajeExito.value = '';

  if (!usuario.value) {
    mensajeError.value = 'Por favor ingresa tu documento o correo.';
    return;
  }

  if (!pass.value) {
    mensajeError.value = 'Por favor ingresa tu contraseña.';
    return;
  }

  cargando.value = true;

  try {
    const { user, profile } = await authService.login(usuario.value, pass.value);
    authStore.setSession(user, profile);

    mensajeExito.value = `¡Bienvenido, ${profile.nombre}!`;

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
  background:
    radial-gradient(circle at center,
      rgba(137, 232, 189, 0.85) 0%,
      rgba(231, 255, 196, 0.84) 45%,
      rgba(0, 109, 156, 0.82) 100%),
    url("../assets/img/ola_1.jpg") center / cover fixed;
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
  font-size: 0.95rem;
  font-weight: 600;
  color: #4b5563;
  margin: 0;
}

.login-form {
  display: flex;
  flex-direction: column;
}

.input-group {
  margin-bottom: 14px;
  position: relative;
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

.password-group input {
  padding-right: 50px;
}

.toggle-pass-btn {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  transition: color 0.2s;
}

.toggle-pass-btn:hover {
  color: #111827;
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
  font-weight: 600;
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
  display: flex;
  align-items: center;
  gap: 8px;
  animation: fade-in 0.2s ease;
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
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
  display: inline-flex;
  align-items: center;
  gap: 6px;
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

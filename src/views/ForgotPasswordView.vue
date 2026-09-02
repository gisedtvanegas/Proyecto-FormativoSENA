<template>
  <div class="forgot-page-wrapper">
    <div class="Formulario recuperacion">
      <h2>Recuperar contraseña</h2>
      <p>Escribe el correo con el que te registraste y te enviaremos un código.</p>
      
      <form @submit.prevent="handleReset">
        <input type="email" name="correo" placeholder="Correo electrónico" v-model="correo" required>
        <p v-if="mensaje" class="mensaje">{{ mensaje }}</p>
        <button type="submit" :disabled="cargando">{{ cargando ? 'Enviando...' : 'Enviar código' }}</button>
      </form>
      <p><router-link to="/login">Volver a iniciar sesión</router-link></p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { authService } from '../services/auth.service';

const correo = ref('');
const mensaje = ref('');
const cargando = ref(false);

const handleReset = async () => {
  mensaje.value = '';
  cargando.value = true;
  try {
    await authService.resetPasswordEmail(correo.value);
    mensaje.value = 'Se han enviado las instrucciones a tu correo electrónico.';
  } catch (err) {
    mensaje.value = err.message || 'Error al solicitar la recuperación.';
  } finally {
    cargando.value = false;
  }
};
</script>

<style scoped>
.forgot-page-wrapper {
  padding-top: 140px;
  padding-bottom: 80px;
}
</style>

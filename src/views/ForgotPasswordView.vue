<template>
  <div class="forgot-page-wrapper">
    <div class="Formulario recuperacion">
      <h2>Recuperar contraseña</h2>
      <p>Escribe el correo con el que te registraste y te enviaremos un enlace seguro.</p>
      
      <form @submit.prevent="handleReset">
        <input type="email" name="correo" placeholder="Correo electrónico" v-model="correo" required>
        <p v-if="mensajeError" class="mensaje">{{ mensajeError }}</p>
        <button type="submit" :disabled="cargando">{{ cargando ? 'Enviando...' : 'Enviar enlace' }}</button>
      </form>
      <p><router-link to="/login">Volver a iniciar sesión</router-link></p>
    </div>
    <AccountFeedbackModal :open="modal.open" :title="modal.title" :message="modal.message" @close="modal.open = false" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { authService } from '../services/auth.service';
import AccountFeedbackModal from '../components/AccountFeedbackModal.vue';

const correo = ref('');
const mensajeError = ref('');
const cargando = ref(false);
const modal = ref({ open: false, title: '', message: '' });

const handleReset = async () => {
  mensajeError.value = '';
  cargando.value = true;
  try {
    await authService.resetPasswordEmail(correo.value);
    // Mensaje neutro: no revela si una cuenta existe o no.
    modal.value = { open: true, title: 'Revisa tu correo', message: 'Si existe una cuenta asociada, recibirás un enlace para crear una contraseña nueva.' };
  } catch (err) {
    mensajeError.value = err.message || 'Error al solicitar la recuperación.';
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

<template>
  <div class="reset-page-wrapper">
    <div class="Formulario recuperacion">
      <h2>Crear nueva contraseña</h2>
      <p>Elige una contraseña nueva de al menos 8 caracteres.</p>
      <form @submit.prevent="handleReset">
        <input v-model="password" type="password" minlength="8" autocomplete="new-password" placeholder="Nueva contraseña" required>
        <input v-model="confirmation" type="password" minlength="8" autocomplete="new-password" placeholder="Confirmar contraseña" required>
        <p v-if="error" class="mensaje">{{ error }}</p>
        <button type="submit" :disabled="loading">{{ loading ? 'Guardando...' : 'Guardar contraseña' }}</button>
      </form>
    </div>
    <AccountFeedbackModal :open="modal.open" :title="modal.title" :message="modal.message" @close="closeModal" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '../services/auth.service';
import AccountFeedbackModal from '../components/AccountFeedbackModal.vue';

const router = useRouter();
const password = ref('');
const confirmation = ref('');
const error = ref('');
const loading = ref(false);
const modal = ref({ open: false, title: '', message: '' });

const closeModal = () => {
  modal.value.open = false;
  router.push('/login');
};

const handleReset = async () => {
  error.value = '';
  if (password.value !== confirmation.value) {
    error.value = 'Las contraseñas no coinciden.';
    return;
  }
  loading.value = true;
  try {
    await authService.updatePassword(password.value);
    modal.value = { open: true, title: 'Contraseña actualizada', message: 'Tu contraseña fue cambiada. Inicia sesión con la nueva contraseña.' };
  } catch (err) {
    error.value = err.message || 'No fue posible actualizar la contraseña. Solicita un enlace nuevo.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>.reset-page-wrapper { padding-top: 140px; padding-bottom: 80px; }</style>

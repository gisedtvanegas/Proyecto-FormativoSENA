<template>
  <div class="confirm-email-page">
    <div class="confirm-email-card">
      <template v-if="cargando"><h1>Verificando correo…</h1><p>Espera un momento.</p></template>
      <template v-else-if="confirmado">
        <h1>¡Correo confirmado!</h1>
        <p>Tu correo electrónico ha sido confirmado correctamente.</p>
        <p>Ya puedes iniciar sesión en tu cuenta.</p>
        <button @click="goLogin">Ir a iniciar sesión</button>
      </template>
      <template v-else>
        <h1>No pudimos confirmar el correo</h1>
        <p>{{ error || 'El enlace ya venció o no es válido. Solicita uno nuevo.' }}</p>       
        <form @submit.prevent="reenviar">
          <label for="correo">Correo electrónico</label>

          <input
            id="correo"
            v-model="correo"
            type="email"
            placeholder="Tu correo electrónico"
            autocomplete="email"
            required
          >

          <button type="submit"
              :disabled="enviando"
            >
              {{ enviando ? 'Enviando...' : 'Reenviar confirmación' }}
          </button>
        </form>
      </template>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '../services/supabase';
import { authService } from '../services/auth.service';

const router = useRouter();
const cargando = ref(true);
const confirmado = ref(false);
const error = ref('');
const correo = ref('');
const enviando = ref(false);

onMounted(async () => {
  const { data, error: sessionError } = await supabase.auth.getSession();
  confirmado.value = Boolean(data.session?.user?.email_confirmed_at);
  correo.value = data.session?.user?.email || '';
  if (sessionError) error.value = sessionError.message;
  cargando.value = false;
});

const goLogin = () => {
  router.push('/login');
};

const reenviar = async () => {
  error.value = '';
  enviando.value = true;
  try {
    await authService.resendConfirmationEmail(correo.value);
    error.value = 'Enviamos un nuevo enlace. Revisa tu bandeja de entrada.';
  } catch (err) { error.value = err.message || 'No fue posible reenviar la confirmación.'; }
  finally { enviando.value = false; }
};
</script>

<style scoped>
.confirm-email-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

.confirm-email-card {
  width: min(500px, 100%);
  padding: 2.5rem;
  text-align: center;
  border-radius: 16px;
  background: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
}

.confirm-email-card h1 {
  margin-bottom: 1rem;
}

.confirm-email-card p {
  margin-bottom: 0.8rem;
}

.confirm-email-card button {
  margin-top: 1.5rem;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
</style>

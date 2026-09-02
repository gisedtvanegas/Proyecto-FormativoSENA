<template>
  <div class="user-profile-wrapper">
    <main class="Formulario perfil-form-container">
      <h2>Mi Perfil</h2>
      
      <div v-if="mensajeExito" class="mensaje-alert mensaje-exito">{{ mensajeExito }}</div>
      <div v-if="mensajeError" class="mensaje-alert mensaje-error">{{ mensajeError }}</div>

      <form @submit.prevent="handleUpdate" enctype="multipart/form-data">
        <div class="foto-perfil-contenedor">
          <img v-if="fotoPreview" :src="fotoPreview" alt="Foto de perfil" class="foto-perfil-preview">
          <div v-else class="foto-perfil-placeholder">👤</div>
          <input type="file" name="foto_perfil" class="input-foto-perfil" accept="image/*" @change="handleFotoChange">
          <small style="color: #6b8e6b; font-size: 0.8rem; margin-top: 5px;">Formatos: JPG, PNG, WEBP (Opcional)</small>
        </div>

        <label>Nombre
          <input type="text" name="nombre" v-model="form.nombre" placeholder="Tu nombre" required>
        </label>

        <label>Correo Electrónico
          <input type="email" name="correo" v-model="form.correo" placeholder="ejemplo@correo.com" required>
        </label>

        <label>Número de Teléfono
          <input type="text" name="telefono" v-model="form.telefono" placeholder="Número de contacto" required>
        </label>

        <button type="submit" class="btn-perfil-submit" :disabled="cargando">
          {{ cargando ? 'Guardando...' : 'Guardar Cambios' }}
        </button>
      </form>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '../stores/authStore';
import { authService } from '../services/auth.service';

const authStore = useAuthStore();

const form = ref({
  nombre: '',
  correo: '',
  telefono: '',
  foto_perfil: ''
});

const fotoArchivo = ref(null);
const mensajeError = ref('');
const mensajeExito = ref('');
const cargando = ref(false);

const fotoPreview = computed(() => {
  if (fotoArchivo.value) {
    return URL.createObjectURL(fotoArchivo.value);
  }
  if (form.value.foto_perfil) {
    if (form.value.foto_perfil.startsWith('http')) return form.value.foto_perfil;
    try {
      return new URL(`../assets/img/${form.value.foto_perfil}`, import.meta.url).href;
    } catch (e) {
      return null;
    }
  }
  return null;
});

onMounted(() => {
  if (authStore.profile) {
    form.value = {
      nombre: authStore.profile.nombre || '',
      correo: authStore.profile.correo || '',
      telefono: authStore.profile.telefono || '',
      foto_perfil: authStore.profile.foto_perfil || ''
    };
  }
});

const handleFotoChange = (e) => {
  if (e.target.files && e.target.files[0]) {
    fotoArchivo.value = e.target.files[0];
  }
};

const handleUpdate = async () => {
  mensajeError.value = '';
  cargando.value = true;
  try {
    const updated = await authService.updateProfile(authStore.idUsuario, form.value);
    authStore.setSession(authStore.user, { ...authStore.profile, ...updated });
    mensajeExito.value = 'Perfil actualizado correctamente.';
  } catch (err) {
    mensajeError.value = err.message || 'Error al actualizar perfil.';
  } finally {
    cargando.value = false;
  }
};
</script>

<style scoped>
.user-profile-wrapper {
  padding-top: 40px;
}
.foto-perfil-contenedor {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 25px;
}
.foto-perfil-preview {
  width: 130px;
  height: 130px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #2e6846;
  box-shadow: 0 6px 15px rgba(46, 104, 70, 0.25);
  margin-bottom: 12px;
  background-color: #fff;
}
.foto-perfil-placeholder {
  width: 130px;
  height: 130px;
  border-radius: 50%;
  background-color: #e8f0eb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3.5rem;
  color: #2e6846;
  border: 4px dashed #2e6846;
  margin-bottom: 12px;
  box-shadow: 0 6px 15px rgba(0,0,0,0.1);
}
.input-foto-perfil {
  font-size: 0.85rem;
  color: #555;
  margin-top: 5px;
}
.perfil-form-container {
  margin-top: 120px !important;
  margin-bottom: 80px !important;
}
.mensaje-alert {
  padding: 12px 20px;
  border-radius: 10px;
  margin-bottom: 20px;
  font-weight: 500;
  text-align: center;
  font-size: 0.95rem;
}
.mensaje-exito {
  background-color: #e2f0d9;
  color: #385723;
  border: 1px solid #c5e1a5;
}
.mensaje-error {
  background-color: #fce4d6;
  color: #c65911;
  border: 1px solid #f8cbad;
}
.btn-perfil-submit {
  background: linear-gradient(135deg, #2e6846, #91bd72) !important;
  color: #fff !important;
  border: none !important;
  border-radius: 12px !important;
  padding: 12px 24px !important;
  font-weight: bold !important;
  cursor: pointer !important;
  width: 100% !important;
  box-sizing: border-box !important;
  margin: 15px 0 0 0 !important;
  transition: transform 0.2s ease, opacity 0.3s ease !important;
  box-shadow: 0 4px 10px rgba(46, 104, 70, 0.2) !important;
}
.btn-perfil-submit:hover {
  transform: scale(1.02) !important;
  opacity: 0.95 !important;
}
</style>

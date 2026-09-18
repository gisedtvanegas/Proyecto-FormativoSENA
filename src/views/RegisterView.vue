<template>
  <div class="register-page-wrapper">
    <section class="register-card" aria-labelledby="register-title">
      <aside class="register-image-panel" aria-hidden="true">
        <img :src="backgroundImagenn" alt="" />
        <div class="register-image-copy">
          <img class="register-logo" :src="logoImage" alt="" />
          <p>Casa y Jardín</p>
        </div>
      </aside>

      <form class="register-form-panel" @submit.prevent="handleRegister">
        <h2 id="register-title">Crea tu cuenta</h2>
        <p class="register-intro">Completa tus datos para disfrutar de Casa y Jardín.</p>

        <div v-if="mensajeError" class="mensaje-error">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <span>{{ mensajeError }}</span>
        </div>
        
        <div v-if="mensajeExito" class="mensaje-exito">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>{{ mensajeExito }}</span>
        </div>

        <div class="register-fields">
          <!-- Nombre (Solo letras) -->
          <label for="nombre">
            <span>Nombre</span>
            <input
              type="text"
              name="nombrep"
              id="nombre"
              v-model="form.nombre"
              @input="onNombreInput"
              maxlength="50"
              autocomplete="given-name"
              required
            >
          </label>

          <!-- Apellido (Solo letras) -->
          <label for="apellido">
            <span>Apellido</span>
            <input
              type="text"
              name="apellidoa"
              id="apellido"
              v-model="form.apellido"
              @input="onApellidoInput"
              maxlength="50"
              autocomplete="family-name"
              required
            >
          </label>

          <!-- Tipo de Documento -->
          <label for="tipodoc">
            <span>Tipo de documento</span>
            <select
              id="tipodoc"
              name="tipodocs"
              v-model="form.tipo_documento_idtipo_documento"
              @change="onTipoDocChange"
              required
            >
              <option value="" disabled>Seleccione...</option>
              <option v-for="tipo in tiposDoc" :key="tipo.idtipo_documento" :value="tipo.idtipo_documento">
                {{ tipo.descripcion_doc }}
              </option>
            </select>
          </label>

          <!-- Número de Documento (Solo números si es cédula/TI) -->
          <label for="documento">
            <span>Número de documento</span>
            <input
              type="text"
              name="documentoa"
              id="documento"
              :inputmode="esPasaporte ? 'text' : 'numeric'"
              v-model="form.documento"
              @input="onDocumentoInput"
              :maxlength="esPasaporte ? 12 : 10"
              required
            >
          </label>

          <!-- Teléfono (Solo 10 números) -->
          <label for="telefono">
            <span>Teléfono</span>
            <input
              type="tel"
              name="telefonoi"
              id="telefono"
              inputmode="numeric"
              v-model="form.telefono"
              @input="onTelefonoInput"
              maxlength="10"
              autocomplete="tel"
              required
            >
          </label>

          <!-- Correo electrónico -->
          <label for="correo">
            <span>Correo electrónico</span>
            <input
              type="email"
              name="correoz"
              id="correo"
              v-model="form.correo"
              @input="onCorreoInput"
              autocomplete="email"
              required
            >
          </label>

          <!-- Contraseña con botón ver/ocultar -->
          <label for="clave" class="password-label">
            <span>Contraseña</span>
            <div class="input-password-wrapper">
              <input
                :type="mostrarClave ? 'text' : 'password'"
                name="clavev"
                id="clave"
                minlength="8"
                maxlength="64"
                v-model="form.clave"
                autocomplete="new-password"
                required
              >
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
            <small>Mínimo 8 caracteres.</small>
          </label>

          <!-- Fecha de nacimiento (con límite máximo hoy) -->
          <label for="fecha_nac">
            <span>Fecha de nacimiento</span>
            <input
              type="date"
              name="fecha_nac"
              id="fecha_nac"
              v-model="form.fecha_nac"
              :max="fechaMaximaNacimiento"
              min="1920-01-01"
              required
            >
          </label>
        </div>

        <div class="register-terms">
          <input type="checkbox" name="checkbox" id="checkbox" v-model="form.checkbox" required>
          <label for="checkbox">Acepto los</label>
          <button type="button" class="enlace-terminos" id="abrir-terminos" @click="mostrarModalTerminos = true">términos y condiciones</button>
          <span>y autorizo el tratamiento de mis datos personales.</span>
        </div>

        <div class="register-actions">
          <button type="button" class="btn-volver" @click="goHome">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            <span>Volver</span>
          </button>
          <div class="register-actions-right">
            <button type="button" class="secondary-action" @click="goLogin">Iniciar sesión</button>
            <button type="submit" :disabled="cargando">{{ cargando ? 'Registrando...' : 'Registrarse' }}</button>
          </div>
        </div>
      </form>
    </section>

    <!-- Modal de Términos -->
    <div class="modal-terminos" id="modal-terminos" role="dialog" aria-modal="true" aria-labelledby="titulo-terminos" v-if="mostrarModalTerminos">
      <div class="modal-terminos-contenido">
        <button type="button" class="cerrar-terminos" id="cerrar-terminos" aria-label="Cerrar" @click="mostrarModalTerminos = false">&times;</button>
        <h2 id="titulo-terminos">Términos y Condiciones</h2>
        <p><strong>Casa y Jardín Vivero - Café.</strong> Al registrarte autorizas a Casa y Jardín a usar los datos que proporcionas para crear y administrar tu cuenta, atender reservas y enviarte comunicaciones del servicio.</p>
        <p>Tu información se conserva mientras tu cuenta esté activa para garantizar tus reservas de talleres y actividades.</p>
        <p>No compartas tu contraseña. Eres responsable de mantenerla privada y segura.</p>
        <button type="button" id="aceptar-terminos" @click="mostrarModalTerminos = false">Entendido</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import { authService } from '../services/auth.service';
import { parametrosService } from '../services/parametros.service';
import { useRouter } from 'vue-router';
import backgroundImagenn from '../assets/img/local.jpeg';
import logoImage from '../assets/img/logo.png';

const router = useRouter();

const form = ref({
  nombre: '',
  apellido: '',
  documento: '',
  telefono: '',
  correo: '',
  clave: '',
  fecha_nac: '',
  fecha_cad: new Date(Date.now() + 365*24*60*60*1000).toISOString().split('T')[0],
  checkbox: false,
  tipo_documento_idtipo_documento: '',
  roles_idroles: 2
});

const tiposDoc = ref([]);
const mensajeError = ref('');
const mensajeExito = ref('');
const cargando = ref(false);
const mostrarModalTerminos = ref(false);
const mostrarClave = ref(false);

const fechaMaximaNacimiento = computed(() => {
  const hoy = new Date();
  // Al menos 5 años
  hoy.setFullYear(hoy.getFullYear() - 5);
  return hoy.toISOString().split('T')[0];
});

const esPasaporte = computed(() => {
  const tipoSeleccionado = tiposDoc.value.find(
    (t) => t.idtipo_documento === Number(form.value.tipo_documento_idtipo_documento)
  );
  return tipoSeleccionado?.descripcion_doc?.toLowerCase().includes('pasaporte') || false;
});

onMounted(async () => {
  try {
    tiposDoc.value = await parametrosService.listarTiposDocumento();
    if (tiposDoc.value.length > 0 && !form.value.tipo_documento_idtipo_documento) {
      form.value.tipo_documento_idtipo_documento = tiposDoc.value[0].idtipo_documento;
    }
  } catch (err) {
    tiposDoc.value = [
      { idtipo_documento: 1, descripcion_doc: 'Cédula de ciudadanía' },
      { idtipo_documento: 2, descripcion_doc: 'Tarjeta de identidad' },
      { idtipo_documento: 3, descripcion_doc: 'Cédula de extranjería' },
      { idtipo_documento: 4, descripcion_doc: 'Pasaporte' }
    ];
    form.value.tipo_documento_idtipo_documento = 1;
  }
});

// --- Filtros de entrada en tiempo real ---

const onNombreInput = (e) => {
  // Solo letras, tildes, ñ y espacios
  form.value.nombre = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
};

const onApellidoInput = (e) => {
  // Solo letras, tildes, ñ y espacios
  form.value.apellido = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
};

const onDocumentoInput = (e) => {
  if (esPasaporte.value) {
    // Letras y números en mayúscula para pasaporte
    form.value.documento = e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 12);
  } else {
    // Solo números para cédulas y tarjetas de identidad
    form.value.documento = e.target.value.replace(/\D/g, '').slice(0, 10);
  }
};

const onTipoDocChange = () => {
  // Re-filtrar documento según el nuevo tipo
  if (!esPasaporte.value) {
    form.value.documento = form.value.documento.replace(/\D/g, '').slice(0, 10);
  }
};

const onTelefonoInput = (e) => {
  // Solo números de 10 dígitos (formato estándar móvil en Colombia)
  form.value.telefono = e.target.value.replace(/\D/g, '').slice(0, 10);
};

const onCorreoInput = (e) => {
  // Quitar espacios accidentales
  form.value.correo = e.target.value.replace(/\s/g, '').toLowerCase();
};

const goHome = () => {
  router.push('/');
};

const goLogin = () => {
  router.push('/login');
};

const handleRegister = async () => {
  mensajeError.value = '';
  mensajeExito.value = '';

  // Validaciones lógicas amigables
  if (form.value.nombre.trim().length < 2) {
    mensajeError.value = 'Por favor ingresa un nombre válido (mínimo 2 letras).';
    return;
  }

  if (form.value.apellido.trim().length < 2) {
    mensajeError.value = 'Por favor ingresa un apellido válido (mínimo 2 letras).';
    return;
  }

  if (!esPasaporte.value && form.value.documento.length < 6) {
    mensajeError.value = 'El número de documento debe tener al menos 6 dígitos numéricos.';
    return;
  }

  if (form.value.telefono.length !== 10) {
    mensajeError.value = 'El número de teléfono debe tener exactamente 10 dígitos (ej. 3001234567).';
    return;
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(form.value.correo)) {
    mensajeError.value = 'Ingresa un correo electrónico válido (ejemplo: usuario@correo.com).';
    return;
  }

  if (form.value.clave.length < 8) {
    mensajeError.value = 'La contraseña debe tener mínimo 8 caracteres.';
    return;
  }

  cargando.value = true;

  try {
    await authService.register(form.value);
    mensajeExito.value = '¡Registro Exitoso! Tu cuenta ha sido creada. Puedes iniciar sesión.';
    setTimeout(() => {
      router.push('/login');
    }, 1800);
  } catch (err) {
    mensajeError.value = err.message || 'Error al completar el registro';
  } finally {
    cargando.value = false;
  }
};
</script>

<style scoped>
.register-page-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
  box-sizing: border-box;
}

.register-card {
  display: grid;
  grid-template-columns: minmax(260px, .78fr) minmax(0, 1.35fr);
  width: min(980px, 100%);
  margin: 0 auto;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, .58);
  border-radius: 28px;
  background: rgba(188, 212, 229, .95);
  box-shadow: 0 22px 50px rgba(14, 62, 94, .28);
}

.register-image-panel { position: relative; min-height: 640px; overflow: hidden; background: #143e5e; }
.register-image-panel > img { width: 100%; height: 100%; position: absolute; inset: 0; object-fit: cover; opacity: .72; }
.register-image-panel::after { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(20, 62, 94, .15), rgba(20, 62, 94, .72)); }
.register-image-copy { position: absolute; z-index: 1; top: 32px; left: 32px; display: flex; align-items: center; gap: 10px; color: #fff; font-family: "Montaga", serif; font-size: 1.4rem; font-weight: 700; }
.register-image-copy p { margin: 0; }
.register-logo { width: 42px; height: 42px; border-radius: 50%; object-fit: cover; }

.register-form-panel { padding: 42px; box-sizing: border-box; color: #143e5e; background: rgba(188, 212, 229, .94); }
.register-form-panel h2 { margin: 0; font-family: "Montaga", serif; font-size: clamp(1.8rem, 3vw, 2.35rem); }
.register-intro { margin: 8px 0 22px; color: #31536d; font-size: 0.95rem; }

.mensaje-error, .mensaje-exito {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 0.88rem;
  font-weight: 600;
  margin-bottom: 20px;
  animation: fade-in 0.25s ease;
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(-6px); }
  to { opacity: 1; transform: translateY(0); }
}

.mensaje-error {
  background: #ffebee;
  color: #c62828;
  border: 1px solid #ffcdd2;
}

.mensaje-exito {
  background: #e8f5e9;
  color: #1b5e20;
  border: 1px solid #a5d6a7;
}

.register-fields { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px 18px; }
.register-fields label { display: grid; gap: 6px; color: #143e5e; font-size: .88rem; font-weight: 700; }

.register-fields input, .register-fields select {
  width: 100%;
  box-sizing: border-box;
  min-height: 44px;
  padding: 10px 14px;
  border: 1.5px solid rgba(20, 62, 94, .25);
  border-radius: 12px;
  background: rgba(255, 255, 255, .95);
  color: #1a1a1a;
  font: inherit;
  font-size: 0.92rem;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.register-fields input:focus, .register-fields select:focus {
  outline: none;
  border-color: #2e7d32;
  box-shadow: 0 0 0 3px rgba(46, 125, 50, 0.18);
  background: #ffffff;
}

.input-password-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-password-wrapper input {
  padding-right: 44px;
}

.toggle-pass-btn {
  position: absolute;
  right: 12px;
  background: transparent;
  border: none;
  color: #557563;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 6px;
  transition: color 0.2s;
}

.toggle-pass-btn:hover {
  color: #143e5e;
}

.register-fields small { margin-top: -2px; color: #436653; font-size: .74rem; font-weight: 600; }
.register-terms { display: flex; flex-wrap: wrap; align-items: center; gap: 5px; margin: 22px 0; color: #143e5e; font-size: .85rem; line-height: 1.45; }
.register-terms input { width: 17px; height: 17px; margin: 0 4px 0 0; accent-color: #2e7d32; cursor: pointer; }
.enlace-terminos { border: 0; padding: 0; background: transparent; color: #1b5e20; text-decoration: underline; cursor: pointer; font: inherit; font-weight: 700; }

.register-actions { display: flex; justify-content: space-between; align-items: center; gap: 12px; }
.register-actions-right { display: flex; gap: 12px; }

.btn-volver {
  background: transparent;
  border: none;
  color: #143e5e;
  font-family: inherit;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 6px;
  text-decoration: none;
  transition: color .2s ease, transform .2s ease;
}

.btn-volver:hover {
  color: #0b253a;
  transform: translateX(-3px);
  text-decoration: underline;
}

.register-actions-right button {
  min-width: 140px;
  padding: 13px 20px;
  border: 0;
  border-radius: 14px;
  background: #143e5e;
  color: #fff;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
  transition: transform .2s ease, background .2s ease, box-shadow .2s ease;
}

.register-actions-right button:hover {
  transform: translateY(-2px);
  background: #1e557f;
  box-shadow: 0 6px 18px rgba(20, 62, 94, 0.25);
}

.register-actions-right .secondary-action {
  background: rgba(255, 255, 255, .75);
  color: #143e5e;
  border: 1.5px solid rgba(20, 62, 94, .25);
}

.register-actions-right .secondary-action:hover {
  background: #ffffff;
  border-color: #143e5e;
}

.register-actions-right button:disabled { cursor: wait; opacity: .7; transform: none; box-shadow: none; }

@media (max-width: 720px) {
  .register-page-wrapper { padding: 30px 14px 40px; }
  .register-card { grid-template-columns: 1fr; border-radius: 22px; }
  .register-image-panel { min-height: 160px; }
  .register-image-copy { top: 20px; left: 20px; }
  .register-form-panel { padding: 28px 20px; }
}

@media (max-width: 580px) {
  .register-fields { grid-template-columns: 1fr; }
  .register-actions { flex-direction: column-reverse; align-items: stretch; gap: 14px; }
  .register-actions-right { flex-direction: column-reverse; gap: 10px; }
  .register-actions-right button { width: 100%; }
  .btn-volver { justify-content: center; }
}

.modal-terminos { position: fixed; inset: 0; z-index: 1000; display: grid; place-items: center; padding: 1rem; background: rgba(0, 0, 0, .55); backdrop-filter: blur(4px); }
.modal-terminos-contenido { position: relative; width: min(540px, 100%); max-height: 80vh; overflow: auto; padding: 2.2rem; border-radius: 20px; background: #fff; color: #1f2937; box-shadow: 0 20px 50px rgba(0,0,0,0.3); }
.modal-terminos-contenido h2 { font-family: "Montaga", serif; color: #143e5e; margin-top: 0; }
.cerrar-terminos { position: absolute; top: .8rem; right: 1rem; border: 0; background: transparent; font-size: 1.8rem; cursor: pointer; color: #143e5e; }
.modal-terminos-contenido button#aceptar-terminos { margin-top: 14px; background: #143e5e; color: #fff; border: none; padding: 10px 24px; border-radius: 12px; font-weight: 700; cursor: pointer; }
</style>

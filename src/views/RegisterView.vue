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

        <p v-if="mensajeError" class="mensaje">{{ mensajeError }}</p>
        <p v-if="mensajeExito" class="mensaje">{{ mensajeExito }}</p>

        <div class="register-fields">
          <label for="nombre">Nombre
            <input type="text" name="nombrep" id="nombre" v-model="form.nombre" required>
          </label>
          <label for="apellido">Apellido
            <input type="text" name="apellidoa" id="apellido" v-model="form.apellido" required>
          </label>
          <label for="tipodoc">Tipo de documento
            <select id="tipodoc" name="tipodocs" v-model="form.tipo_documento_idtipo_documento" required>
              <option value="">Seleccione...</option>
              <option v-for="tipo in tiposDoc" :key="tipo.idtipo_documento" :value="tipo.idtipo_documento">{{ tipo.descripcion_doc }}</option>
            </select>
          </label>
          <label for="documento">Número de documento
            <input type="text" name="documentoa" id="documento" inputmode="numeric" pattern="[0-9]+" v-model="form.documento" required>
          </label>
          <label for="telefono">Teléfono
            <input type="text" name="telefonoi" id="telefono" v-model="form.telefono" required>
          </label>
          <label for="correo">Correo electrónico
            <input type="email" name="correoz" id="correo" v-model="form.correo" required>
          </label>
          <label for="clave">Contraseña
            <input type="password" name="clavev" id="clave" minlength="8" v-model="form.clave" required>
            <small>Mínimo 8 caracteres.</small>
          </label>
          <label for="fecha_nac">Fecha de nacimiento
            <input type="date" name="fecha_nac" id="fecha_nac" v-model="form.fecha_nac" required>
          </label>
        </div>

        <div class="register-terms">
          <input type="checkbox" name="checkbox" id="checkbox" v-model="form.checkbox" required>
          <label for="checkbox">Acepto los</label>
          <button type="button" class="enlace-terminos" id="abrir-terminos" @click="mostrarModalTerminos = true">términos y condiciones</button>
          <span>y autorizo el tratamiento de mis datos personales.</span>
        </div>

        <div class="register-actions">
          <button type="button" class="btn-volver" @click="goHome">&#8592; Volver</button>
          <div class="register-actions-right">
            <button type="button" class="secondary-action" @click="goLogin">Iniciar sesión</button>
            <button type="submit" :disabled="cargando">{{ cargando ? 'Registrando...' : 'Registrarse' }}</button>
          </div>
        </div>
      </form>
    </section>

    <div class="modal-terminos" id="modal-terminos" role="dialog" aria-modal="true" aria-labelledby="titulo-terminos" v-if="mostrarModalTerminos">
      <div class="modal-terminos-contenido">
        <button type="button" class="cerrar-terminos" id="cerrar-terminos" aria-label="Cerrar" @click="mostrarModalTerminos = false">&times;</button>
        <h2 id="titulo-terminos">Terminos y condiciones</h2>
        <p><strong>Documento de ejemplo.</strong> Estos terminos son informativos para este aplicativo.</p>
        <p>Al registrarte autorizas a Casa y Jardin a usar los datos que proporcionas para crear y administrar tu cuenta, atender reservas y enviarte comunicaciones relacionadas con el servicio.</p>
        <p>Tu informacion se conserva mientras la cuenta este activa o sea necesaria para cumplir obligaciones del servicio. Puedes solicitar la actualizacion o eliminacion de tus datos mediante los canales de contacto del establecimiento.</p>
        <p>No compartas tu contrasena. Eres responsable de mantenerla privada y de informar cualquier uso no autorizado de tu cuenta.</p>
        <button type="button" id="aceptar-terminos" @click="mostrarModalTerminos = false">Entendido</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
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

onMounted(async () => {
  try {
    tiposDoc.value = await parametrosService.listarTiposDocumento();
  } catch (err) {
    tiposDoc.value = [
      { idtipo_documento: 1, descripcion_doc: 'Cedula de ciudadania' },
      { idtipo_documento: 2, descripcion_doc: 'Tarjeta de identidad' },
      { idtipo_documento: 3, descripcion_doc: 'Cedula de extranjeria' },
      { idtipo_documento: 4, descripcion_doc: 'Pasaporte' }
    ];
  }
});

const goHome = () => {
  router.push('/');
};

const goLogin = () => {
  router.push('/login');
};

const handleRegister = async () => {
  mensajeError.value = '';
  mensajeExito.value = '';
  cargando.value = true;

  try {
    await authService.register(form.value);

    mensajeExito.value =
      `Registro Exitoso!!`;

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
  border-radius: 24px;
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
.register-intro { margin: 8px 0 26px; color: #31536d; }
.register-fields { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px 18px; }
.register-fields label { display: grid; gap: 7px; color: #143e5e; font-size: .9rem; font-weight: 700; }
.register-fields input, .register-fields select { width: 100%; box-sizing: border-box; min-height: 43px; padding: 10px 12px; border: 1px solid rgba(20, 62, 94, .25); border-radius: 9px; background: rgba(255, 255, 255, .9); color: #1a1a1a; font: inherit; }
.register-fields input:focus, .register-fields select:focus { outline: 3px solid rgba(197, 225, 165, .9); border-color: #386347; }
.register-fields small { margin-top: -3px; color: #31536d; font-size: .72rem; font-weight: 500; }
.register-terms { display: flex; flex-wrap: wrap; align-items: center; gap: 5px; margin: 24px 0; color: #143e5e; font-size: .85rem; line-height: 1.45; }
.register-terms input { width: 16px; height: 16px; margin: 0 3px 0 0; accent-color: #386347; }
.enlace-terminos { border: 0; padding: 0; background: transparent; color: #166534; text-decoration: underline; cursor: pointer; font: inherit; font-weight: 700; }
.register-actions { display: flex; justify-content: space-between; align-items: center; gap: 12px; }
.register-actions-right { display: flex; gap: 12px; }
.btn-volver {
  background: transparent;
  border: none;
  color: #143e5e;
  font-family: inherit;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 4px;
  text-decoration: none;
  transition: color .2s ease, transform .2s ease;
}
.btn-volver:hover {
  color: #0b253a;
  transform: translateX(-3px);
  text-decoration: underline;
}
.register-actions-right button { min-width: 142px; padding: 12px 18px; border: 0; border-radius: 10px; background: #143e5e; color: #fff; font: inherit; font-weight: 700; cursor: pointer; transition: transform .2s ease, background .2s ease; }
.register-actions-right button:hover { transform: translateY(-2px); background: #235a7a; }
.register-actions-right .secondary-action { background: rgba(255, 255, 255, .65); color: #143e5e; border: 1px solid rgba(20, 62, 94, .28); }
.register-actions-right button:disabled { cursor: wait; opacity: .7; transform: none; }
@media (max-width: 720px) {
  .register-page-wrapper { padding: 30px 14px 40px; }
  .register-card { grid-template-columns: 1fr; }
  .register-image-panel { min-height: 180px; }
  .register-image-copy { top: 24px; left: 24px; }
  .register-form-panel { padding: 30px 22px; }
}
@media (max-width: 580px) {
  .register-fields { grid-template-columns: 1fr; }
  .register-actions { flex-direction: column-reverse; align-items: stretch; gap: 14px; }
  .register-actions-right { flex-direction: column-reverse; gap: 10px; }
  .register-actions-right button { width: 100%; }
  .btn-volver { justify-content: center; }
}
.modal-terminos { position: fixed; inset: 0; z-index: 1000; display: grid; place-items: center; padding: 1rem; background: rgba(0, 0, 0, .55); }
.modal-terminos-contenido { position: relative; width: min(560px, 100%); max-height: 80vh; overflow: auto; padding: 2rem; border-radius: 12px; background: #fff; color: #1f2937; }
.cerrar-terminos { position: absolute; top: .5rem; right: .75rem; border: 0; background: transparent; font-size: 2rem; cursor: pointer; }
</style>

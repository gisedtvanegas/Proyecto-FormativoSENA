<template>
  <div class="register-page-wrapper">
    <form @submit.prevent="handleRegister">
      <div class="Formulario">
        <p v-if="mensajeError" class="mensaje">{{ mensajeError }}</p>
        <p v-if="mensajeExito" class="mensaje">{{ mensajeExito }}</p>

        <label for="nombre">Ingrese su nombre:</label>
        <input type="text" name="nombrep" id="nombre" v-model="form.nombre" required><br><br>

        <label for="apellido">Ingrese su apellido:</label>
        <input type="text" name="apellidoa" id="apellido" v-model="form.apellido" required><br><br>

        <label for="tipodoc">Tipo de documento:</label>
        <select id="tipodoc" name="tipodocs" v-model="form.tipo_documento_idtipo_documento" required>
          <option value="">Seleccione...</option>
          <option v-for="tipo in tiposDoc" :key="tipo.idtipo_documento" :value="tipo.idtipo_documento">
            {{ tipo.descripcion_doc }}
          </option>
        </select><br><br>

        <label for="documento">Ingrese su número de documento:</label>
        <input type="text" name="documentoa" id="documento" inputmode="numeric" pattern="[0-9]+" v-model="form.documento" required><br><br>

        <label for="telefono">Ingrese su teléfono:</label>
        <input type="text" name="telefonoi" id="telefono" v-model="form.telefono" required><br><br>

        <label for="correo">Ingrese su correo:</label>
        <input type="email" name="correoz" id="correo" v-model="form.correo" required><br><br>

        <label for="clave">Ingrese su contraseña:</label>
        <input type="password" name="clavev" id="clave" minlength="8" v-model="form.clave" required>
        <small>Minimo 8 caracteres.</small><br><br>

        <label for="fecha_nac">Fecha de nacimiento:</label>
        <input type="date" name="fecha_nac" id="fecha_nac" v-model="form.fecha_nac" required><br><br>

        <label for="checkbox">
          <input type="checkbox" name="checkbox" id="checkbox" v-model="form.checkbox" required>
          Acepto los
        </label>
        <button type="button" class="enlace-terminos" id="abrir-terminos" @click="mostrarModalTerminos = true">terminos y condiciones</button>.
        <span>Tambien autorizo el tratamiento de mis datos personales.</span><br><br>

        <button type="submit" :disabled="cargando">{{ cargando ? 'Registrando...' : 'Registrarse' }}</button>
        <button type="button" @click="goLogin">Iniciar Sesión</button>
      </div>
    </form>

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
      `¡Registro realizado correctamente! Hemos enviado un correo de confirmación a ${form.value.correo}. Revisa tu bandeja de entrada y pulsa "Confirm email address" para activar tu cuenta.`;

  } catch (err) {
    mensajeError.value = err.message || 'Error al completar el registro';
  } finally {
    cargando.value = false;
  }
};
</script>

<style scoped>
.register-page-wrapper {
  padding-top: 140px;
  padding-bottom: 80px;
}
.enlace-terminos { border: 0; padding: 0; background: transparent; color: #166534; text-decoration: underline; cursor: pointer; font: inherit; }
.modal-terminos { position: fixed; inset: 0; z-index: 1000; display: grid; place-items: center; padding: 1rem; background: rgba(0, 0, 0, .55); }
.modal-terminos-contenido { position: relative; width: min(560px, 100%); max-height: 80vh; overflow: auto; padding: 2rem; border-radius: 12px; background: #fff; color: #1f2937; }
.cerrar-terminos { position: absolute; top: .5rem; right: .75rem; border: 0; background: transparent; font-size: 2rem; cursor: pointer; }
</style>

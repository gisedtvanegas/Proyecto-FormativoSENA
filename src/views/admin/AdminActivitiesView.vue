<template>
  <div class="admin-crud-page">
    <main class="admin-crud-container">
      <header class="admin-crud-header">
        <div>
          <p class="admin-eyebrow">Actividad</p>
          <h2>Gestion de Actividades</h2>
        </div>
        <router-link class="admin-back" to="/admin">Volver al panel</router-link>
      </header>

      <ReadOnlyNotice />

      <div v-if="mensaje" class="mensaje-bienvenida"><p>{{ mensaje }}</p></div>

      <!-- Formulario de inserción -->
      <form class="crud-form" @submit.prevent="handleInsertar" enctype="multipart/form-data">
        <label>Descripcion<input type="text" name="descripcionAct" v-model="nuevo.descripcion_actividad" required :disabled="authStore.isEmpleado"></label>
        <label>Información de la tarjeta<textarea name="informacionAct" maxlength="1000" required placeholder="Describe qué incluye, duración, materiales y recomendaciones." v-model="nuevo.informacion" :disabled="authStore.isEmpleado"></textarea></label>
        <label>Foto de la actividad
          <input type="file" name="fotoActividad" accept="image/*" @change="handleNuevaFotoFile" :disabled="authStore.isEmpleado">
          <small style="color:#6b8e6b;font-size:.82rem;">Opcional · Formatos: JPG, PNG, WEBP (máx. 5 MB)</small>
        </label>
        <label>Tipo de actividad
          <select name="tipoActi" v-model="nuevo.tipo_actividad_idtipo_actividad" required :disabled="authStore.isEmpleado">
            <option value="">Seleccione...</option>
            <option v-for="tipo in listaTiposActividad" :key="tipo.idtipo_actividad" :value="tipo.idtipo_actividad">{{ tipo.nombre_activi }}</option>
          </select>
        </label>
        <label>Lista de precios
          <select name="listaPrecioAct" v-model="nuevo.lista_precios_idlista_precios" required :disabled="authStore.isEmpleado">
            <option value="">Seleccione...</option>
            <option v-for="precio in listaPrecios" :key="precio.idlista_precios" :value="precio.idlista_precios">{{ precio.descrip_precio }}</option>
          </select>
        </label>
        <div class="crud-actions" v-if="!authStore.isEmpleado"><button type="submit">Guardar actividad</button></div>
      </form>

      <table class="crud-table">
        <thead>
          <tr>
            <th>Descripcion</th>
            <th>Información de la tarjeta</th>
            <th>Foto actual</th>
            <th>Nueva foto</th>
            <th>Tipo de actividad</th>
            <th>Lista de precios</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="actividad in listaActividades" :key="actividad.idactividad">
            <td><input type="text" v-model="actividad.descripcion_actividad" required :disabled="authStore.isEmpleado"></td>
            <td><textarea maxlength="1000" v-model="actividad.informacion" required :disabled="authStore.isEmpleado"></textarea></td>
            <td>
              <img v-if="actividad.foto_actividad" class="foto-miniatura" :src="getImagenUrl(actividad.foto_actividad)" :alt="actividad.descripcion_actividad">
              <div v-else class="foto-miniatura-placeholder">🌿</div>
            </td>
            <td>
              <input type="file" accept="image/*" @change="e => handleFotoRowFile(actividad, e)" :disabled="authStore.isEmpleado">
              <small style="color:#6b8e6b;font-size:.78rem;">Deja vacío para conservar la actual</small>
            </td>
            <td>
              <select v-model="actividad.tipo_actividad_idtipo_actividad" required :disabled="authStore.isEmpleado">
                <option v-for="tipo in listaTiposActividad" :key="tipo.idtipo_actividad" :value="tipo.idtipo_actividad">{{ tipo.nombre_activi }}</option>
              </select>
            </td>
            <td>
              <select v-model="actividad.lista_precios_idlista_precios" required :disabled="authStore.isEmpleado">
                <option v-for="precio in listaPrecios" :key="precio.idlista_precios" :value="precio.idlista_precios">{{ precio.descrip_precio }}</option>
              </select>
            </td>
            <td class="row-actions">
              <template v-if="!authStore.isEmpleado">
                <button type="button" @click="handleActualizar(actividad)">Actualizar</button>
                <button type="button" @click="abrirModalInactivar(actividad.idactividad)">Inactivar</button>
              </template>
              <span v-else class="texto-lectura">Solo Lectura</span>
            </td>
          </tr>
        </tbody>
      </table>
    </main>

    <!-- Modal de confirmación de inactivación -->
    <div id="deleteModal" class="custom-modal" :class="{ 'show': idActividadAInactivar !== null }">
      <div class="custom-modal-content">
        <p>¿Estás seguro que quieres inactivar este registro? La información se conservará.</p>
        <div class="custom-modal-buttons">
          <button type="button" class="modal-btn-si" @click="confirmarInactivar">Sí</button>
          <button type="button" class="modal-btn-no" @click="idActividadAInactivar = null">No</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../../stores/authStore';
import { actividadesService } from '../../services/actividades.service';
import { parametrosService } from '../../services/parametros.service';
import ReadOnlyNotice from '../../components/ReadOnlyNotice.vue';
import { validarImagen } from '../../services/storage.service';

const authStore = useAuthStore();

const nuevo = ref({
  descripcion_actividad: '',
  informacion: '',
  tipo_actividad_idtipo_actividad: '',
  lista_precios_idlista_precios: '',
  foto_actividad: ''
});

const listaActividades = ref([]);
const listaTiposActividad = ref([]);
const listaPrecios = ref([]);
const mensaje = ref('');
const idActividadAInactivar = ref(null);
const nuevaFotoArchivo = ref(null);
const fotosPorActividad = new Map();

onMounted(async () => {
  await cargarTodo();
});

const cargarTodo = async () => {
  try {
    listaActividades.value = await actividadesService.listarPublicas();
    listaTiposActividad.value = await parametrosService.listarTiposActividad();
    listaPrecios.value = await parametrosService.listarPrecios();
  } catch (err) {
    mensaje.value = err.message;
  }
};

const handleNuevaFotoFile = (e) => {
  try {
    nuevaFotoArchivo.value = e.target.files[0] || null;
    if (nuevaFotoArchivo.value) validarImagen(nuevaFotoArchivo.value);
  } catch (err) { nuevaFotoArchivo.value = null; e.target.value = ''; mensaje.value = err.message; }
};

const handleFotoRowFile = (actividad, e) => {
  try {
    const file = e.target.files[0] || null;
    if (file) validarImagen(file);
    if (file) fotosPorActividad.set(actividad.idactividad, file);
    else fotosPorActividad.delete(actividad.idactividad);
  } catch (err) { fotosPorActividad.delete(actividad.idactividad); e.target.value = ''; mensaje.value = err.message; }
};

const handleInsertar = async () => {
  if (authStore.isEmpleado) return;
  try {
    if (nuevaFotoArchivo.value) nuevo.value.foto_actividad = await actividadesService.subirImagen(nuevaFotoArchivo.value);
    await actividadesService.crear(nuevo.value);
    mensaje.value = 'Actividad guardada correctamente';
    nuevo.value = { descripcion_actividad: '', informacion: '', tipo_actividad_idtipo_actividad: '', lista_precios_idlista_precios: '', foto_actividad: '' };
    nuevaFotoArchivo.value = null;
    await cargarTodo();
  } catch (err) {
    mensaje.value = err.message;
  }
};

const handleActualizar = async (actividad) => {
  if (authStore.isEmpleado) return;
  try {
    const nuevaFoto = fotosPorActividad.get(actividad.idactividad);
    if (nuevaFoto) actividad.foto_actividad = await actividadesService.subirImagen(nuevaFoto);
    await actividadesService.actualizar(actividad.idactividad, actividad);
    fotosPorActividad.delete(actividad.idactividad);
    mensaje.value = 'Actividad actualizada correctamente';
    await cargarTodo();
  } catch (err) {
    mensaje.value = err.message;
  }
};

const abrirModalInactivar = (id) => {
  idActividadAInactivar.value = id;
};

const confirmarInactivar = async () => {
  if (!idActividadAInactivar.value) return;
  try {
    await actividadesService.eliminar(idActividadAInactivar.value);
    idActividadAInactivar.value = null;
    await cargarTodo();
  } catch (err) {
    mensaje.value = err.message;
  }
};

const getImagenUrl = (foto) => {
  if (!foto) return '';
  if (foto.startsWith('http')) return foto;
  try { return new URL(`../../assets/img/${foto}`, import.meta.url).href; }
  catch (e) { return ''; }
};
</script>

<style scoped>
.foto-miniatura { width: 64px; height: 64px; object-fit: cover; border-radius: 8px; display: block; }
.foto-miniatura-placeholder { width: 64px; height: 64px; border-radius: 8px; background: #e8f0eb; display: flex; align-items: center; justify-content: center; font-size: 1.6rem; }
.texto-lectura { color: #888; font-style: italic; }
</style>

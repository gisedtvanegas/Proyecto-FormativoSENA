<template>
  <div class="admin-container">
    <ReadOnlyNotice />

    <div class="header-seccion">
      <h2>GESTIÓN DE MENÚ DE CAFETERÍA</h2>
      <router-link to="/admin" class="btn-volver">← Volver al Panel</router-link>
    </div>

    <!-- Formulario Crear/Editar -->
    <div class="card-box mb-30">
      <h3>{{ modoEdicion ? 'EDITAR PRODUCTO' : 'NUEVO PRODUCTO' }}</h3>
      
      <div v-if="mensajeError" class="alerta error">{{ mensajeError }}</div>
      <div v-if="mensajeExito" class="alerta exito">{{ mensajeExito }}</div>

      <form @submit.prevent="handleGuardar" class="grid-form" enctype="multipart/form-data">
        <div class="campo">
          <label>Nombre del Producto:</label>
          <input type="text" v-model="form.nombre" required :disabled="authStore.isEmpleado" />
        </div>

        <div class="campo">
          <label>Descripción:</label>
          <input type="text" v-model="form.descripcion" required :disabled="authStore.isEmpleado" />
        </div>

        <div class="campo">
          <label>Precio (COP):</label>
          <input type="number" step="100" v-model="form.precio" required :disabled="authStore.isEmpleado" />
        </div>

        <div class="campo">
          <label>Foto del Producto:</label>
          <input type="file" accept="image/*" @change="handleFormFotoFile" :disabled="authStore.isEmpleado" />
          <small style="color:#6b8e6b;font-size:.82rem;">Opcional · JPG, PNG, WEBP (máx. 5 MB)</small>
        </div>

        <div class="campo acciones-form" v-if="!authStore.isEmpleado">
          <button type="submit" class="btn-guardar">{{ modoEdicion ? 'Actualizar' : 'Guardar' }}</button>
          <button type="button" v-if="modoEdicion" @click="resetForm" class="btn-cancelar">Cancelar</button>
        </div>
      </form>
    </div>

    <!-- Tabla Lista de Productos -->
    <div class="card-box">
      <h3>PRODUCTOS REGISTRADOS</h3>
      <div v-if="cargando" class="cargando">Cargando...</div>
      <div v-else class="tabla-responsive">
        <table class="tabla-custom">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Foto actual</th>
              <th>Nueva foto</th>
              <th>Precio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="prod in lista" :key="prod.idproducto">
              <td>{{ prod.nombre }}</td>
              <td>{{ prod.descripcion }}</td>
              <td class="td-foto-actual">
                <img
                  v-if="prod.imagen || prod.imagen_url"
                  :src="getImagenUrl(prod.imagen || prod.imagen_url)"
                  :alt="prod.nombre"
                  class="thumb-producto"
                  @error="e => e.target.style.display='none'"
                />
                <span v-else class="sin-foto">Sin foto</span>
              </td>
              <td>
                <template v-if="!authStore.isEmpleado">
                  <input
                    type="file"
                    accept="image/*"
                    @change="e => handleFotoRowFile(prod, e)"
                  />
                  <small style="color:#6b8e6b;font-size:.75rem;">Deja vacío para conservar la actual</small>
                </template>
                <span v-else class="texto-lectura">—</span>
              </td>
              <td>${{ formatPrecio(prod.precio) }}</td>
              <td>
                <template v-if="!authStore.isEmpleado">
                  <button @click="cargarEdicion(prod)" class="btn-accion edit">Editar</button>
                  <button @click="handleEliminar(prod.idproducto)" class="btn-accion del">Eliminar</button>
                </template>
                <span v-else class="texto-lectura">Solo Lectura</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../../stores/authStore';
import { productosService } from '../../services/productos.service';
import { storageService, validarImagen } from '../../services/storage.service';
import ReadOnlyNotice from '../../components/ReadOnlyNotice.vue';

const authStore = useAuthStore();

const form = ref({
  idproducto: null,
  nombre: '',
  descripcion: '',
  precio: '',
  imagen: ''
});

const modoEdicion = ref(false);
const lista = ref([]);
const cargando = ref(true);
const mensajeError = ref('');
const mensajeExito = ref('');

// Archivo del formulario (crear/editar)
const formFotoArchivo = ref(null);
// Mapa: idproducto → File para cambios inline en la tabla
const fotosPorProducto = new Map();

onMounted(async () => {
  await cargarDatos();
});

const cargarDatos = async () => {
  cargando.value = true;
  try {
    lista.value = await productosService.listar();
  } catch (err) {
    mensajeError.value = err.message;
  } finally {
    cargando.value = false;
  }
};

// Maneja selección de foto en el formulario
const handleFormFotoFile = (e) => {
  try {
    const file = e.target.files[0] || null;
    if (file) validarImagen(file);
    formFotoArchivo.value = file;
  } catch (err) {
    formFotoArchivo.value = null;
    e.target.value = '';
    mensajeError.value = err.message;
  }
};

// Maneja selección de foto en cada fila de la tabla
const handleFotoRowFile = async (prod, e) => {
  try {
    const file = e.target.files[0] || null;
    if (file) validarImagen(file);
    if (file) {
      mensajeError.value = '';
      const url = await storageService.subirFotoMenu(file);
      await productosService.actualizar(prod.idproducto, { ...prod, imagen: url });
      mensajeExito.value = `Foto de "${prod.nombre}" actualizada correctamente`;
      await cargarDatos();
    }
  } catch (err) {
    fotosPorProducto.delete(prod.idproducto);
    e.target.value = '';
    mensajeError.value = err.message;
  }
};

const cargarEdicion = (prod) => {
  modoEdicion.value = true;
  formFotoArchivo.value = null;
  form.value = {
    idproducto: prod.idproducto,
    nombre: prod.nombre,
    descripcion: prod.descripcion,
    precio: prod.precio,
    imagen: prod.imagen || prod.imagen_url || ''
  };
};

const resetForm = () => {
  modoEdicion.value = false;
  formFotoArchivo.value = null;
  form.value = { idproducto: null, nombre: '', descripcion: '', precio: '', imagen: '' };
};

const handleGuardar = async () => {
  if (authStore.isEmpleado) return;
  mensajeError.value = '';
  try {
    // Si se seleccionó un archivo nuevo, subirlo primero
    if (formFotoArchivo.value) {
      form.value.imagen = await storageService.subirFotoMenu(formFotoArchivo.value);
    }
    if (modoEdicion.value) {
      await productosService.actualizar(form.value.idproducto, form.value);
      mensajeExito.value = 'Producto actualizado correctamente';
    } else {
      await productosService.crear(form.value);
      mensajeExito.value = 'Producto creado correctamente';
    }
    resetForm();
    await cargarDatos();
  } catch (err) {
    mensajeError.value = err.message;
  }
};

const handleEliminar = async (id) => {
  if (authStore.isEmpleado) return;
  if (!confirm('¿Eliminar este producto?')) return;
  try {
    await productosService.eliminar(id);
    await cargarDatos();
  } catch (err) {
    mensajeError.value = err.message;
  }
};

const getImagenUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  try { return new URL(`../../assets/img/${url}`, import.meta.url).href; }
  catch (e) { return ''; }
};

const formatPrecio = (precio) => precio ? Number(precio).toLocaleString('es-CO') : '0';
</script>

<style scoped>
.admin-container { padding-top: 120px; width: min(1300px, calc(100% - 48px)); margin: 0 auto; padding-bottom: 60px; }
.header-seccion { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; background: rgba(245, 255, 235, 0.8); backdrop-filter: blur(16px); padding: 20px 30px; border-radius: 20px; }
.header-seccion h2 { color: var(--letra--gnr, #143E5E); margin: 0; }
.btn-volver { background: var(--letra--gnr, #143E5E); color: white; padding: 8px 16px; border-radius: 12px; text-decoration: none; font-weight: bold; }
.card-box { background: rgba(245, 255, 235, 0.85); backdrop-filter: blur(16px); border-radius: 24px; padding: 28px; border: 1px solid rgba(255,255,255,0.7); }
.mb-30 { margin-bottom: 30px; }
.grid-form { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; align-items: end; }
.campo label { display: block; font-weight: bold; color: var(--letra--gnr, #143E5E); margin-bottom: 6px; }
.campo input { width: 100%; padding: 10px; border-radius: 10px; border: 1px solid #ccc; box-sizing: border-box; }
.acciones-form { grid-column: 1 / -1; display: flex; gap: 12px; margin-top: 10px; }
.btn-guardar { background: var(--bienvenida--buttom, #9aab64); color: white; border: none; padding: 12px 24px; border-radius: 10px; font-weight: bold; cursor: pointer; }
.btn-cancelar { background: #6c757d; color: white; border: none; padding: 12px 24px; border-radius: 10px; font-weight: bold; cursor: pointer; }
.tabla-custom { width: 100%; border-collapse: collapse; text-align: left; }
.tabla-custom th, .tabla-custom td { padding: 12px; border-bottom: 1px solid rgba(0,0,0,0.08); }
.tabla-custom th { background: rgba(154, 171, 100, 0.3); color: var(--letra--gnr, #143E5E); }
.btn-accion { padding: 6px 12px; border-radius: 8px; border: none; font-weight: bold; cursor: pointer; margin-right: 6px; }
.btn-accion.edit { background: #ffc107; color: #000; }
.btn-accion.del { background: #dc3545; color: #fff; }
.alerta { padding: 12px; border-radius: 10px; margin-bottom: 16px; font-weight: bold; }
.alerta.error { background: #f8d7da; color: #721c24; }
.alerta.exito { background: #d4edda; color: #155724; }
.texto-lectura { color: #888; font-style: italic; }
.td-foto-actual { width: 80px; text-align: center; }
.thumb-producto { width: 64px; height: 48px; object-fit: cover; border-radius: 8px; border: 1px solid #ddd; display: block; margin: 0 auto; }
.sin-foto { font-size: 0.78rem; color: #aaa; font-style: italic; }
.input-nueva-foto { width: 130px; padding: 6px 8px; border-radius: 8px; border: 1px solid #ccc; font-size: 0.85rem; box-sizing: border-box; }
</style>

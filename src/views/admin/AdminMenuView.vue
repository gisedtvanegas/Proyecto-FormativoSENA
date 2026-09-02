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

      <form @submit.prevent="handleGuardar" class="grid-form">
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
          <label>Nombre Imagen / Archivo:</label>
          <input type="text" v-model="form.imagen_url" placeholder="ej. foto.jpg" :disabled="authStore.isEmpleado" />
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
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Precio</th>
              <th>Imagen</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="prod in lista" :key="prod.idproducto">
              <td>#{{ prod.idproducto }}</td>
              <td>{{ prod.nombre }}</td>
              <td>{{ prod.descripcion }}</td>
              <td>${{ formatPrecio(prod.precio) }}</td>
              <td>{{ prod.imagen_url || '-' }}</td>
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
import ReadOnlyNotice from '../../components/ReadOnlyNotice.vue';

const authStore = useAuthStore();

const form = ref({
  idproducto: null,
  nombre: '',
  descripcion: '',
  precio: '',
  imagen_url: ''
});

const modoEdicion = ref(false);
const lista = ref([]);
const cargando = ref(true);
const mensajeError = ref('');
const mensajeExito = ref('');

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

const cargarEdicion = (prod) => {
  modoEdicion.value = true;
  form.value = {
    idproducto: prod.idproducto,
    nombre: prod.nombre,
    descripcion: prod.descripcion,
    precio: prod.precio,
    imagen_url: prod.imagen_url || ''
  };
};

const resetForm = () => {
  modoEdicion.value = false;
  form.value = { idproducto: null, nombre: '', descripcion: '', precio: '', imagen_url: '' };
};

const handleGuardar = async () => {
  if (authStore.isEmpleado) return;
  mensajeError.value = '';
  try {
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
</style>

<template>
  <div class="admin-container">
    <ReadOnlyNotice />
    <div class="header-seccion">
      <h2>GESTIÓN DE USUARIOS DEL SISTEMA</h2>
      <router-link to="/admin" class="btn-volver">← Volver al Panel</router-link>
    </div>

    <!-- Formulario Editar Usuario -->
    <div v-if="modoEdicion" class="card-box mb-30">
      <h3>EDITAR USUARIO (#{{ form.idusuarios }})</h3>
      <div v-if="mensajeError" class="alerta error">{{ mensajeError }}</div>
      <div v-if="mensajeExito" class="alerta exito">{{ mensajeExito }}</div>

      <form @submit.prevent="handleGuardar" class="grid-form">
        <div class="campo">
          <label>Nombre:</label>
          <input type="text" v-model="form.nombre" required :disabled="authStore.isEmpleado" />
        </div>
        <div class="campo">
          <label>Apellido:</label>
          <input type="text" v-model="form.apellido" required :disabled="authStore.isEmpleado" />
        </div>
        <div class="campo">
          <label>Documento:</label>
          <input type="text" v-model="form.documento" required :disabled="authStore.isEmpleado" />
        </div>
        <div class="campo">
          <label>Teléfono:</label>
          <input type="text" v-model="form.telefono" required :disabled="authStore.isEmpleado" />
        </div>
        <div class="campo">
          <label>Correo:</label>
          <input type="email" v-model="form.correo" required :disabled="authStore.isEmpleado" />
        </div>
        <div class="campo">
          <label>Tipo Documento:</label>
          <select v-model="form.tipo_documento_idtipo_documento" required :disabled="authStore.isEmpleado">
            <option v-for="td in tiposDoc" :key="td.idtipo_documento" :value="td.idtipo_documento">
              {{ td.descripcion_doc }}
            </option>
          </select>
        </div>
        <div class="campo">
          <label>Rol Asignado:</label>
          <select v-model="form.roles_idroles" required :disabled="authStore.isEmpleado">
            <option v-for="r in roles" :key="r.idroles" :value="r.idroles">
              {{ r.descripcion_rol }}
            </option>
          </select>
        </div>

        <div class="campo acciones-form" v-if="!authStore.isEmpleado">
          <button type="submit" class="btn-guardar">Actualizar Usuario</button>
          <button type="button" @click="resetForm" class="btn-cancelar">Cancelar</button>
        </div>
      </form>
    </div>

    <div class="card-box">
      <h3>CUENTAS REGISTRADAS</h3>
      <div v-if="cargando" class="cargando">Cargando...</div>
      <div v-else class="tabla-responsive">
        <table class="tabla-custom">
          <thead>
            <tr>
              <th>Nombre Completo</th>
              <th>Documento</th>
              <th>Correo</th>
              <th>Teléfono</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="u in lista" :key="u.idusuarios">
              <td>{{ u.nombre }} {{ u.apellido }}</td>
              <td>{{ u.documento }}</td>
              <td>{{ u.correo }}</td>
              <td>{{ u.telefono }}</td>
              <td>
                <span class="badge-rol" :class="getRolClass(u.roles?.descripcion_rol)">
                  {{ u.roles?.descripcion_rol || 'Usuario' }}
                </span>
              </td>
              <td>
                <template v-if="!authStore.isEmpleado">
                  <button @click="cargarEdicion(u)" class="btn-accion edit">Editar</button>
                  <button @click="handleEliminar(u.idusuarios)" class="btn-accion del">Inactivar</button>
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
import { usuariosService } from '../../services/usuarios.service';
import { parametrosService } from '../../services/parametros.service';
import ReadOnlyNotice from '../../components/ReadOnlyNotice.vue';

const authStore = useAuthStore();
const form = ref({ idusuarios: null, nombre: '', apellido: '', documento: '', telefono: '', correo: '', tipo_documento_idtipo_documento: '', roles_idroles: 2 });
const modoEdicion = ref(false);
const lista = ref([]);
const tiposDoc = ref([]);
const roles = ref([]);
const cargando = ref(true);
const mensajeError = ref('');
const mensajeExito = ref('');

onMounted(async () => { await cargarDatos(); });

const cargarDatos = async () => {
  cargando.value = true;
  try {
    lista.value = await usuariosService.listar();
    tiposDoc.value = await parametrosService.listarTiposDocumento();
    roles.value = await parametrosService.listarRoles();
  } catch (err) { mensajeError.value = err.message; }
  finally { cargando.value = false; }
};

const cargarEdicion = (item) => {
  modoEdicion.value = true;
  form.value = {
    idusuarios: item.idusuarios,
    nombre: item.nombre,
    apellido: item.apellido,
    documento: item.documento,
    telefono: item.telefono,
    correo: item.correo,
    tipo_documento_idtipo_documento: item.tipo_documento_idtipo_documento,
    roles_idroles: item.roles_idroles
  };
};

const resetForm = () => {
  modoEdicion.value = false;
  form.value = { idusuarios: null, nombre: '', apellido: '', documento: '', telefono: '', correo: '', tipo_documento_idtipo_documento: '', roles_idroles: 2 };
};

const handleGuardar = async () => {
  if (authStore.isEmpleado) return;
  mensajeError.value = '';
  try {
    await usuariosService.actualizar(form.value.idusuarios, form.value);
    mensajeExito.value = 'Usuario actualizado correctamente';
    resetForm();
    await cargarDatos();
  } catch (err) { mensajeError.value = err.message; }
};

const handleEliminar = async (id) => {
  if (authStore.isEmpleado) return;
  if (!confirm('¿Inactivar este usuario?')) return;
  try {
    await usuariosService.eliminar(id);
    await cargarDatos();
  } catch (err) { mensajeError.value = err.message; }
};

const getRolClass = (rol) => {
  const r = rol ? rol.toLowerCase() : '';
  if (r.includes('admin')) return 'admin';
  if (r.includes('empleado')) return 'empleado';
  return 'usuario';
};
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
.campo input, .campo select { width: 100%; padding: 10px; border-radius: 10px; border: 1px solid #ccc; box-sizing: border-box; }
.acciones-form { grid-column: 1 / -1; display: flex; gap: 12px; margin-top: 10px; }
.btn-guardar { background: var(--bienvenida--buttom, #9aab64); color: white; border: none; padding: 12px 24px; border-radius: 10px; font-weight: bold; cursor: pointer; }
.btn-cancelar { background: #6c757d; color: white; border: none; padding: 12px 24px; border-radius: 10px; font-weight: bold; cursor: pointer; }
.tabla-custom { width: 100%; border-collapse: collapse; text-align: left; }
.tabla-custom th, .tabla-custom td { padding: 12px; border-bottom: 1px solid rgba(0,0,0,0.08); }
.tabla-custom th { background: rgba(154, 171, 100, 0.3); color: var(--letra--gnr, #143E5E); }
.badge-rol { padding: 4px 10px; border-radius: 12px; font-size: 0.85rem; font-weight: bold; }
.badge-rol.admin { background: #d4edda; color: #155724; }
.badge-rol.empleado { background: #fff3cd; color: #856404; }
.badge-rol.usuario { background: #e2e3e5; color: #383d41; }
.btn-accion { padding: 6px 12px; border-radius: 8px; border: none; font-weight: bold; cursor: pointer; margin-right: 6px; }
.btn-accion.edit { background: #ffc107; color: #000; }
.btn-accion.del { background: #dc3545; color: #fff; }
.alerta { padding: 12px; border-radius: 10px; margin-bottom: 16px; font-weight: bold; }
.alerta.error { background: #f8d7da; color: #721c24; }
.alerta.exito { background: #d4edda; color: #155724; }
.texto-lectura { color: #888; font-style: italic; }
</style>

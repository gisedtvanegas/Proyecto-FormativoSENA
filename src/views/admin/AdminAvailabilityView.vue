<template>
  <div class="admin-container">
    <ReadOnlyNotice />

    <div class="header-seccion">
      <h2>GESTIÓN DE DISPONIBILIDAD Y AFORO DIARIO</h2>
      <router-link to="/admin" class="btn-volver">← Volver al Panel</router-link>
    </div>

    <div class="card-box mb-30">
      <h3>REGISTRAR / MODIFICAR DISPONIBILIDAD</h3>
      
      <div v-if="mensajeError" class="alerta error">{{ mensajeError }}</div>
      <div v-if="mensajeExito" class="alerta exito">{{ mensajeExito }}</div>

      <form @submit.prevent="handleGuardar" class="grid-form">
        <div class="campo">
          <label>Fecha:</label>
          <input type="date" v-model="form.fecha" required :disabled="authStore.isEmpleado" />
        </div>
        <div class="campo">
          <label>Cupo Total:</label>
          <input type="number" v-model="form.cupo_total" required min="1" max="100" :disabled="authStore.isEmpleado" />
        </div>
        <div class="campo">
          <label>Cupo Disponible:</label>
          <input type="number" v-model="form.cupo_disponible" required min="0" max="100" :disabled="authStore.isEmpleado" />
        </div>
        <div class="campo">
          <label>Horario:</label>
          <select v-model="form.horarios_idhorarios" required :disabled="authStore.isEmpleado">
            <option value="">Seleccione horario...</option>
            <option v-for="h in horarios" :key="h.idhorarios" :value="h.idhorarios">
              {{ h.hora_ini }} - {{ h.hora_fin }}
            </option>
          </select>
        </div>
        <div class="campo acciones-form" v-if="!authStore.isEmpleado">
          <button type="submit" class="btn-guardar">{{ modoEdicion ? 'Actualizar' : 'Guardar' }}</button>
          <button type="button" v-if="modoEdicion" @click="resetForm" class="btn-cancelar">Cancelar</button>
        </div>
      </form>
    </div>

    <div class="card-box">
      <h3>DISPONIBILIDADES REGISTRADAS</h3>
      <div v-if="cargando" class="cargando">Cargando...</div>
      <div v-else class="tabla-responsive">
        <table class="tabla-custom">
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha</th>
              <th>Cupo Total</th>
              <th>Cupo Disponible</th>
              <th>Horario</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="d in lista" :key="d.iddisponibilidad">
              <td>#{{ d.iddisponibilidad }}</td>
              <td>{{ d.fecha }}</td>
              <td>{{ d.cupo_total }}</td>
              <td>{{ d.cupo_disponible }}</td>
              <td>{{ d.horarios ? `${d.horarios.hora_ini} - ${d.horarios.hora_fin}` : '-' }}</td>
              <td>
                <template v-if="!authStore.isEmpleado">
                  <button @click="cargarEdicion(d)" class="btn-accion edit">Editar</button>
                  <button @click="handleEliminar(d.iddisponibilidad)" class="btn-accion del">Eliminar</button>
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
import { parametrosService } from '../../services/parametros.service';
import ReadOnlyNotice from '../../components/ReadOnlyNotice.vue';

const authStore = useAuthStore();
const form = ref({ iddisponibilidad: null, fecha: '', cupo_total: 30, cupo_disponible: 30, horarios_idhorarios: '' });
const modoEdicion = ref(false);
const lista = ref([]);
const horarios = ref([]);
const cargando = ref(true);
const mensajeError = ref('');
const mensajeExito = ref('');

onMounted(async () => { await cargarDatos(); });

const cargarDatos = async () => {
  cargando.value = true;
  try {
    lista.value = await parametrosService.listarDisponibilidad();
    horarios.value = await parametrosService.listarHorarios();
  } catch (err) { mensajeError.value = err.message; }
  finally { cargando.value = false; }
};

const cargarEdicion = (item) => {
  modoEdicion.value = true;
  form.value = { iddisponibilidad: item.iddisponibilidad, fecha: item.fecha, cupo_total: item.cupo_total, cupo_disponible: item.cupo_disponible, horarios_idhorarios: item.horarios_idhorarios };
};

const resetForm = () => {
  modoEdicion.value = false;
  form.value = { iddisponibilidad: null, fecha: '', cupo_total: 30, cupo_disponible: 30, horarios_idhorarios: '' };
};

const handleGuardar = async () => {
  if (authStore.isEmpleado) return;
  mensajeError.value = '';
  try {
    if (modoEdicion.value) {
      await parametrosService.actualizarDisponibilidad(form.value.iddisponibilidad, form.value);
      mensajeExito.value = 'Disponibilidad actualizada';
    } else {
      await parametrosService.crearDisponibilidad(form.value);
      mensajeExito.value = 'Disponibilidad creada';
    }
    resetForm();
    await cargarDatos();
  } catch (err) { mensajeError.value = err.message; }
};

const handleEliminar = async (id) => {
  if (authStore.isEmpleado) return;
  if (!confirm('¿Eliminar esta disponibilidad?')) return;
  try {
    await parametrosService.eliminarDisponibilidad(id);
    await cargarDatos();
  } catch (err) { mensajeError.value = err.message; }
};
</script>

<style scoped>
.admin-container { padding-top: 120px; width: min(1300px, calc(100% - 48px)); margin: 0 auto; padding-bottom: 60px; }
.header-seccion { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; background: rgba(245, 255, 235, 0.8); backdrop-filter: blur(16px); padding: 20px 30px; border-radius: 20px; }
.header-seccion h2 { color: var(--letra--gnr, #143E5E); margin: 0; }
.btn-volver { background: var(--letra--gnr, #143E5E); color: white; padding: 8px 16px; border-radius: 12px; text-decoration: none; font-weight: bold; }
.card-box { background: rgba(245, 255, 235, 0.85); backdrop-filter: blur(16px); border-radius: 24px; padding: 28px; border: 1px solid rgba(255,255,255,0.7); }
.mb-30 { margin-bottom: 30px; }
.grid-form { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; align-items: end; }
.campo label { display: block; font-weight: bold; color: var(--letra--gnr, #143E5E); margin-bottom: 6px; }
.campo input, .campo select { width: 100%; padding: 10px; border-radius: 10px; border: 1px solid #ccc; box-sizing: border-box; }
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

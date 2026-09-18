<template>
  <div class="admin-container">
    <ReadOnlyNotice />

    <div class="header-seccion">
      <h2>GESTIÓN DE RESERVAS GENERAL</h2>
      <router-link to="/admin" class="btn-volver">← Volver al Panel</router-link>
    </div>

    <div class="card-box">
      <h3>TODAS LAS RESERVAS REGISTRADAS</h3>
      <div v-if="cargando" class="cargando">Cargando reservas...</div>

      <div v-else class="tabla-responsive">
        <table class="tabla-custom">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Documento</th>
              <th>Actividad</th>
              <th>Personas</th>
              <th>Fecha / Hora</th>
              <th>Estado Reserva</th>
              <th>Estado Pago</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in reservas" :key="r.idreserva">
              <td>{{ r.usuario ? `${r.usuario.nombre} ${r.usuario.apellido}` : 'Usuario #' + r.usuarios_idusuarios }}</td>
              <td>{{ r.usuario?.documento || '-' }}</td>
              <td>{{ r.actividad?.descripcion_actividad || '-' }}</td>
              <td>{{ r.num_personas }}</td>
              <td>{{ r.fecha }} ({{ r.hora }})</td>
              <td>
                <select
                  :value="r.estado_reserva_idestado_reserva"
                  @change="handleCambiarEstado(r, $event.target.value, r.pagos_idpagos)"
                  :disabled="authStore.isEmpleado"
                  class="select-inline"
                >
                  <option v-for="e in estados" :key="e.idestado_reserva" :value="e.idestado_reserva">
                    {{ e.descripcion_esta }}
                  </option>
                </select>
              </td>
              <td>
                <select
                  :value="r.pagos_idpagos"
                  @change="handleCambiarEstado(r, r.estado_reserva_idestado_reserva, $event.target.value)"
                  :disabled="authStore.isEmpleado"
                  class="select-inline"
                >
                  <option v-for="p in pagos" :key="p.idpagos" :value="p.idpagos">
                    {{ p.estado_pago }}
                  </option>
                </select>
              </td>
              <td>
                <button v-if="!authStore.isEmpleado" @click="handleEliminar(r.idreserva)" class="btn-del">
                  Eliminar
                </button>
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
import { reservasService } from '../../services/reservas.service';
import { parametrosService } from '../../services/parametros.service';
import ReadOnlyNotice from '../../components/ReadOnlyNotice.vue';

const authStore = useAuthStore();
const reservas = ref([]);
const estados = ref([]);
const pagos = ref([]);
const cargando = ref(true);

onMounted(async () => {
  await cargarDatos();
});

const cargarDatos = async () => {
  cargando.value = true;
  try {
    reservas.value = await reservasService.listarTodas();
    estados.value = await parametrosService.listarEstadosReserva();
    pagos.value = await parametrosService.listarEstadosPagos();
  } catch (err) {
    console.error(err);
  } finally {
    cargando.value = false;
  }
};

const handleCambiarEstado = async (reserva, nuevoEstado, nuevoPago) => {
  if (authStore.isEmpleado) return;
  try {
    await reservasService.actualizarEstadoAdmin(reserva.idreserva, nuevoEstado, nuevoPago);
    await cargarDatos();
  } catch (err) {
    alert('Error al actualizar estado: ' + err.message);
  }
};

const handleEliminar = async (id) => {
  if (authStore.isEmpleado) return;
  if (!confirm('¿Eliminar esta reserva del sistema?')) return;
  try {
    await reservasService.eliminar(id);
    await cargarDatos();
  } catch (err) {
    alert('Error al eliminar: ' + err.message);
  }
};
</script>

<style scoped>
.admin-container { padding-top: 120px; width: min(1300px, calc(100% - 48px)); margin: 0 auto; padding-bottom: 60px; }
.header-seccion { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; background: rgba(245, 255, 235, 0.8); backdrop-filter: blur(16px); padding: 20px 30px; border-radius: 20px; }
.header-seccion h2 { color: var(--letra--gnr, #143E5E); margin: 0; }
.btn-volver { background: var(--letra--gnr, #143E5E); color: white; padding: 8px 16px; border-radius: 12px; text-decoration: none; font-weight: bold; }
.card-box { background: rgba(245, 255, 235, 0.85); backdrop-filter: blur(16px); border-radius: 24px; padding: 28px; border: 1px solid rgba(255,255,255,0.7); }
.tabla-custom { width: 100%; border-collapse: collapse; text-align: left; }
.tabla-custom th, .tabla-custom td { padding: 12px; border-bottom: 1px solid rgba(0,0,0,0.08); }
.tabla-custom th { background: rgba(154, 171, 100, 0.3); color: var(--letra--gnr, #143E5E); }
.select-inline { padding: 6px 10px; border-radius: 8px; border: 1px solid #ccc; font-weight: bold; }
.btn-del { background: #dc3545; color: white; border: none; padding: 6px 12px; border-radius: 8px; font-weight: bold; cursor: pointer; }
.texto-lectura { color: #888; font-style: italic; }
.cargando { text-align: center; padding: 30px; }
</style>

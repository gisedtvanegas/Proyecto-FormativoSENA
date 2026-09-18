<template>
  <div class="user-reservations-wrapper">
    <div class="reservations-container">

      <!-- ENCABEZADO TIERNO Y BOTÁNICO -->
      <header class="reservations-header">
        <div class="header-titles">
          <div class="cute-badge">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path>
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>
            </svg>
          </div>
          <h1 class="main-title">Mis Reservas</h1>
          <p class="subtitle">Descubre tus talleres agendados, revisa tu comprobante de abono y crea nuevos momentos especiales en Casa y Jardín.</p>
        </div>

        <div class="header-nav-tabs">
          <button
            type="button"
            class="nav-tab-btn"
            :class="{ active: pestanaActiva === 'lista' }"
            @click="pestanaActiva = 'lista'"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span>Mis Reservas ({{ misReservas.length }})</span>
          </button>
          <button
            type="button"
            class="nav-tab-btn nav-tab-btn--primary"
            :class="{ active: pestanaActiva === 'nueva' }"
            @click="abrirFormularioNueva"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>Nueva Reserva</span>
          </button>
        </div>
      </header>

      <!-- MENSAJES GLOBALES DE FEEDBACK -->
      <div v-if="mensajeAlerta" class="alert-banner" :class="tipoAlerta">
        <div class="alert-icon-wrap">
          <svg v-if="tipoAlerta === 'alert-success'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <span>{{ mensajeAlerta }}</span>
        </div>
        <button type="button" class="alert-close" @click="mensajeAlerta = ''">&times;</button>
      </div>

      <!-- ============================================================= -->
      <!-- PESTAÑA 1: LISTADO DE RESERVAS (DASHBOARD TIERNO) -->
      <!-- ============================================================= -->
      <section v-if="pestanaActiva === 'lista'" class="reservations-list-section">
        <!-- Estado de carga -->
        <div v-if="cargandoLista" class="loading-state-card">
          <div class="loading-spinner"></div>
          <p>Preparando tus reservas...</p>
        </div>

        <!-- Estado Vacío (Sin reservas aún) -->
        <div v-else-if="misReservas.length === 0" class="empty-reservations-card">
          <div class="empty-illustration-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 20h9"></path>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
            </svg>
          </div>
          <h3>Aún no tienes reservas registradas</h3>
          <p>Descubre nuestros talleres botánicos de kokedamas, terrarios, pintura en cerámica y disfruta de una tarde mágica.</p>
          <button type="button" class="btn-create-first" @click="abrirFormularioNueva">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>Agendar mi Primera Reserva</span>
          </button>
        </div>

        <!-- Grid de Tarjetas de Reservas -->
        <div v-else class="reservations-cards-grid">
          <article
            v-for="r in misReservas"
            :key="r.idreserva"
            class="reservation-card"
            :class="{ 'reservation-card--cancelled': r.esCancelada }"
          >
            <!-- Header de Tarjeta -->
            <div class="card-top-bar">
              <span class="card-ref">#RES-{{ String(r.idreserva).padStart(5, '0') }}</span>
              <div class="card-status-badges">
                <span class="badge-status" :class="obtenerClaseEstado(r.descripcionEstado)">
                  {{ r.descripcionEstado }}
                </span>
                <span v-if="!r.esCancelada" class="badge-payment">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Abono 50% Aprobado (PSE)
                </span>
              </div>
            </div>

            <!-- Título y Actividad -->
            <div class="card-activity-info">
              <h3>{{ r.descripcionActividad }}</h3>
              <p class="activity-location">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                Casa y Jardín Vivero - Café
              </p>
            </div>

            <!-- Detalles Clave -->
            <div class="card-details-box">
              <div class="detail-pill">
                <div class="pill-icon-svg">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                </div>
                <div>
                  <span class="detail-label">Fecha</span>
                  <strong>{{ formatearFecha(r.fecha) }}</strong>
                </div>
              </div>

              <div class="detail-pill">
                <div class="pill-icon-svg">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
                <div>
                  <span class="detail-label">Hora</span>
                  <strong>{{ r.hora }}</strong>
                </div>
              </div>

              <div class="detail-pill">
                <div class="pill-icon-svg">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                  </svg>
                </div>
                <div>
                  <span class="detail-label">Cupos</span>
                  <strong>{{ r.num_personas }} {{ r.num_personas === 1 ? 'Persona' : 'Personas' }}</strong>
                </div>
              </div>
            </div>

            <!-- Aviso de modificación -->
            <div v-if="!r.puedeEditar && !r.esCancelada" class="card-warning-notice">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              <span>Modificaciones permitidas con más de 3 días de anticipación.</span>
            </div>

            <!-- Barra de Acciones de la Tarjeta -->
            <div class="card-actions-bar">
              <button
                v-if="!r.esCancelada"
                type="button"
                class="btn-card-ticket"
                @click="abrirTicket(r)"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                </svg>
                <span>Ver Ticket Digital</span>
              </button>

              <div class="card-secondary-actions">
                <button
                  v-if="r.puedeEditar"
                  type="button"
                  class="btn-card-edit"
                  @click="abrirModalEdicion(r)"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                  <span>Modificar</span>
                </button>
                <button
                  v-if="r.puedeCancelar"
                  type="button"
                  class="btn-card-cancel"
                  @click="handleCancelar(r.idreserva)"
                >
                  <span>Cancelar</span>
                </button>
              </div>
            </div>
          </article>
        </div>
      </section>

      <!-- ============================================================= -->
      <!-- PESTAÑA 2: FORMULARIO UX/UI MODERNO DE RESERVA -->
      <!-- ============================================================= -->
      <section v-else-if="pestanaActiva === 'nueva'" class="new-reservation-section">
        <div class="booking-stepper-card">

          <div class="booking-header">
            <div class="cute-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
              <span>Paso a Paso de Reserva</span>
            </div>
            <h2>Agenda tu Experiencia</h2>
            <p>Selecciona tu taller botánico favorito, fecha, horario y garantiza tu asistencia mediante nuestro pago seguro de abono.</p>
          </div>

          <form @submit.prevent="prepararPagoPasarela" class="booking-form">
            
            <!-- PASO 1: SELECCIONAR ACTIVIDAD -->
            <fieldset class="form-step-block">
              <legend class="step-legend">
                <span class="step-num">1</span>
                <span>Selecciona tu Actividad</span>
              </legend>

              <div class="activities-selector-grid">
                <div
                  v-for="a in actividades"
                  :key="a.idactividad"
                  class="activity-choice-card"
                  :class="{ selected: form.actividad_idactividad === a.idactividad }"
                  @click="form.actividad_idactividad = a.idactividad"
                >
                  <div class="activity-card-img" v-if="a.foto_actividad">
                    <img :src="a.foto_actividad" :alt="a.descripcion_actividad">
                  </div>
                  <div class="activity-card-body">
                    <div class="activity-card-header">
                      <h4>{{ a.descripcion_actividad }}</h4>
                      <span class="activity-price-tag">$35.000 COP / persona</span>
                    </div>
                    <p class="activity-card-desc">{{ a.informacion || 'Experiencia guiada en el vivero con materiales incluidos y bebida de cortesía.' }}</p>
                    <div class="activity-card-radio">
                      <div class="custom-radio-dot" :class="{ checked: form.actividad_idactividad === a.idactividad }"></div>
                      <span>{{ form.actividad_idactividad === a.idactividad ? 'Seleccionada' : 'Elegir esta actividad' }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </fieldset>

            <!-- PASO 2: ASISTENCIA, FECHA Y HORARIO -->
            <fieldset class="form-step-block">
              <legend class="step-legend">
                <span class="step-num">2</span>
                <span>Fecha, Horario y Asistentes</span>
              </legend>

              <div class="form-fields-grid">
                
                <!-- Personas (Contador Táctil Tierno) -->
                <div class="field-item">
                  <label>Número de Asistentes</label>
                  <div class="counter-input-group">
                    <button
                      type="button"
                      class="counter-btn"
                      :disabled="form.num_personas <= 1"
                      @click="form.num_personas > 1 ? form.num_personas-- : null"
                      aria-label="Disminuir"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                    </button>
                    <span class="counter-value">{{ form.num_personas }} {{ form.num_personas === 1 ? 'persona' : 'personas' }}</span>
                    <button
                      type="button"
                      class="counter-btn"
                      :disabled="form.num_personas >= 10"
                      @click="form.num_personas < 10 ? form.num_personas++ : null"
                      aria-label="Aumentar"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                    </button>
                  </div>
                  <small class="field-hint">Aforo por grupo: 1 a 10 personas.</small>
                </div>

                <!-- Fecha -->
                <div class="field-item">
                  <label for="fecha-input">Fecha de Reserva</label>
                  <input
                    id="fecha-input"
                    type="date"
                    class="styled-input"
                    v-model="form.fecha"
                    :min="fechaMinima"
                    required
                  >
                  <small class="field-hint">Mínimo 4 días de anticipación (a partir del {{ formatearFecha(fechaMinima) }}).</small>
                </div>

                <!-- Horario -->
                <div class="field-item">
                  <label>Hora de Encuentro</label>
                  <div class="time-chips-grid">
                    <button
                      v-for="h in horariosSugeridos"
                      :key="h.valor"
                      type="button"
                      class="time-chip"
                      :class="{ active: form.hora === h.valor }"
                      @click="form.hora = h.valor"
                    >
                      {{ h.etiqueta }}
                    </button>
                  </div>
                  <input
                    type="time"
                    class="styled-input time-manual-input"
                    v-model="form.hora"
                    required
                  >
                </div>

              </div>
            </fieldset>

            <!-- PASO 3: RESUMEN Y TITULAR -->
            <fieldset class="form-step-block">
              <legend class="step-legend">
                <span class="step-num">3</span>
                <span>Datos del Titular e Inversión</span>
              </legend>

              <div class="holder-summary-grid">
                
                <!-- Datos del Usuario -->
                <div class="holder-profile-box">
                  <h4>Titular de la Reserva</h4>
                  <div class="profile-rows">
                    <div>
                      <span class="p-label">Nombre:</span>
                      <strong>{{ authStore.profile?.nombre || '' }} {{ authStore.profile?.apellido || '' }}</strong>
                    </div>
                    <div>
                      <span class="p-label">Documento:</span>
                      <strong>{{ authStore.profile?.documento || 'No registrado' }}</strong>
                    </div>
                    <div>
                      <span class="p-label">Correo:</span>
                      <strong>{{ authStore.profile?.correo || authStore.user?.email }}</strong>
                    </div>
                  </div>
                </div>

                <!-- Desglose de Pago y Abono -->
                <div class="payment-breakdown-box">
                  <h4>Resumen del Abono de Garantía</h4>
                  <div class="breakdown-row">
                    <span>Actividad seleccionada:</span>
                    <strong>{{ obtenerNombreActividadSeleccionada() }}</strong>
                  </div>
                  <div class="breakdown-row">
                    <span>Total Estimado ({{ form.num_personas }} cupos):</span>
                    <strong>${{ formatearCop(totalEstimado) }} COP</strong>
                  </div>
                  <div class="breakdown-row highlight-abono">
                    <div>
                      <strong>Abono 50% a Pagar Hoy:</strong>
                      <small>Saldo restante el día de la experiencia</small>
                    </div>
                    <span class="abono-price">${{ formatearCop(abonoEstimado) }} COP</span>
                  </div>
                </div>

              </div>
            </fieldset>

            <!-- BOTONES DE ACCIÓN DEL FORMULARIO -->
            <div class="form-actions-bar">
              <button
                type="button"
                class="btn-form-cancel"
                @click="pestanaActiva = 'lista'"
              >
                Cancelar
              </button>

              <button
                type="submit"
                class="btn-form-submit"
                :disabled="!form.actividad_idactividad || !form.fecha"
              >
                <span>Proceder al Pago con Pasarela (PSE / Tarjeta)</span>
                <svg class="btn-arrow-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </div>

          </form>
        </div>
      </section>

    </div>

    <!-- ============================================================= -->
    <!-- MODAL: PASARELA DE PAGOS DEMO (PSE / BANCOS) -->
    <!-- ============================================================= -->
    <DemoPaymentGateway
      :open="mostrarPasarela"
      :reservation-data="datosParaPasarela"
      @close="mostrarPasarela = false"
      @payment-approved="handlePagoAprobado"
    />

    <!-- ============================================================= -->
    <!-- MODAL: TICKET DIGITAL / COMPROBANTE DE RESERVA -->
    <!-- ============================================================= -->
    <ReservationTicketModal
      :open="mostrarTicket"
      :reserva="reservaSeleccionadaTicket"
      @close="mostrarTicket = false"
    />

    <!-- ============================================================= -->
    <!-- MODAL: MODIFICAR RESERVA -->
    <!-- ============================================================= -->
    <div v-if="mostrarModalEdicion" class="edit-modal-overlay" role="dialog" aria-modal="true" @click.self="mostrarModalEdicion = false">
      <div class="edit-modal-box">
        <header class="edit-modal-header">
          <h3>Modificar Reserva</h3>
          <button type="button" class="btn-close-modal" @click="mostrarModalEdicion = false">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </header>

        <form @submit.prevent="handleGuardarEdicion" class="edit-modal-form">
          <div class="form-group">
            <label>Actividad</label>
            <input type="text" :value="reservaEnEdicion.descripcionActividad" readonly class="styled-input is-readonly">
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Número de Personas</label>
              <input type="number" min="1" max="10" v-model="reservaEnEdicion.num_personas" class="styled-input" required>
            </div>
            <div class="form-group">
              <label>Fecha</label>
              <input type="date" v-model="reservaEnEdicion.fecha" :min="fechaMinima" class="styled-input" required>
            </div>
          </div>

          <div class="form-group">
            <label>Hora</label>
            <input type="time" v-model="reservaEnEdicion.hora" class="styled-input" required>
          </div>

          <div class="edit-actions">
            <button type="button" class="btn-edit-cancel" @click="mostrarModalEdicion = false">Cancelar</button>
            <button type="submit" class="btn-edit-save" :disabled="cargandoEdicion">
              {{ cargandoEdicion ? 'Guardando...' : 'Guardar Cambios' }}
            </button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/authStore';
import { reservasService } from '../services/reservas.service';
import { actividadesService } from '../services/actividades.service';
import DemoPaymentGateway from '../components/DemoPaymentGateway.vue';
import ReservationTicketModal from '../components/ReservationTicketModal.vue';

const authStore = useAuthStore();

const pestanaActiva = ref('lista');

const mostrarPasarela = ref(false);
const mostrarTicket = ref(false);
const mostrarModalEdicion = ref(false);

const reservaSeleccionadaTicket = ref(null);
const reservaEnEdicion = ref({});
const cargandoEdicion = ref(false);

const form = ref({
  actividad_idactividad: '',
  num_personas: 2,
  fecha: '',
  hora: '10:00'
});

const horariosSugeridos = [
  { etiqueta: '09:00 AM', valor: '09:00' },
  { etiqueta: '11:00 AM', valor: '11:00' },
  { etiqueta: '02:00 PM', valor: '14:00' },
  { etiqueta: '04:00 PM', valor: '16:00' }
];

const actividades = ref([]);
const misReservas = ref([]);

const cargandoLista = ref(true);
const mensajeAlerta = ref('');
const tipoAlerta = ref('alert-success');

const fechaMinima = computed(() => {
  const fecha = new Date();
  fecha.setHours(0, 0, 0, 0);
  fecha.setDate(fecha.getDate() + 4);
  return fecha.toISOString().slice(0, 10);
});

const totalEstimado = computed(() => {
  return (form.value.num_personas || 1) * 35000;
});

const abonoEstimado = computed(() => {
  return Math.round(totalEstimado.value * 0.5);
});

const reservasConfirmadas = computed(() => {
  return misReservas.value.filter(r => !r.esCancelada);
});

const reservasConAbono = computed(() => {
  return misReservas.value.filter(r => !r.esCancelada);
});

const datosParaPasarela = computed(() => {
  const act = actividades.value.find(a => a.idactividad === form.value.actividad_idactividad);
  return {
    actividadNombre: act?.descripcion_actividad || 'Taller Casa y Jardín',
    num_personas: form.value.num_personas,
    fecha: form.value.fecha,
    hora: form.value.hora,
    precioPersona: 35000,
    nombreUsuario: `${authStore.profile?.nombre || ''} ${authStore.profile?.apellido || ''}`.trim(),
    correoUsuario: authStore.profile?.correo || authStore.user?.email || ''
  };
});

onMounted(async () => {
  try {
    actividades.value = await actividadesService.listarPublicas();
    if (actividades.value.length > 0 && !form.value.actividad_idactividad) {
      form.value.actividad_idactividad = actividades.value[0].idactividad;
    }
  } catch (err) {
    console.error('Error al cargar actividades:', err);
  }
  await cargarMisReservas();
});

const cargarMisReservas = async () => {
  if (!authStore.idUsuario) return;
  cargandoLista.value = true;
  try {
    misReservas.value = await reservasService.listarPorUsuario(authStore.idUsuario);
  } catch (err) {
    console.error('Error al listar reservas:', err);
  } finally {
    cargandoLista.value = false;
  }
};

const abrirFormularioNueva = () => {
  if (!form.value.fecha) {
    form.value.fecha = fechaMinima.value;
  }
  pestanaActiva.value = 'nueva';
};

const obtenerNombreActividadSeleccionada = () => {
  const act = actividades.value.find(a => a.idactividad === form.value.actividad_idactividad);
  return act?.descripcion_actividad || 'Selecciona una actividad';
};

const prepararPagoPasarela = () => {
  if (!form.value.fecha || !form.value.actividad_idactividad) {
    mostrarAlerta('Por favor completa todos los campos requeridos.', 'alert-error');
    return;
  }
  mostrarPasarela.value = true;
};

const handlePagoAprobado = async (datosPago) => {
  mostrarPasarela.value = false;
  try {
    await reservasService.crearReserva({
      ...form.value,
      usuarios_idusuarios: authStore.idUsuario
    });

    mostrarAlerta(`¡Reserva confirmada con éxito! Abono de $${formatearCop(datosPago.montoAbono)} COP aprobado con referencia ${datosPago.referencia}.`, 'alert-success');
    
    form.value = {
      actividad_idactividad: actividades.value[0]?.idactividad || '',
      num_personas: 2,
      fecha: fechaMinima.value,
      hora: '10:00'
    };

    await cargarMisReservas();
    pestanaActiva.value = 'lista';

    if (misReservas.value.length > 0) {
      reservaSeleccionadaTicket.value = misReservas.value[0];
      mostrarTicket.value = true;
    }
  } catch (err) {
    mostrarAlerta(err.message || 'Error al procesar la reserva', 'alert-error');
  }
};

const abrirTicket = (r) => {
  reservaSeleccionadaTicket.value = r;
  mostrarTicket.value = true;
};

const abrirModalEdicion = (r) => {
  reservaEnEdicion.value = { ...r };
  mostrarModalEdicion.value = true;
};

const handleGuardarEdicion = async () => {
  cargandoEdicion.value = true;
  try {
    await reservasService.actualizarReserva({
      idreserva: reservaEnEdicion.value.idreserva,
      num_personas: reservaEnEdicion.value.num_personas,
      fecha: reservaEnEdicion.value.fecha,
      hora: reservaEnEdicion.value.hora,
      usuarios_idusuarios: authStore.idUsuario,
      actividad_idactividad: reservaEnEdicion.value.actividad_idactividad
    });
    mostrarModalEdicion.value = false;
    mostrarAlerta('Reserva actualizada correctamente.', 'alert-success');
    await cargarMisReservas();
  } catch (err) {
    mostrarAlerta('Error al actualizar reserva: ' + err.message, 'alert-error');
  } finally {
    cargandoEdicion.value = false;
  }
};

const handleCancelar = async (idReserva) => {
  if (!confirm('¿Estás seguro de que deseas cancelar esta reserva? Tu abono quedará guardado para reprogramación.')) return;
  try {
    await reservasService.cancelarReserva(idReserva, authStore.idUsuario);
    mostrarAlerta('La reserva fue cancelada exitosamente.', 'alert-success');
    await cargarMisReservas();
  } catch (err) {
    mostrarAlerta('Error al cancelar reserva: ' + err.message, 'alert-error');
  }
};

const mostrarAlerta = (msg, tipo = 'alert-success') => {
  mensajeAlerta.value = msg;
  tipoAlerta.value = tipo;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const formatearCop = (val) => {
  return Number(val || 0).toLocaleString('es-CO');
};

const formatearFecha = (fechaStr) => {
  if (!fechaStr) return '';
  const [year, month, day] = fechaStr.split('-');
  if (!year || !month || !day) return fechaStr;
  const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  return `${day} de ${meses[parseInt(month, 10) - 1]}, ${year}`;
};

const obtenerClaseEstado = (estadoStr) => {
  const est = (estadoStr || '').toLowerCase();
  if (est.includes('confirm') || est.includes('aprob')) return 'badge-confirmed';
  if (est.includes('cancel')) return 'badge-cancelled';
  return 'badge-pending';
};
</script>

<style scoped>
.user-reservations-wrapper {
  width: min(1300px, calc(100% - 48px));
  margin: 110px auto 60px;
  box-sizing: border-box;
}

.reservations-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* ENCABEZADO */
.reservations-header {
  background: rgba(245, 255, 235, 0.78);
  backdrop-filter: blur(16px);
  border: 1.5px solid rgba(255, 255, 255, 0.85);
  border-radius: 28px;
  padding: 28px 34px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  box-shadow: 0 12px 35px rgba(20, 62, 94, 0.07);
}

.cute-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #eaf6ee;
  color: #2e7d32;
  font-size: 0.76rem;
  font-weight: 800;
  padding: 5px 14px;
  border-radius: 20px;
  letter-spacing: 0.05em;
  margin-bottom: 8px;
  border: 1px solid #cae8d3;
}

.main-title {
  margin: 0 0 6px;
  font-family: "Montaga", Georgia, serif;
  color: #143e5e;
  font-size: clamp(1.8rem, 3.2vw, 2.6rem);
}

.subtitle {
  margin: 0;
  color: #3b604e;
  font-size: 0.95rem;
  line-height: 1.5;
}

.header-nav-tabs {
  display: flex;
  gap: 12px;
  flex-shrink: 0;
}

.nav-tab-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 13px 22px;
  border-radius: 16px;
  border: 1.5px solid rgba(20, 62, 94, 0.18);
  background: rgba(255, 255, 255, 0.85);
  color: #143e5e;
  font-weight: 700;
  font-size: 0.92rem;
  cursor: pointer;
  transition: all 0.25s ease;
}

.nav-tab-btn:hover {
  background: #ffffff;
  border-color: #143e5e;
  transform: translateY(-2px);
}

.nav-tab-btn.active {
  background: #143e5e;
  color: #ffffff;
  border-color: #143e5e;
  box-shadow: 0 6px 18px rgba(20, 62, 94, 0.25);
}

.nav-tab-btn--primary {
  background: linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%);
  color: #ffffff;
  border: none;
}

.nav-tab-btn--primary:hover {
  background: linear-gradient(135deg, #388e3c 0%, #2e7d32 100%);
  color: #ffffff;
  box-shadow: 0 6px 20px rgba(46, 125, 50, 0.35);
}

/* ALERTAS */
.alert-banner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 20px;
  border-radius: 16px;
  font-weight: 600;
  font-size: 0.92rem;
  animation: slide-down 0.3s ease;
}

.alert-icon-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
}

@keyframes slide-down {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.alert-success {
  background: #eaf6ee;
  color: #1b5e20;
  border: 1.5px solid #a5d6a7;
}

.alert-error {
  background: #ffebee;
  color: #c62828;
  border: 1.5px solid #ffcdd2;
}

.alert-close {
  background: none;
  border: none;
  font-size: 1.4rem;
  cursor: pointer;
  color: inherit;
}

/* OVERVIEW DE ESTADÍSTICAS */
.stats-overview-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(12px);
  border: 1.5px solid rgba(255, 255, 255, 0.95);
  border-radius: 22px;
  padding: 18px 22px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 8px 22px rgba(18, 55, 38, 0.05);
  transition: transform 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.icon-bg-blue { background: #e6f0f7; }
.icon-bg-green { background: #eaf6ee; }
.icon-bg-amber { background: #fef3c7; }

.stat-num {
  display: block;
  font-size: 1.65rem;
  font-weight: 900;
  color: #143e5e;
  line-height: 1.1;
}

.stat-label {
  font-size: 0.82rem;
  color: #557563;
  font-weight: 700;
}

/* ESTADO DE CARGA */
.loading-state-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  border-radius: 26px;
  padding: 50px 30px;
  text-align: center;
  color: #2e7d32;
  font-weight: 700;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e0f0e5;
  border-top-color: #2e7d32;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ESTADO VACÍO */
.empty-reservations-card {
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(12px);
  border-radius: 28px;
  padding: 60px 30px;
  text-align: center;
  border: 2px dashed #c0e0cc;
}

.empty-illustration-icon {
  width: 80px;
  height: 80px;
  background: #eaf6ee;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  border: 1px solid #cae8d3;
}

.empty-reservations-card h3 {
  font-family: "Montaga", Georgia, serif;
  color: #143e5e;
  font-size: 1.6rem;
  margin: 0 0 8px;
}

.empty-reservations-card p {
  color: #557563;
  max-width: 500px;
  margin: 0 auto 24px;
  line-height: 1.5;
}

.btn-create-first {
  background: linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%);
  color: #ffffff;
  border: none;
  border-radius: 16px;
  padding: 15px 30px;
  font-size: 1rem;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(46, 125, 50, 0.3);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn-create-first:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(46, 125, 50, 0.4);
}

/* CARDS DE RESERVAS */
.reservations-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 20px;
}

.reservation-card {
  background: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(14px);
  border: 1.5px solid rgba(255, 255, 255, 0.95);
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 10px 30px rgba(16, 54, 77, 0.08);
  display: flex;
  flex-direction: column;
  gap: 16px;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.reservation-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 40px rgba(16, 54, 77, 0.14);
}

.reservation-card--cancelled {
  opacity: 0.7;
  border-color: #ffd8d8;
}

.card-top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eaf2ec;
  padding-bottom: 12px;
}

.card-ref {
  font-family: monospace;
  font-weight: 800;
  color: #143e5e;
  font-size: 0.86rem;
  background: #f0f5f1;
  padding: 3px 10px;
  border-radius: 8px;
}

.card-status-badges {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.badge-status {
  font-size: 0.74rem;
  font-weight: 800;
  padding: 4px 12px;
  border-radius: 20px;
  text-transform: uppercase;
}

.badge-confirmed { background: #e8f5e9; color: #1b5e20; }
.badge-pending { background: #fff3e0; color: #e65100; }
.badge-cancelled { background: #ffebee; color: #c62828; }

.badge-payment {
  font-size: 0.7rem;
  color: #2e7d32;
  font-weight: 700;
  background: #eaf6ee;
  padding: 3px 8px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.card-activity-info h3 {
  margin: 0 0 6px;
  font-family: "Montaga", Georgia, serif;
  color: #143e5e;
  font-size: 1.3rem;
}

.activity-location {
  margin: 0;
  color: #557563;
  font-size: 0.82rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 5px;
}

.card-details-box {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  background: #f7faf8;
  border: 1px solid #e2eee5;
  border-radius: 16px;
  padding: 12px;
}

.detail-pill {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pill-icon-svg {
  width: 28px;
  height: 28px;
  background: #ffffff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 1px solid #d4ebdc;
}

.detail-label {
  display: block;
  font-size: 0.68rem;
  color: #6a8c78;
  text-transform: uppercase;
  font-weight: 700;
}

.detail-pill strong {
  display: block;
  color: #143e5e;
  font-size: 0.84rem;
}

.card-warning-notice {
  background: #fff8e1;
  color: #795548;
  padding: 8px 12px;
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
}

.card-actions-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  margin-top: auto;
  border-top: 1px solid #eaf2ec;
  padding-top: 14px;
}

.btn-card-ticket {
  background: #143e5e;
  color: #ffffff;
  border: none;
  border-radius: 12px;
  padding: 10px 16px;
  font-size: 0.84rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 7px;
  transition: all 0.2s ease;
}

.btn-card-ticket:hover {
  background: #1e557f;
  transform: translateY(-2px);
}

.card-secondary-actions {
  display: flex;
  gap: 6px;
}

.btn-card-edit {
  background: #f0f6f2;
  border: 1px solid #c8ded0;
  color: #143e5e;
  border-radius: 10px;
  padding: 8px 12px;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 5px;
}

.btn-card-edit:hover {
  background: #e2ede5;
}

.btn-card-cancel {
  background: #fff0f0;
  border: 1px solid #ffd2d2;
  color: #d32f2f;
  border-radius: 10px;
  padding: 8px 12px;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-card-cancel:hover {
  background: #ffe0e0;
}

/* ============================================================= */
/* FORMULARIO DE NUEVA RESERVA (TIERNO & ACOGEDOR) */
/* ============================================================= */
.booking-stepper-card {
  background: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(16px);
  border: 1.5px solid rgba(255, 255, 255, 0.95);
  border-radius: 28px;
  padding: 36px;
  box-shadow: 0 16px 45px rgba(20, 62, 94, 0.1);
}

.booking-header {
  margin-bottom: 28px;
  border-bottom: 1px solid #e2ede5;
  padding-bottom: 20px;
}

.booking-header h2 {
  font-family: "Montaga", Georgia, serif;
  color: #143e5e;
  font-size: 2rem;
  margin: 0 0 6px;
}

.booking-header p {
  color: #4f6e5e;
  margin: 0;
  font-size: 0.95rem;
}

.booking-form {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.form-step-block {
  border: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.step-legend {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.15rem;
  font-weight: 800;
  color: #143e5e;
  margin-bottom: 6px;
}

.step-num {
  width: 32px;
  height: 32px;
  background: #143e5e;
  color: #ffffff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  font-weight: 900;
}

/* Selector de Actividades */
.activities-selector-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.activity-choice-card {
  border: 2px solid #dce8df;
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  background: #fafdfa;
  transition: all 0.25s ease;
  display: flex;
  flex-direction: column;
}

.activity-choice-card:hover {
  border-color: #9ac4a6;
  transform: translateY(-2px);
  background: #ffffff;
}

.activity-choice-card.selected {
  border-color: #2e7d32;
  background: #f1f8f3;
  box-shadow: 0 6px 20px rgba(46, 125, 50, 0.18);
}

.activity-card-img img {
  width: 100%;
  height: 140px;
  object-fit: cover;
  display: block;
}

.activity-card-body {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.activity-card-header h4 {
  margin: 0 0 4px;
  color: #143e5e;
  font-size: 1.05rem;
  font-weight: 800;
}

.activity-price-tag {
  color: #2e7d32;
  font-size: 0.8rem;
  font-weight: 800;
  display: block;
}

.activity-card-desc {
  font-size: 0.82rem;
  color: #557563;
  line-height: 1.45;
  margin: 0;
  flex: 1;
}

.activity-card-radio {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  font-size: 0.84rem;
  font-weight: 700;
  color: #143e5e;
}

.custom-radio-dot {
  width: 16px;
  height: 16px;
  border: 2px solid #a8c7b2;
  border-radius: 50%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.custom-radio-dot.checked {
  border-color: #2e7d32;
}

.custom-radio-dot.checked::after {
  content: "";
  width: 8px;
  height: 8px;
  background: #2e7d32;
  border-radius: 50%;
}

/* Campos de Formulario */
.form-fields-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  background: #f5f9f6;
  border: 1px solid #deebe2;
  border-radius: 20px;
  padding: 22px;
}

.field-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-item label {
  font-size: 0.84rem;
  font-weight: 800;
  color: #143e5e;
}

.styled-input {
  padding: 12px 14px;
  border: 1.5px solid #cfded4;
  border-radius: 12px;
  font-size: 0.95rem;
  color: #143e5e;
  background: #ffffff;
  outline: none;
  box-sizing: border-box;
  width: 100%;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.styled-input:focus {
  border-color: #2e7d32;
  box-shadow: 0 0 0 3px rgba(46, 125, 50, 0.12);
}

.styled-input.is-readonly {
  background: #edf3ee;
  cursor: not-allowed;
}

.field-hint {
  font-size: 0.74rem;
  color: #6a8c78;
  line-height: 1.3;
}

.counter-input-group {
  display: flex;
  align-items: center;
  background: #ffffff;
  border: 1.5px solid #cfded4;
  border-radius: 12px;
  overflow: hidden;
  height: 48px;
}

.counter-btn {
  background: #f0f6f2;
  border: none;
  width: 48px;
  height: 100%;
  cursor: pointer;
  color: #143e5e;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.counter-btn:hover:not(:disabled) {
  background: #e2ede5;
}

.counter-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.counter-value {
  flex: 1;
  text-align: center;
  font-weight: 800;
  color: #143e5e;
  font-size: 0.95rem;
}

.time-chips-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  margin-bottom: 6px;
}

.time-chip {
  background: #ffffff;
  border: 1px solid #c9ded0;
  border-radius: 10px;
  padding: 7px 4px;
  font-size: 0.8rem;
  font-weight: 700;
  color: #143e5e;
  cursor: pointer;
  transition: all 0.2s;
}

.time-chip:hover {
  background: #eef6f0;
}

.time-chip.active {
  background: #143e5e;
  color: #ffffff;
  border-color: #143e5e;
}

/* PASO 3: TITULAR Y DESGLOSE */
.holder-summary-grid {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 20px;
}

.holder-profile-box, .payment-breakdown-box {
  background: #f5f9f6;
  border: 1px solid #deebe2;
  border-radius: 20px;
  padding: 22px;
}

.holder-profile-box h4, .payment-breakdown-box h4 {
  margin: 0 0 14px;
  font-family: "Montaga", Georgia, serif;
  color: #143e5e;
  font-size: 1.15rem;
  border-bottom: 1px solid #dce8df;
  padding-bottom: 8px;
}

.profile-rows {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 0.88rem;
}

.p-label {
  display: block;
  font-size: 0.72rem;
  color: #658572;
  text-transform: uppercase;
  font-weight: 700;
}

.payment-breakdown-box {
  background: linear-gradient(135deg, #f0f7f2 0%, #e6f3e9 100%);
  border-color: #bfe0cb;
}

.breakdown-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  font-size: 0.9rem;
  color: #3b5e4c;
}

.highlight-abono {
  background: #ffffff;
  border: 1.5px solid #a3d4b2;
  border-radius: 14px;
  padding: 12px 16px;
  margin-top: 14px;
  margin-bottom: 0;
}

.highlight-abono strong {
  display: block;
  color: #143e5e;
  font-size: 1rem;
}

.highlight-abono small {
  display: block;
  font-size: 0.74rem;
  color: #608070;
}

.abono-price {
  font-size: 1.4rem;
  font-weight: 900;
  color: #1b5e20;
}

/* BARRA DE ACCIONES DEL FORMULARIO */
.form-actions-bar {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 16px;
  border-top: 1px solid #e2ede5;
  padding-top: 24px;
}

.btn-form-cancel {
  background: #f0f6f2;
  border: 1px solid #cfded4;
  color: #143e5e;
  border-radius: 14px;
  padding: 14px 24px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
}

.btn-form-cancel:hover {
  background: #e2ede5;
}

.btn-form-submit {
  background: linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%);
  color: #ffffff;
  border: none;
  border-radius: 16px;
  padding: 16px 32px;
  font-size: 1.05rem;
  font-weight: 800;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 8px 24px rgba(46, 125, 50, 0.3);
  transition: all 0.25s ease;
}

.btn-form-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(46, 125, 50, 0.4);
  background: linear-gradient(135deg, #2e7d32 0%, #388e3c 100%);
}

.btn-form-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  box-shadow: none;
}

/* MODAL DE EDICIÓN */
.edit-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 4200;
  background: rgba(14, 45, 30, 0.75);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px;
}

.edit-modal-box {
  background: #ffffff;
  border-radius: 24px;
  width: min(500px, 100%);
  padding: 28px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
  border: 1px solid #d4ebdc;
}

.edit-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #edf4ee;
  padding-bottom: 12px;
}

.edit-modal-header h3 {
  margin: 0;
  font-family: "Montaga", Georgia, serif;
  color: #143e5e;
  font-size: 1.4rem;
}

.btn-close-modal {
  background: #f0f5f1;
  border: none;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #143e5e;
}

.edit-modal-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.edit-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 10px;
}

.btn-edit-cancel {
  background: #f0f5f1;
  border: none;
  border-radius: 12px;
  padding: 10px 18px;
  font-weight: 700;
  cursor: pointer;
}

.btn-edit-save {
  background: #143e5e;
  color: #ffffff;
  border: none;
  border-radius: 12px;
  padding: 10px 20px;
  font-weight: 700;
  cursor: pointer;
}

/* RESPONSIVE */
@media (max-width: 900px) {
  .reservations-header {
    flex-direction: column;
    align-items: stretch;
    padding: 22px;
  }
  .header-nav-tabs {
    flex-direction: column;
  }
  .stats-overview-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }
  .form-fields-grid {
    grid-template-columns: 1fr;
  }
  .holder-summary-grid {
    grid-template-columns: 1fr;
  }
  .booking-stepper-card {
    padding: 22px 18px;
  }
}

@media (max-width: 600px) {
  .user-reservations-wrapper {
    width: min(100% - 24px, 1300px);
    margin-top: 90px;
  }
  .reservations-cards-grid {
    grid-template-columns: 1fr;
  }
  .card-details-box {
    grid-template-columns: 1fr;
    gap: 6px;
  }
  .form-actions-bar {
    flex-direction: column;
    align-items: stretch;
  }
  .btn-form-submit {
    justify-content: center;
  }
}
</style>

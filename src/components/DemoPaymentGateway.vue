<template>
  <div v-if="open" class="payment-gateway-overlay" role="dialog" aria-modal="true" aria-labelledby="gateway-title">
    <div class="payment-gateway-container" :class="{ 'is-processing': processingStep === 'loading' }">
      
      <!-- Botón cerrar (solo visible si no está procesando) -->
      <button v-if="processingStep !== 'loading'" type="button" class="gateway-close" @click="handleClose" aria-label="Cerrar">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      <!-- PASO 1: FORMULARIO DE PAGO -->
      <div v-if="processingStep === 'form'" class="gateway-content">
        <!-- Encabezado de la Pasarela -->
        <header class="gateway-header">
          <div class="gateway-badge">
            <svg class="icon-svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <span>Pasarela Segura • Pago de Abono</span>
          </div>
          <h2 id="gateway-title">Asegura tu Experiencia</h2>
          <p class="gateway-subtitle">Garantiza tu cupo abonando el <strong>50%</strong> del valor de la actividad.</p>
        </header>

        <!-- Resumen de la Orden (Tarjeta tierna) -->
        <div class="order-summary-card">
          <div class="summary-header">
            <div class="summary-title-wrapper">
              <svg class="sprout-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M7 20h10"></path>
                <path d="M10 20c5.5-2.5.8-6.4 3-10"></path>
                <path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4.1 5.5.8z"></path>
                <path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4.1 1.1-4.9 2z"></path>
              </svg>
              <span class="activity-name">{{ reservationData.actividadNombre || 'Taller Casa y Jardín' }}</span>
            </div>
            <span class="people-tag">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              {{ reservationData.num_personas }} {{ reservationData.num_personas === 1 ? 'persona' : 'personas' }}
            </span>
          </div>
          <div class="summary-details">
            <div class="detail-box">
              <span class="label">Fecha</span>
              <span class="val">{{ formatearFecha(reservationData.fecha) }}</span>
            </div>
            <div class="detail-box">
              <span class="label">Hora</span>
              <span class="val">{{ reservationData.hora }}</span>
            </div>
            <div class="detail-box">
              <span class="label">Total Actividad</span>
              <span class="val">${{ formatearCop(totalActividad) }} COP</span>
            </div>
          </div>
          <div class="summary-total-pay">
            <div>
              <span class="total-label">Abono a Pagar Hoy (50%):</span>
              <span class="total-note">Saldo restante el día de la experiencia</span>
            </div>
            <span class="total-amount">${{ formatearCop(montoAbono) }} COP</span>
          </div>
        </div>

        <!-- Selector de Métodos de Pago -->
        <div class="payment-methods-tabs">
          <button
            type="button"
            class="tab-btn"
            :class="{ active: metodoPago === 'pse' }"
            @click="metodoPago = 'pse'"
          >
            <div class="method-icon-circle">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="3" y1="21" x2="21" y2="21"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
                <polyline points="5 6 12 3 19 6"></polyline>
                <line x1="4" y1="10" x2="4" y2="21"></line>
                <line x1="20" y1="10" x2="20" y2="21"></line>
                <line x1="8" y1="14" x2="8" y2="17"></line>
                <line x1="12" y1="14" x2="12" y2="17"></line>
                <line x1="16" y1="14" x2="16" y2="17"></line>
              </svg>
            </div>
            <div class="method-info">
              <strong>PSE</strong>
              <span>Débito Bancario</span>
            </div>
          </button>

          <button
            type="button"
            class="tab-btn"
            :class="{ active: metodoPago === 'card' }"
            @click="metodoPago = 'card'"
          >
            <div class="method-icon-circle">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                <line x1="1" y1="10" x2="23" y2="10"></line>
              </svg>
            </div>
            <div class="method-info">
              <strong>Tarjeta</strong>
              <span>Crédito / Débito</span>
            </div>
          </button>

          <button
            type="button"
            class="tab-btn"
            :class="{ active: metodoPago === 'wallet' }"
            @click="metodoPago = 'wallet'"
          >
            <div class="method-icon-circle">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                <line x1="12" y1="18" x2="12.01" y2="18"></line>
              </svg>
            </div>
            <div class="method-info">
              <strong>Billeteras</strong>
              <span>Nequi / DaviPlata</span>
            </div>
          </button>
        </div>

        <!-- FORMULARIO: PSE -->
        <form v-if="metodoPago === 'pse'" @submit.prevent="iniciarProcesamiento" class="payment-form">
          <div class="form-group">
            <label for="pse-banco">Banco o Entidad Financiera</label>
            <select id="pse-banco" v-model="pseData.banco" required>
              <option value="" disabled>Selecciona tu banco...</option>
              <option v-for="banco in bancosPSE" :key="banco" :value="banco">{{ banco }}</option>
            </select>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="pse-tipo-persona">Tipo de Cliente</label>
              <select id="pse-tipo-persona" v-model="pseData.tipoPersona">
                <option value="natural">Persona Natural</option>
                <option value="juridica">Persona Jurídica</option>
              </select>
            </div>
            <div class="form-group">
              <label for="pse-tipo-doc">Tipo Documento</label>
              <select id="pse-tipo-doc" v-model="pseData.tipoDoc">
                <option value="CC">Cédula de Ciudadanía</option>
                <option value="CE">Cédula de Extranjería</option>
                <option value="NIT">NIT</option>
                <option value="PP">Pasaporte</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="pse-doc">Número de Documento</label>
              <input id="pse-doc" type="text" v-model="pseData.documento" placeholder="1020304050" required>
            </div>
            <div class="form-group">
              <label for="pse-email">Correo Registrado en PSE</label>
              <input id="pse-email" type="email" v-model="pseData.email" placeholder="cliente@correo.com" required>
            </div>
          </div>

          <button type="submit" class="submit-payment-btn">
            <span>Pagar Abono de ${{ formatearCop(montoAbono) }} COP</span>
            <svg class="btn-arrow-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </form>

        <!-- FORMULARIO: TARJETA -->
        <form v-if="metodoPago === 'card'" @submit.prevent="iniciarProcesamiento" class="payment-form">
          <div class="form-group">
            <label for="card-num">Número de Tarjeta</label>
            <div class="input-with-badge">
              <input
                id="card-num"
                type="text"
                maxlength="19"
                v-model="cardData.numero"
                placeholder="4500 1234 5678 9010"
                @input="formatearNumeroTarjeta"
                required
              >
              <span class="card-brand">{{ detectarFranquicia(cardData.numero) }}</span>
            </div>
          </div>

          <div class="form-group">
            <label for="card-holder">Nombre del Titular</label>
            <input id="card-holder" type="text" v-model="cardData.titular" placeholder="MARIA GARCIA" required>
          </div>

          <div class="form-row three-cols">
            <div class="form-group">
              <label for="card-exp">Expiración</label>
              <input
                id="card-exp"
                type="text"
                maxlength="5"
                v-model="cardData.exp"
                placeholder="MM/AA"
                @input="formatearExp"
                required
              >
            </div>
            <div class="form-group">
              <label for="card-cvv">CVV / CVC</label>
              <input id="card-cvv" type="password" maxlength="4" v-model="cardData.cvv" placeholder="123" required>
            </div>
            <div class="form-group">
              <label for="card-cuotas">Cuotas</label>
              <select id="card-cuotas" v-model="cardData.cuotas">
                <option value="1">1 cuota</option>
                <option value="2">2 cuotas</option>
                <option value="3">3 cuotas</option>
                <option value="6">6 cuotas</option>
              </select>
            </div>
          </div>

          <button type="submit" class="submit-payment-btn">
            <span>Pagar Abono de ${{ formatearCop(montoAbono) }} COP</span>
            <svg class="btn-arrow-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </form>

        <!-- FORMULARIO: BILLETERAS -->
        <form v-if="metodoPago === 'wallet'" @submit.prevent="iniciarProcesamiento" class="payment-form">
          <div class="wallet-intro">
            <p>Ingresa tu número celular registrado. Recibirás una notificación push en tu app para autorizar el débito.</p>
          </div>

          <div class="form-group">
            <label for="wallet-type">Billetera Digital</label>
            <select id="wallet-type" v-model="walletData.tipo">
              <option value="Nequi">Nequi (Bancolombia)</option>
              <option value="DaviPlata">DaviPlata (Davivienda)</option>
              <option value="Dale">Dale! (Grupo Aval)</option>
            </select>
          </div>

          <div class="form-group">
            <label for="wallet-phone">Número de Celular</label>
            <input id="wallet-phone" type="tel" v-model="walletData.celular" placeholder="300 123 4567" required>
          </div>

          <button type="submit" class="submit-payment-btn">
            <span>Pagar Abono de ${{ formatearCop(montoAbono) }} COP</span>
            <svg class="btn-arrow-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </form>

        <footer class="gateway-security-footer">
          <div class="security-info">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
            <span>Transacción segura y encriptada • Casa y Jardín</span>
          </div>
          <span class="brand-footer-text">Vivero Café</span>
        </footer>
      </div>

      <!-- PASO 2: PANTALLA DE PROCESAMIENTO / SIMULACIÓN BANCARIA -->
      <div v-else-if="processingStep === 'loading'" class="gateway-processing-view">
        <div class="processing-spinner-wrapper">
          <div class="processing-spinner"></div>
          <div class="bank-symbol-svg">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="3" y1="21" x2="21" y2="21"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
              <polyline points="5 6 12 3 19 6"></polyline>
              <line x1="4" y1="10" x2="4" y2="21"></line>
              <line x1="20" y1="10" x2="20" y2="21"></line>
            </svg>
          </div>
        </div>
        <h3>Conectando con tu banco...</h3>
        <p class="processing-status-msg">{{ estadoProcesoTexto }}</p>
        <div class="processing-progress-bar">
          <div class="progress-fill" :style="{ width: progresoPorcentaje + '%' }"></div>
        </div>
        <p class="processing-warning">Por favor no cierres esta ventana mientras procesamos el abono.</p>
      </div>

      <!-- PASO 3: CONFIRMACIÓN EXITOSA -->
      <div v-else-if="processingStep === 'success'" class="gateway-success-view">
        <div class="success-icon-badge">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <span class="success-badge-tag">Transacción Aprobada</span>
        <h2>¡Abono Confirmado con Éxito!</h2>
        <p class="success-desc">
          Tu pago ha sido validado correctamente. Tu cupo para <strong>{{ reservationData.actividadNombre }}</strong> ha quedado reservado y garantizado.
        </p>

        <div class="receipt-box">
          <div class="receipt-row">
            <span>Referencia:</span>
            <strong>{{ transaccionRef }}</strong>
          </div>
          <div class="receipt-row">
            <span>Método:</span>
            <strong>{{ obtenerNombreMetodo() }}</strong>
          </div>
          <div class="receipt-row">
            <span>Abono Pagado (50%):</span>
            <strong class="receipt-amount">${{ formatearCop(montoAbono) }} COP</strong>
          </div>
          <div class="receipt-row">
            <span>Fecha y Hora:</span>
            <span>{{ fechaTransaccion }}</span>
          </div>
          <div class="receipt-row">
            <span>Estado:</span>
            <span class="status-approved">APROBADO</span>
          </div>
        </div>

        <div class="success-actions">
          <button type="button" class="btn-finish" @click="finalizarTransaccion">
            <span>Ver Mis Reservas y Ticket Digital</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';

const props = defineProps({
  open: { type: Boolean, default: false },
  reservationData: {
    type: Object,
    default: () => ({
      actividadNombre: 'Taller de Cerámica y Café',
      num_personas: 1,
      fecha: '',
      hora: '09:00',
      precioPersona: 35000,
      nombreUsuario: '',
      correoUsuario: ''
    })
  }
});

const emit = defineEmits(['close', 'payment-approved']);

const METODO_DEFAULT = 'pse';
const metodoPago = ref(METODO_DEFAULT);
const processingStep = ref('form');
const estadoProcesoTexto = ref('Conectando con la entidad financiera...');
const progresoPorcentaje = ref(15);
const transaccionRef = ref('');
const fechaTransaccion = ref('');

const bancosPSE = [
  'Bancolombia',
  'Nequi',
  'Davivienda',
  'Banco de Bogotá',
  'BBVA Colombia',
  'Nu Colombia (Nubank)',
  'DaviPlata',
  'Scotiabank Colpatria',
  'Banco de Occidente',
  'Banco Caja Social',
  'Banco Popular',
  'Banco AV Villas',
  'Lulo Bank',
  'Itaú Colombia'
];

const pseData = ref({
  banco: 'Bancolombia',
  tipoPersona: 'natural',
  tipoDoc: 'CC',
  documento: '1098234567',
  email: ''
});

const cardData = ref({
  numero: '',
  titular: '',
  exp: '',
  cvv: '',
  cuotas: '1'
});

const walletData = ref({
  tipo: 'Nequi',
  celular: '3001234567'
});

const precioPorPersona = computed(() => {
  return props.reservationData.precioPersona || 35000;
});

const totalActividad = computed(() => {
  const personas = Math.max(1, Number(props.reservationData.num_personas) || 1);
  return personas * precioPorPersona.value;
});

const montoAbono = computed(() => {
  return Math.round(totalActividad.value * 0.5);
});

watch(
  () => props.reservationData,
  (newVal) => {
    if (newVal?.correoUsuario && !pseData.value.email) {
      pseData.value.email = newVal.correoUsuario;
    }
    if (newVal?.nombreUsuario && !cardData.value.titular) {
      cardData.value.titular = newVal.nombreUsuario.toUpperCase();
    }
  },
  { immediate: true }
);

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      processingStep.value = 'form';
      progresoPorcentaje.value = 15;
    }
  }
);

const formatearCop = (val) => {
  return Number(val || 0).toLocaleString('es-CO');
};

const formatearFecha = (fechaStr) => {
  if (!fechaStr) return '';
  const [year, month, day] = fechaStr.split('-');
  if (!year || !month || !day) return fechaStr;
  const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  return `${day} de ${meses[parseInt(month, 10) - 1]} de ${year}`;
};

const formatearNumeroTarjeta = (e) => {
  let val = e.target.value.replace(/\D/g, '').substring(0, 16);
  let formatted = val.match(/.{1,4}/g)?.join(' ') || val;
  cardData.value.numero = formatted;
};

const formatearExp = (e) => {
  let val = e.target.value.replace(/\D/g, '').substring(0, 4);
  if (val.length >= 3) {
    cardData.value.exp = `${val.substring(0, 2)}/${val.substring(2)}`;
  } else {
    cardData.value.exp = val;
  }
};

const detectarFranquicia = (num) => {
  const clean = (num || '').replace(/\D/g, '');
  if (/^4/.test(clean)) return 'Visa';
  if (/^5[1-5]/.test(clean)) return 'Mastercard';
  if (/^3[47]/.test(clean)) return 'Amex';
  return 'Débito/Crédito';
};

const obtenerNombreMetodo = () => {
  if (metodoPago.value === 'pse') return `PSE (${pseData.value.banco})`;
  if (metodoPago.value === 'card') return `Tarjeta ${detectarFranquicia(cardData.value.numero)}`;
  return `${walletData.value.tipo} (${walletData.value.celular})`;
};

const iniciarProcesamiento = () => {
  processingStep.value = 'loading';
  progresoPorcentaje.value = 25;
  estadoProcesoTexto.value = 'Conectando con la entidad financiera...';

  setTimeout(() => {
    progresoPorcentaje.value = 60;
    estadoProcesoTexto.value = 'Validando token de seguridad y fondos...';
  }, 900);

  setTimeout(() => {
    progresoPorcentaje.value = 90;
    estadoProcesoTexto.value = 'Autorizando abono de garantía...';
  }, 1700);

  setTimeout(() => {
    progresoPorcentaje.value = 100;
    transaccionRef.value = `PSE-CJVC-${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date();
    fechaTransaccion.value = now.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    processingStep.value = 'success';
  }, 2400);
};

const finalizarTransaccion = () => {
  emit('payment-approved', {
    referencia: transaccionRef.value,
    metodo: obtenerNombreMetodo(),
    montoAbono: montoAbono.value,
    totalActividad: totalActividad.value,
    fechaTransaccion: fechaTransaccion.value
  });
};

const handleClose = () => {
  if (processingStep.value === 'loading') return;
  emit('close');
};
</script>

<style scoped>
.payment-gateway-overlay {
  position: fixed;
  inset: 0;
  z-index: 4000;
  background: rgba(14, 45, 30, 0.72);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px;
  overflow-y: auto;
}

.payment-gateway-container {
  background: #ffffff;
  border-radius: 28px;
  box-shadow: 0 24px 60px rgba(18, 55, 38, 0.28);
  width: min(620px, 100%);
  max-height: 92vh;
  overflow-y: auto;
  position: relative;
  border: 1.5px solid rgba(220, 237, 225, 0.9);
  animation: modal-enter 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes modal-enter {
  from { opacity: 0; transform: scale(0.94) translateY(16px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

.gateway-close {
  position: absolute;
  top: 18px;
  right: 20px;
  background: #f1f8f3;
  border: none;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  cursor: pointer;
  color: #1e5235;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 10;
}

.gateway-close:hover {
  background: #e2f2e7;
  transform: scale(1.08);
}

.gateway-content {
  padding: 30px 32px 24px;
}

/* Encabezado */
.gateway-header {
  text-align: center;
  margin-bottom: 20px;
}

.gateway-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #eaf6ee;
  color: #2e7d32;
  font-size: 0.78rem;
  font-weight: 700;
  padding: 5px 14px;
  border-radius: 20px;
  letter-spacing: 0.04em;
  margin-bottom: 8px;
  border: 1px solid #c8e6d2;
}

.icon-svg {
  color: #2e7d32;
}

.gateway-header h2 {
  margin: 0 0 6px;
  font-family: "Montaga", Georgia, serif;
  color: #143e5e;
  font-size: 1.75rem;
}

.gateway-subtitle {
  margin: 0;
  color: #4b6b58;
  font-size: 0.92rem;
}

/* Tarjeta Resumen */
.order-summary-card {
  background: linear-gradient(135deg, #f3faf5 0%, #edf7f0 100%);
  border: 1.5px solid #cae6d3;
  border-radius: 20px;
  padding: 16px 20px;
  margin-bottom: 22px;
}

.summary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  border-bottom: 1px dashed #b9dfc6;
  padding-bottom: 10px;
}

.summary-title-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.activity-name {
  font-weight: 800;
  color: #143e5e;
  font-size: 1.05rem;
}

.people-tag {
  background: #143e5e;
  color: #ffffff;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.76rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 5px;
}

.summary-details {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 12px;
}

.detail-box {
  background: #ffffff;
  border: 1px solid #d8ede0;
  border-radius: 12px;
  padding: 8px 12px;
}

.detail-box .label {
  display: block;
  color: #6a8c78;
  font-size: 0.7rem;
  text-transform: uppercase;
  font-weight: 700;
}

.detail-box .val {
  font-weight: 800;
  color: #1a4d33;
  font-size: 0.88rem;
}

.summary-total-pay {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #ffffff;
  padding: 12px 16px;
  border-radius: 14px;
  border: 1.5px solid #a8dbb8;
}

.total-label {
  display: block;
  font-weight: 800;
  color: #143e5e;
  font-size: 0.95rem;
}

.total-note {
  display: block;
  font-size: 0.74rem;
  color: #658774;
}

.total-amount {
  font-size: 1.4rem;
  font-weight: 900;
  color: #1b5e20;
}

/* Tabs de Métodos */
.payment-methods-tabs {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 20px;
}

.tab-btn {
  background: #f8fbf9;
  border: 1.5px solid #dceade;
  border-radius: 16px;
  padding: 10px 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.tab-btn:hover {
  background: #f1f8f3;
  border-color: #aedab9;
}

.tab-btn.active {
  background: #eaf6ee;
  border-color: #2e7d32;
  box-shadow: 0 4px 14px rgba(46, 125, 50, 0.16);
}

.method-icon-circle {
  width: 36px;
  height: 36px;
  background: #ffffff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2e7d32;
  flex-shrink: 0;
  border: 1px solid #d0e7d7;
}

.tab-btn.active .method-icon-circle {
  background: #2e7d32;
  color: #ffffff;
}

.method-info strong {
  display: block;
  color: #143e5e;
  font-size: 0.84rem;
}

.method-info span {
  display: block;
  color: #668875;
  font-size: 0.7rem;
}

/* Formulario */
.payment-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.form-group label {
  font-size: 0.8rem;
  font-weight: 700;
  color: #234d38;
}

.form-group input,
.form-group select {
  padding: 11px 14px;
  border: 1.5px solid #d0e2d5;
  border-radius: 12px;
  font-size: 0.92rem;
  color: #143e5e;
  background: #fbfdfb;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #2e7d32;
  box-shadow: 0 0 0 3px rgba(46, 125, 50, 0.12);
  background: #ffffff;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.form-row.three-cols {
  grid-template-columns: 1fr 1fr 1fr;
}

.input-with-badge {
  position: relative;
}

.input-with-badge input {
  width: 100%;
  box-sizing: border-box;
  padding-right: 90px;
}

.card-brand {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: #e2f0e6;
  color: #1e5235;
  font-size: 0.72rem;
  font-weight: 800;
  padding: 3px 8px;
  border-radius: 6px;
  pointer-events: none;
}

.wallet-intro {
  background: #f1f8f3;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 0.83rem;
  color: #2b5c40;
  margin-bottom: 4px;
  border: 1px solid #d4ebdc;
}

.wallet-intro p {
  margin: 0;
}

.submit-payment-btn {
  background: linear-gradient(135deg, #1e663a 0%, #2e7d32 100%);
  color: #ffffff;
  border: none;
  border-radius: 16px;
  padding: 15px 24px;
  font-size: 1rem;
  font-weight: 800;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 6px;
  box-shadow: 0 6px 18px rgba(46, 125, 50, 0.28);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.submit-payment-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 24px rgba(46, 125, 50, 0.36);
  background: linear-gradient(135deg, #2e7d32 0%, #388e3c 100%);
}

.btn-arrow-svg {
  transition: transform 0.2s ease;
}

.submit-payment-btn:hover .btn-arrow-svg {
  transform: translateX(4px);
}

.gateway-security-footer {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.74rem;
  color: #6b8c78;
  border-top: 1px solid #edf4ef;
  padding-top: 14px;
}

.security-info {
  display: flex;
  align-items: center;
  gap: 6px;
}

/* VISTA DE PROCESAMIENTO */
.gateway-processing-view {
  padding: 60px 40px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.processing-spinner-wrapper {
  position: relative;
  width: 90px;
  height: 90px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.processing-spinner {
  position: absolute;
  inset: 0;
  border: 4px solid #e0f0e5;
  border-top-color: #2e7d32;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.bank-symbol-svg {
  display: flex;
  align-items: center;
  justify-content: center;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.gateway-processing-view h3 {
  font-family: "Montaga", Georgia, serif;
  color: #143e5e;
  font-size: 1.5rem;
  margin: 0 0 10px;
}

.processing-status-msg {
  color: #3f6850;
  font-weight: 600;
  margin: 0 0 24px;
  min-height: 24px;
}

.processing-progress-bar {
  width: min(320px, 100%);
  height: 8px;
  background: #e6f3eb;
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: 16px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4caf50, #2e7d32);
  transition: width 0.4s ease;
}

.processing-warning {
  font-size: 0.78rem;
  color: #7b9c89;
  margin: 0;
}

/* VISTA DE ÉXITO */
.gateway-success-view {
  padding: 40px 32px 30px;
  text-align: center;
}

.success-icon-badge {
  width: 72px;
  height: 72px;
  background: #2e7d32;
  color: #ffffff;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 14px;
  box-shadow: 0 10px 25px rgba(46, 125, 50, 0.35);
  animation: pop-check 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
}

@keyframes pop-check {
  from { transform: scale(0.4); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.success-badge-tag {
  display: inline-block;
  background: #eaf6ee;
  color: #2e7d32;
  font-size: 0.8rem;
  font-weight: 800;
  padding: 4px 16px;
  border-radius: 20px;
  margin-bottom: 10px;
  border: 1px solid #cbe7d4;
}

.gateway-success-view h2 {
  font-family: "Montaga", Georgia, serif;
  color: #143e5e;
  font-size: 1.8rem;
  margin: 0 0 10px;
}

.success-desc {
  color: #436653;
  font-size: 0.95rem;
  line-height: 1.5;
  margin: 0 0 20px;
}

.receipt-box {
  background: #f4faf6;
  border: 1.5px dashed #aed9bc;
  border-radius: 18px;
  padding: 18px 22px;
  margin-bottom: 24px;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 0.88rem;
}

.receipt-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #3b5f4a;
}

.receipt-amount {
  color: #1b5e20;
  font-size: 1.2rem;
  font-weight: 900;
}

.status-approved {
  background: #c8e6c9;
  color: #1b5e20;
  font-weight: 800;
  font-size: 0.74rem;
  padding: 3px 10px;
  border-radius: 8px;
}

.btn-finish {
  background: #143e5e;
  color: #ffffff;
  border: none;
  border-radius: 16px;
  padding: 15px 28px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(20, 62, 94, 0.25);
  transition: all 0.2s ease;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.btn-finish:hover {
  background: #1c527c;
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(20, 62, 94, 0.35);
}

@media (max-width: 600px) {
  .gateway-content {
    padding: 24px 16px 20px;
  }
  .payment-methods-tabs {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  .form-row, .form-row.three-cols {
    grid-template-columns: 1fr;
    gap: 10px;
  }
  .summary-details {
    grid-template-columns: 1fr;
    gap: 6px;
  }
  .summary-total-pay {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }
}
</style>

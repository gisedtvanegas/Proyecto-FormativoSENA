<template>
  <div v-if="open" class="ticket-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="ticket-title" @click.self="$emit('close')">
    <div class="ticket-container">
      
      <button type="button" class="ticket-close" @click="$emit('close')" aria-label="Cerrar">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      <div class="ticket-card" id="printable-ticket">
        <!-- Header del Ticket -->
        <div class="ticket-header">
          <div class="ticket-brand">
            <div class="leaf-badge-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path>
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>
              </svg>
            </div>
            <div>
              <h3>Casa y Jardín</h3>
              <p>Vivero - Café & Talleres</p>
            </div>
          </div>
          <span class="ticket-badge-confirmed">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Confirmada
          </span>
        </div>

        <div class="ticket-divider">
          <div class="notch notch-left"></div>
          <div class="divider-line"></div>
          <div class="notch notch-right"></div>
        </div>

        <!-- Cuerpo del Ticket -->
        <div class="ticket-body">
          <div class="ticket-activity-section">
            <span class="ticket-label">Experiencia Reservada</span>
            <h2 id="ticket-title" class="ticket-activity-name">{{ reserva?.descripcionActividad || 'Actividad Especial' }}</h2>
          </div>

          <div class="ticket-grid">
            <div class="ticket-info-item">
              <div class="info-item-header">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <span class="ticket-label">Fecha</span>
              </div>
              <strong>{{ formatearFecha(reserva?.fecha) }}</strong>
            </div>

            <div class="ticket-info-item">
              <div class="info-item-header">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <span class="ticket-label">Hora</span>
              </div>
              <strong>{{ reserva?.hora || '--:--' }}</strong>
            </div>

            <div class="ticket-info-item">
              <div class="info-item-header">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                <span class="ticket-label">Asistentes</span>
              </div>
              <strong>{{ reserva?.num_personas }} {{ reserva?.num_personas === 1 ? 'Persona' : 'Personas' }}</strong>
            </div>

            <div class="ticket-info-item">
              <div class="info-item-header">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                  <line x1="1" y1="10" x2="23" y2="10"></line>
                </svg>
                <span class="ticket-label">Abono 50%</span>
              </div>
              <span class="payment-badge-paid">Garantizado (PSE)</span>
            </div>
          </div>

          <div class="ticket-holder-info">
            <div class="holder-item">
              <span class="ticket-label">Titular:</span>
              <span>{{ authStore.nombreUsuario || 'Cliente' }}</span>
            </div>
            <div class="holder-item">
              <span class="ticket-label">Documento:</span>
              <span>{{ authStore.profile?.documento || 'No registrado' }}</span>
            </div>
            <div class="holder-item">
              <span class="ticket-label">ID de Reserva:</span>
              <span class="code-ref">#RES-{{ String(reserva?.idreserva || '0').padStart(5, '0') }}</span>
            </div>
          </div>

          <!-- Código QR Simulado -->
          <div class="ticket-qr-section">
            <div class="qr-code-box">
              <div class="qr-pattern">
                <div class="qr-corner top-left"></div>
                <div class="qr-corner top-right"></div>
                <div class="qr-corner bottom-left"></div>
                <div class="qr-inner-dots"></div>
              </div>
            </div>
            <div class="qr-desc">
              <p>Presenta este ticket al llegar al vivero-café.</p>
              <small>Recomendamos llegar con 10 minutos de antelación.</small>
            </div>
          </div>
        </div>

        <!-- Footer del Ticket -->
        <div class="ticket-footer">
          <div class="location-wrapper">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>Casa y Jardín Vivero Café • Calle de las Flores #10-24</span>
          </div>
        </div>
      </div>

      <!-- Acciones -->
      <div class="ticket-actions">
        <button type="button" class="btn-print" @click="imprimirTicket">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 6 2 18 2 18 9"></polyline>
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
            <rect x="6" y="14" width="12" height="8"></rect>
          </svg>
          <span>Imprimir / Guardar PDF</span>
        </button>
        <button type="button" class="btn-ticket-close" @click="$emit('close')">
          Cerrar
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/authStore';

defineProps({
  open: { type: Boolean, default: false },
  reserva: { type: Object, default: null }
});

defineEmits(['close']);

const authStore = useAuthStore();

const formatearFecha = (fechaStr) => {
  if (!fechaStr) return '--/--/----';
  const [year, month, day] = fechaStr.split('-');
  if (!year || !month || !day) return fechaStr;
  const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  return `${day} de ${meses[Number.parseInt(month, 10) - 1]}, ${year}`;
};

const imprimirTicket = () => {
  window.print();
};
</script>

<style scoped>
.ticket-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 4500;
  background: rgba(14, 45, 30, 0.75);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px;
  overflow-y: auto;
}

.ticket-container {
  width: min(480px, 100%);
  position: relative;
  animation: ticket-pop 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes ticket-pop {
  from { opacity: 0; transform: scale(0.9) translateY(20px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

.ticket-close {
  position: absolute;
  top: -14px;
  right: -14px;
  background: #ffffff;
  border: 2px solid #143e5e;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  color: #143e5e;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 10;
  transition: all 0.2s ease;
}

.ticket-close:hover {
  transform: scale(1.1);
  background: #f0f5f1;
}

.ticket-card {
  background: #ffffff;
  border-radius: 26px;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
  border: 1.5px solid #d4ebdc;
}

.ticket-header {
  background: linear-gradient(135deg, #143e5e 0%, #256a50 100%);
  color: #ffffff;
  padding: 22px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ticket-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.leaf-badge-icon {
  width: 38px;
  height: 38px;
  background: #f5ffeb;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ticket-brand h3 {
  margin: 0;
  font-family: "Montaga", Georgia, serif;
  font-size: 1.25rem;
  color: #f5ffeb;
}

.ticket-brand p {
  margin: 0;
  font-size: 0.74rem;
  color: #cbead4;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.ticket-badge-confirmed {
  background: #c5e1a5;
  color: #143e5e;
  font-size: 0.74rem;
  font-weight: 800;
  padding: 5px 12px;
  border-radius: 20px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.ticket-divider {
  position: relative;
  display: flex;
  align-items: center;
  background: #ffffff;
  height: 20px;
}

.notch {
  position: absolute;
  width: 22px;
  height: 22px;
  background: rgba(14, 45, 30, 0.75);
  border-radius: 50%;
  top: -1px;
}

.notch-left { left: -11px; }
.notch-right { right: -11px; }

.divider-line {
  width: 100%;
  border-top: 2px dashed #b5d8c1;
  margin: 0 16px;
}

.ticket-body {
  padding: 12px 24px 22px;
}

.ticket-label {
  display: block;
  font-size: 0.72rem;
  text-transform: uppercase;
  color: #658873;
  font-weight: 700;
  letter-spacing: 0.05em;
}

.ticket-activity-section {
  text-align: center;
  margin-bottom: 18px;
  padding-bottom: 12px;
  border-bottom: 1px solid #edf6f0;
}

.ticket-activity-name {
  margin: 4px 0 0;
  font-family: "Montaga", Georgia, serif;
  color: #143e5e;
  font-size: 1.5rem;
}

.ticket-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 18px;
}

.ticket-info-item {
  background: #f7fbf8;
  border: 1px solid #e1efe6;
  border-radius: 14px;
  padding: 10px 14px;
}

.info-item-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
}

.ticket-info-item strong {
  color: #143e5e;
  font-size: 0.95rem;
  display: block;
}

.payment-badge-paid {
  display: inline-block;
  background: #e8f5e9;
  color: #2e7d32;
  font-size: 0.76rem;
  font-weight: 800;
  padding: 3px 8px;
  border-radius: 8px;
}

.ticket-holder-info {
  background: #f3f8f4;
  border-radius: 14px;
  padding: 12px 16px;
  margin-bottom: 18px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  font-size: 0.84rem;
}

.holder-item {
  display: flex;
  justify-content: space-between;
  color: #244b36;
}

.code-ref {
  font-family: monospace;
  font-weight: 800;
  color: #143e5e;
}

.ticket-qr-section {
  display: flex;
  align-items: center;
  gap: 16px;
  background: #fbfdfb;
  border: 1.5px dashed #c0e0cd;
  border-radius: 16px;
  padding: 14px 16px;
}

.qr-code-box {
  width: 68px;
  height: 68px;
  background: #143e5e;
  border-radius: 10px;
  padding: 6px;
  box-sizing: border-box;
  flex-shrink: 0;
}

.qr-pattern {
  width: 100%;
  height: 100%;
  position: relative;
  background: #ffffff;
  border-radius: 4px;
}

.qr-corner {
  position: absolute;
  width: 14px;
  height: 14px;
  background: #143e5e;
}

.qr-corner.top-left { top: 3px; left: 3px; border: 2px solid #ffffff; }
.qr-corner.top-right { top: 3px; right: 3px; border: 2px solid #ffffff; }
.qr-corner.bottom-left { bottom: 3px; left: 3px; border: 2px solid #ffffff; }

.qr-desc p {
  margin: 0 0 4px;
  font-size: 0.82rem;
  font-weight: 700;
  color: #143e5e;
}

.qr-desc small {
  color: #6a8c78;
  font-size: 0.74rem;
}

.ticket-footer {
  background: #edf6ef;
  padding: 12px 16px;
  text-align: center;
  font-size: 0.74rem;
  color: #557563;
  border-top: 1px solid #dcebdf;
}

.location-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.ticket-actions {
  display: flex;
  gap: 10px;
  margin-top: 14px;
}

.btn-print {
  flex: 1;
  background: #2e7d32;
  color: #ffffff;
  border: none;
  border-radius: 14px;
  padding: 13px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(46, 125, 50, 0.28);
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-print:hover {
  background: #388e3c;
  transform: translateY(-2px);
}

.btn-ticket-close {
  background: rgba(255, 255, 255, 0.2);
  border: 1.5px solid rgba(255, 255, 255, 0.6);
  color: #ffffff;
  border-radius: 14px;
  padding: 13px 22px;
  font-weight: 700;
  cursor: pointer;
}

.btn-ticket-close:hover {
  background: rgba(255, 255, 255, 0.35);
}

@media print {
  body * {
    visibility: hidden;
  }
  #printable-ticket, #printable-ticket * {
    visibility: visible;
  }
  #printable-ticket {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    box-shadow: none;
    border: none;
  }
  .ticket-modal-overlay, .ticket-actions, .ticket-close {
    display: none;
  }
}
</style>

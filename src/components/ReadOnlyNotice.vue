<template>
  <div v-if="authStore.isEmpleado" class="aviso-empleado">
    <div class="icono">ℹ️</div>
    <div class="contenido">
      <strong>Perfil de Empleado (Modo Solo Lectura)</strong>
      <p>Tiene acceso para consultar la información del sistema, pero no puede crear, modificar ni eliminar registros.</p>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/authStore';
const authStore = useAuthStore();
</script>

<style scoped>
.aviso-empleado {
  background: rgba(255, 243, 205, 0.95);
  border: 1px solid #ffebaa;
  border-left: 6px solid #ffc107;
  color: #856404;
  padding: 14px 20px;
  border-radius: 12px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}
.icono {
  font-size: 1.8rem;
}
.contenido p {
  margin: 4px 0 0 0;
  font-size: 0.9rem;
}
</style>

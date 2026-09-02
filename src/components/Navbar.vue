<template>
  <div class="barrainicio">
    <div class="logotitulosof">
      <div class="logocorto">
        <router-link to="/">
          <img src="../assets/img/logo.png" alt="logocorto">
        </router-link>
      </div>
      <h1>Casa y Jardin</h1>
    </div>

    <button
      class="nav-toggle"
      id="nav-toggle"
      aria-label="Abrir menú"
      :aria-expanded="menuAbierto.toString()"
      @click="toggleMenu"
    >
      <span class="bar"></span>
      <span class="bar"></span>
      <span class="bar"></span>
    </button>

    <nav class="navegacion" id="nav-menu" :class="{ 'activo': menuAbierto }">
      <ul>
        <!-- Visitante no autenticado -->
        <template v-if="!authStore.isAuthenticated">
          <li><router-link to="/">Inicio</router-link></li>
          <li><router-link to="/actividades">Actividad</router-link></li>
          <li><router-link to="/menu">Menú</router-link></li>
          <li><router-link to="/login">Iniciar Sesión</router-link></li>
          <li><router-link to="/registro">Registrarse</router-link></li>
        </template>

        <!-- Usuario cliente autenticado -->
        <template v-else-if="authStore.isCliente">
          <li><router-link to="/panel-usuario">Inicio</router-link></li>
          <li><router-link to="/actividades">Actividad</router-link></li>
          <li><router-link to="/mis-reservas">Reservas</router-link></li>
          <li><router-link to="/menu">Menú</router-link></li>
          <li><router-link to="/perfil">Mi Perfil</router-link></li>
          <li><a href="#" @click.prevent="handleLogout">Cerrar Sesión</a></li>
        </template>

        <!-- Administrador o Empleado -->
        <template v-else-if="authStore.isAdminOrEmpleado">
          <li><router-link to="/admin">Panel Admin</router-link></li>
          <li><router-link to="/admin/reservas">Reservas</router-link></li>
          <li><router-link to="/admin/usuarios">Usuarios</router-link></li>
          <li><router-link to="/admin/actividades">Actividades</router-link></li>
          <li><router-link to="/admin/menu">Menú</router-link></li>
          <li><a href="#" @click.prevent="handleLogout">Cerrar Sesión</a></li>
        </template>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/authStore';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();
const menuAbierto = ref(false);

const toggleMenu = () => {
  menuAbierto.value = !menuAbierto.value;
};

const handleLogout = async () => {
  await authStore.logout();
  router.push('/login');
};
</script>

<style scoped>
/* Asegura el funcionamiento de la barra hamburguesa en dispositivos móviles */
@media (max-width: 850px) {
  .navegacion {
    display: none;
  }
  .navegacion.activo {
    display: block !important;
  }
}
</style>

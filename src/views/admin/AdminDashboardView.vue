<template>
  <div class="admin-shell">
    <aside class="barrainicioadmin">
      <div class="logotitulosoftadmin">
        <img src="../../assets/img/logo.png" alt="logocorto">
        <h1>Panel administrador</h1>
        
        <div v-if="authStore.nombreUsuario" class="mensaje-bienvenida">
          <p>Bienvenido: {{ authStore.nombreUsuario }}</p>
        </div>
      </div>
      
      <nav class="navegacionadmin">
        <ul>
          <li><router-link to="/admin">Inicio</router-link></li>
          <li><router-link to="/admin/reservas">Reservas</router-link></li>
          <li><router-link to="/admin/usuarios">Usuarios</router-link></li>
          <li><router-link to="/admin/actividades">Actividades</router-link></li>
          <li><router-link to="/admin/menu">Menú</router-link></li>
          <li><a href="#" @click.prevent="handleLogout">Cerrar Sesion</a></li>
        </ul>
      </nav>
    </aside>

    <main class="admin-workspace">
      <section class="admin-panel-card">
        <header class="admin-header">
          <div>
            <p class="admin-eyebrow">Casa y Jardin</p>
            <h2>Vivero - Café</h2>
          </div>
        </header>

        <section class="burbuja-grid" aria-label="Opciones del panel administrador">
          <div class="burbuja">
            <h1>Reservas</h1>
            <router-link class="accion-principal" to="/admin/reservas">Ver reservas</router-link>
            <div class="acciones-secundarias">
              <router-link to="/admin/disponibilidad">Disponibilidad</router-link>
              <router-link to="/admin/horarios">Horario</router-link>
            </div>
          </div>

          <div class="burbuja">
            <h1>Menú</h1>
            <router-link class="accion-principal" to="/admin/menu">Gestionar productos</router-link>
            <div class="acciones-secundarias">
              <router-link to="/menu">Ver menú público</router-link>
            </div>
          </div>

          <div class="burbuja">
            <h1>Usuarios</h1>
            <router-link class="accion-principal" to="/admin/usuarios">Ver usuarios</router-link>
            <div class="acciones-secundarias">
              <router-link to="/admin/tipos-doc">Tipo documento</router-link>
              <router-link to="/admin/roles">Roles</router-link>
            </div>
          </div>

          <div class="burbuja">
            <h1>Actividad</h1>
            <router-link class="accion-principal" to="/admin/actividades">Ver actividades</router-link>
            <div class="acciones-secundarias">
              <router-link to="/admin/tipos-actividad">Tipo actividad</router-link>
              <router-link to="/admin/precios">Lista precios</router-link>
            </div>
          </div>

          <a class="boton-expandible" href="#" @click.prevent="handleLogout">
            <span class="icono">
              <svg viewBox="0 0 512 512">
                <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"/>
              </svg>
            </span>
            <span class="texto">Cerrar sesión</span>
          </a>
        </section>
      </section>
    </main>
  </div>
</template>

<script setup>
import { useAuthStore } from '../../stores/authStore';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = async () => {
  await authStore.logout();
  router.push('/login');
};
</script>

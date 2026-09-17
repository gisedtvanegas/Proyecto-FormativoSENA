<template>
  <div id="app-wrapper">
    <Navbar v-if="showNavAndFooter" />
    <main class="main-content">
      <router-view />
    </main>
    <Footer v-if="showNavAndFooter" />
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from './stores/authStore';

const route = useRoute();
const authStore = useAuthStore();

const showNavAndFooter = computed(() => {
  return !route.meta?.hideNavAndFooter;
});

onMounted(async () => {
  await authStore.initSession();
});
</script>

<style>
/* Importación de Estilos Globales Originales */
@import "./assets/css/style.css";

#app-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
}
</style>

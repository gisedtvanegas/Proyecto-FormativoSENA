<template>
  <div class="panel-usuario-view">
    <Carousel />

    <div class="bienvenida">
      <p>
        <a style="cursor:default; pointer-events:none;">Hola, {{ authStore.nombreUsuario }}</a> <br>
        Agenda tu<span class="mariposa-ancla">s</span>
      </p>
      <h3>
        <router-link to="/mis-reservas" class="actividad">Reservas</router-link>
      </h3>
    </div>
    <ButterflyModel />

    <ReservationSteps />

    <GaleriaCarrusel />

    <div class="historia">
      <!-- Columna izquierda: mancha orgánica azul + perrito -->
      <div class="historia-imagen-blob">
        <div class="historia-blob">
          <img src="../assets/img/perritoo.jpeg" alt="Perrito de Casa y Jardín" />
        </div>
      </div>

      <!-- Columna derecha: texto -->
      <div class="historia-texto">
        <h2>Historia</h2>
        <p>
          Crecimos con la idea de poder enseñarle a las personas un poco de arte, 
          pero también teniendo un rato agradable con familiares y amigos. 
          Inicialmente trabajamos con kokedamas, realizando pequeños talleres para 
          personas interesadas, luego decidimos implementar nuevos talleres por 
          recomendación de nuestros clientes. A partir de ahí tenemos cerámicas 
          para pintar de forma libre, tote bags, materas, terrarios con una zona 
          especial para que cada cliente tenga una experiencia única.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import Carousel from '../components/Carousel.vue';
import ButterflyModel from '../components/ButterflyModel.vue';
import ReservationSteps from '../components/ReservationSteps.vue';
import GaleriaCarrusel from '../components/GaleriaCarrusel.vue';
import { useAuthStore } from '../stores/authStore';

const authStore = useAuthStore();
</script>


<template>
  <div class="home-view">
    <Carousel />

    <div class="bienvenida">
      <p>¡Bienvenidos!<br>Conoce nuestra<span class="mariposa-ancla">s</span></p>
      <h3>
        <router-link to="/actividades">Actividades</router-link>
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
        <h2>Nuestra Historia</h2>
        <p>
          Nuestra historia comenzó con un sueño simple: fusionar el amor por la naturaleza con el aroma inconfundible de un buen café. En Casa y Jardín, creamos un refugio verde en medio de la ciudad, un vivero café donde cada planta tiene una historia y cada taza invita a la tranquilidad. Lo que comenzó como un pequeño rincón para los amantes de la jardinería ha crecido gracias a ustedes, convirtiéndose en un espacio único de encuentro, inspiración y aprendizaje a través de nuestros talleres.
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
</script>

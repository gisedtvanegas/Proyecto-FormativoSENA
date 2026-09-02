<template>
  <div class="carrusel">
    <div class="imagen-contenedor" id="carrusel" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
      <img src="../assets/img/prueba.jpg" alt="Fachada">
      <img src="../assets/img/foto.jpg" alt="Entrada">
      <img src="../assets/img/fotoprueba.jpg" alt="Sillas">
      <img src="../assets/img/prueba.prueba.jpg" alt="Mesas">
    </div>

    <div class="buttons">
      <button type="button" class="btizquierdo" id="left" @click="prevSlide">&#10094;</button>
      <button type="button" class="btderecho" id="right" @click="nextSlide">&#10095;</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const currentIndex = ref(0);
const totalImages = 4;
let timer = null;

const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % totalImages;
};

const prevSlide = () => {
  currentIndex.value = (currentIndex.value - 1 + totalImages) % totalImages;
};

onMounted(() => {
  timer = setInterval(nextSlide, 4000);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});
</script>

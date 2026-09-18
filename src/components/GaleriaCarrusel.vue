<template>
  <section class="galeria-cafeteria" aria-labelledby="titulo-galeria-cafeteria">
    <h2 id="titulo-galeria-cafeteria">Conoce nuestra cafeteria!</h2>

    <div class="galeria-carrusel-viewport">
      <div class="galeria-carrusel-pista">
        <!-- Imágenes originales -->
        <figure class="galeria-carrusel-tarjeta">
          <img src="../assets/img/pordentro.jpeg" alt="Espacio de la cafetería" loading="lazy" />
        </figure>
        <figure class="galeria-carrusel-tarjeta">
          <img src="../assets/img/sillitas.jpeg" alt="Entrada de Casa y Jardín" loading="lazy" />
        </figure>
        <figure class="galeria-carrusel-tarjeta">
          <img src="../assets/img/fotoprueba.jpg" alt="Mesas de la cafetería" loading="lazy" />
        </figure>
        <figure class="galeria-carrusel-tarjeta">
          <img src="../assets/img/local.jpeg" alt="Ambiente de la cafetería" loading="lazy" />
        </figure>
        <figure class="galeria-carrusel-tarjeta">
          <img src="../assets/img/prueba.jpg" alt="Actividad de cerámica en Casa y Jardín" loading="lazy" />
        </figure>
        <figure class="galeria-carrusel-tarjeta">
          <img src="../assets/img/platitos.jpeg" alt="Rincón de Casa y Jardín" loading="lazy" />
        </figure>

        <!-- Clon para el loop infinito sin saltos -->
        <figure class="galeria-carrusel-tarjeta" aria-hidden="true">
          <img src="../assets/img/pordentro.jpeg" alt="" />
        </figure>
        <figure class="galeria-carrusel-tarjeta" aria-hidden="true">
          <img src="../assets/img/sillitas.jpeg" alt="" />
        </figure>
        <figure class="galeria-carrusel-tarjeta" aria-hidden="true">
          <img src="../assets/img/fotoprueba.jpg" alt="" />
        </figure>
        <figure class="galeria-carrusel-tarjeta" aria-hidden="true">
          <img src="../assets/img/local.jpeg" alt="" />
        </figure>
        <figure class="galeria-carrusel-tarjeta" aria-hidden="true">
          <img src="../assets/img/prueba.jpg" alt="" />
        </figure>
        <figure class="galeria-carrusel-tarjeta" aria-hidden="true">
          <img src="../assets/img/platitos.jpeg" alt="" />
        </figure>
      </div>
    </div>
  </section>
</template>

<script setup>
// Sin lógica JS — el carrusel es 100% CSS
</script>

<style scoped>
/* ─── Contenedor de la sección ─────────────────────────────────── */
.galeria-cafeteria {
  width: min(1300px, calc(100% - 48px));
  margin: 0 auto;
  padding: 64px 0;
  box-sizing: border-box;
  background: #597f91;
  text-align: center;
  overflow: hidden;
}

.galeria-cafeteria h2 {
  margin: 0 0 36px;
  color: #eef4f7;
  font-family: "Montaga", serif;
  font-size: clamp(1.8rem, 3.5vw, 2.5rem);
}

/* ─── Viewport: oculta lo que sale del carrusel ─────────────────── */
.galeria-carrusel-viewport {
  width: 100%;
  overflow: hidden;
}

.galeria-cafeteria:hover .galeria-carrusel-pista {
  animation-play-state: paused;
}

/* ─── Pista: fila de imágenes que se desplaza ───────────────────── */
.galeria-carrusel-pista {
  display: flex;
  gap: 18px;
  width: max-content;
  animation: marquee-galeria 35s linear infinite;
  will-change: transform;
}

/* ─── Cada tarjeta ──────────────────────────────────────────────── */
.galeria-carrusel-tarjeta {
  margin: 0;
  flex: 0 0 300px;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border: 3px solid #0d3347;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 3px 12px rgba(10, 40, 60, 0.25);
  transition: box-shadow 0.3s ease;
}

.galeria-carrusel-tarjeta:hover {
  box-shadow: 0 8px 24px rgba(20, 62, 94, 0.22);
}

.galeria-carrusel-tarjeta img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.galeria-carrusel-tarjeta:hover img {
  transform: scale(1.04);
}

/* ─── Animación: desplaza exactamente las 6 originales ─ */
/* Cada tarjeta: 300px + 18px gap = 318px × 6 = 1908px */
@keyframes marquee-galeria {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-1908px); }
}

/* ─── Responsive ────────────────────────────────────────────────── */
@media (max-width: 900px) {
  .galeria-carrusel-tarjeta {
    flex: 0 0 240px;
  }
}

@media (max-width: 560px) {
  .galeria-cafeteria {
    padding: 40px 0;
  }

  .galeria-carrusel-tarjeta {
    flex: 0 0 200px;
  }
}
</style>

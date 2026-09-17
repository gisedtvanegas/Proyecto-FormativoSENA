
<template>
  <div class="home-view">
    <Carousel />

    <div class="bienvenida">
      <p>¡Bienvenidos!<br>Conoce nuestras </p>
      <h3>
        <router-link to="/actividades">Actividades</router-link>
      </h3>
    </div>

    <div class="reservain">
      <h2>¿Cómo puedes agendar reserva con nosotros?</h2>
      
      <div class="pasos-contenedor">
        <div class="paso-card">
          <span class="paso-numero">Paso 1</span>
          <p class="paso-texto">Inicia Sesión, si no tienes cuenta, crea una.</p>
        </div>
        <div class="paso-card">
          <span class="paso-numero">Paso 2</span>
          <p class="paso-texto">Llena los datos para poder realizar la reserva.</p>
        </div>
        <div class="paso-card">
          <span class="paso-numero">Paso 3</span>
          <p class="paso-texto">Selecciona la actividad que desees.</p>
        </div>
        <div class="paso-card">
          <span class="paso-numero">Paso 4</span>
          <p class="paso-texto">Continua con el pago del abono.</p>
        </div>
        <div class="paso-card">
          <span class="paso-numero">Paso 5</span>
          <p class="paso-texto">Felicidades!! Ya tendrás realizada tu reserva!!</p>
        </div>
      </div>
      <router-link to="/login" class="agendare">Agenda tu Reserva!</router-link>
    </div>

    <section class="galeria-cafeteria" aria-labelledby="titulo-galeria-cafeteria">
      <h2 id="titulo-galeria-cafeteria">Conoce nuestra cafeteria!</h2>
      <div class="galeria-cafeteria-grid">
        <figure class="galeria-cafeteria-tarjeta"><img src="../assets/img/pordentro.jpeg" alt="Espacio de la cafetería"></figure>
        <figure class="galeria-cafeteria-tarjeta"><img src="../assets/img/sillitas.jpeg" alt="Entrada de Casa y Jardín"></figure>
        <figure class="galeria-cafeteria-tarjeta"><img src="../assets/img/fotoprueba.jpg" alt="Mesas de la cafetería"></figure>
        <figure class="galeria-cafeteria-tarjeta"><img src="../assets/img/local.jpeg" alt="Ambiente de la cafetería"></figure>
        <figure class="galeria-cafeteria-tarjeta"><img src="../assets/img/prueba.jpg" alt="Actividad de cerámica en Casa y Jardín"></figure>
        <figure class="galeria-cafeteria-tarjeta"><img src="../assets/img/platitos.jpeg" alt="Rincón de Casa y Jardín"></figure>
      </div>
    </section>

    <div class="historia">
      <h2>Nuestra Historia</h2>
      <p>
        Nuestra historia comenzó con un sueño simple: fusionar el amor por la naturaleza con el aroma inconfundible de un buen café. En Casa y Jardín, creamos un refugio verde en medio de la ciudad, un vivero café donde cada planta tiene una historia y cada taza invita a la tranquilidad. Lo que comenzó como un pequeño rincón para los amantes de la jardinería ha crecido gracias a ustedes, convirtiéndose en un espacio único de encuentro, inspiración y aprendizaje a través de nuestros talleres.
      </p>
    </div>
  </div>
</template>

<script setup>
import Carousel from '../components/Carousel.vue';
</script>

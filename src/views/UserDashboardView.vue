<template>
  <div class="panel-usuario-view">
    <Carousel />

    <div class="bienvenida">
      <p>
        <a style="cursor:default; pointer-events:none;">Hola, {{ authStore.nombreUsuario }}</a> <br>
        Agenda tu
      </p>
      <h3>
        <router-link to="/mis-reservas" class="actividad">Reserva</router-link>
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
      <router-link to="/mis-reservas" class="agendare">Agenda tu Reserva!</router-link>
    </div>

    <section class="galeria-cafeteria" aria-labelledby="titulo-galeria-cafeteria">
      <h2 id="titulo-galeria-cafeteria">Conoce nuestra cafeteria!</h2>
      <div class="galeria-cafeteria-grid">
        <figure class="galeria-cafeteria-tarjeta"><img src="../assets/img/prueba.jpg" alt="Espacio de la cafetería"></figure>
        <figure class="galeria-cafeteria-tarjeta"><img src="../assets/img/foto.jpg" alt="Entrada de Casa y Jardín"></figure>
        <figure class="galeria-cafeteria-tarjeta"><img src="../assets/img/fotoprueba.jpg" alt="Mesas de la cafetería"></figure>
        <figure class="galeria-cafeteria-tarjeta"><img src="../assets/img/prueba.prueba.jpg" alt="Ambiente de la cafetería"></figure>
        <figure class="galeria-cafeteria-tarjeta"><img src="../assets/img/ceramica.jpg" alt="Actividad de cerámica en Casa y Jardín"></figure>
        <figure class="galeria-cafeteria-tarjeta"><img src="../assets/img/ola_1.jpg" alt="Rincón de Casa y Jardín"></figure>
      </div>
    </section>

    <div class="historia">
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
</template>

<script setup>
import Carousel from '../components/Carousel.vue';
import { useAuthStore } from '../stores/authStore';

const authStore = useAuthStore();
</script>

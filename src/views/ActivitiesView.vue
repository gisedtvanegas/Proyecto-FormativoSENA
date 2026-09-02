<template>
  <div class="actividades-page-wrapper">
    <main class="actividades-publicas"> 
      <h2>Explora nuestras actividades</h2> <br> <br>
      
      <section class="tarjetas-actividades" aria-label="Actividades disponibles">
        <article class="tarjeta-actividad" v-for="actividad in actividades" :key="actividad.idactividad">
          <button
            class="tarjeta-actividad-boton"
            type="button"
            :aria-pressed="actividad.flipped ? 'true' : 'false'"
            @click="actividad.flipped = !actividad.flipped"
          >
            <span class="tarjeta-actividad-inner" :class="{ 'flipped': actividad.flipped }">
              <span class="tarjeta-actividad-frente">
                <img :src="getImagenUrl(actividad.foto_actividad)" :alt="`Imagen de la actividad ${actividad.descripcion_actividad}`">
                <span class="tarjeta-sombra"></span>
                <span class="tarjeta-actividad-titulo">{{ actividad.descripcion_actividad }}</span>
                <span class="tarjeta-indicacion">Dale click para ver información</span>
              </span>
              <span class="tarjeta-actividad-reverso">
                <span class="tarjeta-actividad-informacion">
                  {{ actividad.informacion || 'Próximamente encontrarás más información sobre esta actividad.' }}
                </span>
                <router-link
                  class="tarjeta-agenda-btn"
                  :to="authStore.isAuthenticated ? '/mis-reservas' : '/login'"
                  @click.stop
                >
                  Agenda tu actividad!
                </router-link>
                <span class="tarjeta-indicacion">Volver ↻</span>
              </span>
            </span>
          </button>
        </article>
      </section>

      <p v-if="!cargando && actividades.length === 0" class="sin-actividades">
        Aún no hay actividades disponibles en este momento.
      </p>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { actividadesService } from '../services/actividades.service';
import { useAuthStore } from '../stores/authStore';

const authStore = useAuthStore();
const actividades = ref([]);
const cargando = ref(true);

onMounted(async () => {
  try {
    const res = await actividadesService.listarPublicas();
    actividades.value = res.map(a => ({ ...a, flipped: false }));
  } catch (err) {
    actividades.value = [
      { idactividad: 1, descripcion_actividad: 'Pintar Ceramicas', informacion: 'Taller de pintura en piezas cerámicas artesanales con acrílicos y barnices.', foto_actividad: 'ceramica.jpg', flipped: false },
      { idactividad: 2, descripcion_actividad: 'Pintar Tote Bag', informacion: 'Personaliza tu propia bolsa de tela ecológica con pintura textil.', foto_actividad: 'fotoprueba.jpg', flipped: false },
      { idactividad: 3, descripcion_actividad: 'Tejer Amigurumis', informacion: 'Aprende las técnicas básicas de ganchillo para tejer figuras amigurumi.', foto_actividad: 'prueba.jpg', flipped: false },
      { idactividad: 4, descripcion_actividad: 'Sembrar Terrarios', informacion: 'Crea y lleva a casa un mini ecosistema con suculentas y cristales.', foto_actividad: 'ola_1.jpg', flipped: false }
    ];
  } finally {
    cargando.value = false;
  }
});

const getImagenUrl = (foto) => {
  if (!foto) return new URL('../assets/img/ceramica.jpg', import.meta.url).href;
  if (foto.startsWith('http')) return foto;
  try {
    return new URL(`../assets/img/${foto}`, import.meta.url).href;
  } catch (e) {
    return new URL('../assets/img/ceramica.jpg', import.meta.url).href;
  }
};
</script>

<style scoped>
.actividades-page-wrapper {
  padding-top: 100px;
  padding-bottom: 60px;
}
.tarjeta-actividad-inner.flipped {
  transform: rotateY(180deg);
}
</style>

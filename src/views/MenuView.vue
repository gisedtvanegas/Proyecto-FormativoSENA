<template>
  <div class="menu-page-wrapper">
    <main class="menu-publico"> <br> <br>
      <h2>Conoce nuestro delicioso menú y pidelo cuando vayas a visitarnos</h2> <br> <br>
      
      <section class="tarjetas-menu" aria-label="Productos del menú">
        <article class="tarjeta-menu" v-for="producto in productos" :key="producto.idproducto">
          <img :src="getImagenUrl(producto.imagen_url)" :alt="producto.nombre">
          <div class="tarjeta-menu-contenido">
            <h3>{{ producto.nombre }}</h3>
            <p>{{ producto.descripcion }}</p>
            <strong>${{ formatPrecio(producto.precio) }}</strong>
          </div>
        </article>
      </section>

      <p v-if="!cargando && productos.length === 0" class="sin-actividades">
        Pronto encontrarás productos deliciosos aquí.
      </p>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { productosService } from '../services/productos.service';

const productos = ref([]);
const cargando = ref(true);

onMounted(async () => {
  try {
    productos.value = await productosService.listar();
  } catch (err) {
    productos.value = [
      { idproducto: 1, nombre: 'Café Espresso Doble', descripcion: 'Espresso intenso extraído de granos orgánicos de la casa.', precio: 7500, imagen_url: 'foto.jpg' },
      { idproducto: 2, nombre: 'Capuchino Artesanal', descripcion: 'Espresso suave con leche cremada al vapor y toque de canela.', precio: 9500, imagen_url: 'foto.jpg' },
      { idproducto: 3, nombre: 'Torta de Cerámica Matcha', descripcion: 'Deliciosa torta artesanal de matcha con relleno de crema agria.', precio: 14000, imagen_url: 'ceramica.jpg' },
      { idproducto: 4, nombre: 'Té de Hierbas del Jardín', descripcion: 'Infusión natural de menta, manzanilla y cidrón fresco.', precio: 6500, imagen_url: 'ola_1.jpg' }
    ];
  } finally {
    cargando.value = false;
  }
});

const getImagenUrl = (imagen) => {
  if (!imagen) return new URL('../assets/img/fotoprueba.jpg', import.meta.url).href;
  if (imagen.startsWith('http')) return imagen;
  try {
    return new URL(`../assets/img/${imagen}`, import.meta.url).href;
  } catch (e) {
    return new URL('../assets/img/fotoprueba.jpg', import.meta.url).href;
  }
};

const formatPrecio = (precio) => {
  if (!precio) return '0';
  return Number(precio).toLocaleString('es-CO');
};
</script>

<style scoped>
.menu-page-wrapper {
  padding-top: 100px;
  padding-bottom: 60px;
}
</style>

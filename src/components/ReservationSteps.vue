<template>
  <section class="reservation-journey" aria-labelledby="reservation-journey-title">
    <header class="reservation-journey__header">
      <p class="reservation-journey__eyebrow">Reserva tu experiencia</p>
      <h2 id="reservation-journey-title">¿Cómo puedes agendar reserva con nosotros?</h2>
    </header>

    <div ref="track" class="reservation-journey__track">
      <article
        v-for="(step, index) in steps"
        :key="step.number"
        class="reservation-slide"
        :class="['reservation-slide--' + (index + 1), { 'reservation-slide--active': currentStep === index }]"
        :data-step="index"
      >
        <div class="reservation-slide__content">
          <span class="reservation-slide__number">0{{ step.number }}</span>
          <div class="reservation-slide__card">
            <p class="reservation-slide__label">Paso {{ step.number }}</p>
            <h3>{{ step.title }}</h3>
            <p>{{ step.description }}</p>
          </div>
          <router-link v-if="index === steps.length - 1" :to="authStore.isAuthenticated ? '/mis-reservas' : '/login'" class="reservation-slide__action">
            Agenda tu reserva
          </router-link>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useAuthStore } from '../stores/authStore';

const authStore = useAuthStore();
const track = ref(null);
const currentStep = ref(0);
let slideObserver;
let navbarObserver;

const steps = [
  {
    number: 1,
    title: 'Inicia sesión',
    description: 'Ingresa con tu cuenta. Si aún no tienes una, puedes crearla en pocos pasos.'
  },
  {
    number: 2,
    title: 'Completa tus datos',
    description: 'Déjanos la información necesaria para preparar tu reserva.'
  },
  {
    number: 3,
    title: 'Elige tu actividad',
    description: 'Selecciona la experiencia que quieres disfrutar en Casa y Jardín.'
  },
  {
    number: 4,
    title: 'Confirma tu abono',
    description: 'Realiza el abono y tu reserva quedará lista para esperarte.'
  }
];

const updateNavbarVisibility = (isHidden) => {
  const navbar = document.querySelector('.barrainicio');
  if (navbar) {
    navbar.classList.toggle('barrainicio--hidden', isHidden);
  }
};

onMounted(() => {
  slideObserver = new IntersectionObserver(
    (entries) => {
      const visibleSlide = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visibleSlide) {
        currentStep.value = Number(visibleSlide.target.dataset.step);
      }
    },
    { root: null, threshold: [0.3, 0.5, 0.7] }
  );

  track.value?.querySelectorAll('.reservation-slide').forEach((slide) => slideObserver.observe(slide));

  const sectionEl = document.querySelector('.reservation-journey');
  if (sectionEl) {
    navbarObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        updateNavbarVisibility(entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0,
        rootMargin: '-60px 0px -60px 0px'
      }
    );
    navbarObserver.observe(sectionEl);
  }
});

onBeforeUnmount(() => {
  slideObserver?.disconnect();
  navbarObserver?.disconnect();
  updateNavbarVisibility(false);
});
</script>

<style scoped>
.reservation-journey {
  background: #143e5e;
  border-left: 1px solid rgba(255, 255, 255, .65);
  border-right: 1px solid rgba(255, 255, 255, .65);
  margin: 0 auto;
  overflow: visible;
  position: relative;
  width: min(1300px, calc(100% - 48px));
}

.reservation-journey__header {
  color: #f5ffeb;
  left: 50%;
  pointer-events: none;
  position: absolute;
  text-align: center;
  top: clamp(28px, 7vh, 82px);
  transform: translateX(-50%);
  width: min(800px, calc(100% - 40px));
  z-index: 2;
}

.reservation-journey__eyebrow {
  font-size: .72rem;
  font-weight: 700;
  letter-spacing: .22em;
  margin: 0 0 12px;
  text-transform: uppercase;
}

.reservation-journey h2 {
  font-family: "Montaga", Georgia, serif;
  font-size: clamp(1.65rem, 3.2vw, 3rem);
  line-height: 1.12;
  margin: 0;
}

.reservation-journey__track {
  height: auto;
  overflow: visible;
  scroll-snap-type: none;
}

.reservation-slide {
  align-items: center;
  display: flex;
  justify-content: center;
  min-height: 100dvh;
  overflow: hidden;
  padding: clamp(180px, 30vh, 250px) 24px 64px;
  scroll-snap-align: start;
  box-sizing: border-box;
}

/* Degradados y colores originales de cada slider */
.reservation-slide--1 { background: linear-gradient(135deg, #143e5e 0%, #26708a 100%); }
.reservation-slide--2 { background: linear-gradient(135deg, #236b7f 0%, #4c9b95 100%); }
.reservation-slide--3 { background: linear-gradient(135deg, #4c9b95 0%, #9aab64 100%); }
.reservation-slide--4 { background: linear-gradient(135deg, #9aab64 0%, #c5e1a5 100%); }

.reservation-slide__content {
  align-items: center;
  color: #f5ffeb;
  display: flex;
  flex-direction: column;
  max-width: 540px;
  opacity: .25;
  text-align: center;
  transform: translate3d(0, 80px, 0) scale(.86) rotateX(12deg);
  transition: opacity .7s ease, transform .8s cubic-bezier(.16, 1, .3, 1);
}

.reservation-slide--active .reservation-slide__content {
  opacity: 1;
  transform: translate3d(0, 0, 0) scale(1) rotateX(0);
}

.reservation-slide__number {
  color: rgba(245, 255, 235, .55);
  font-size: clamp(4.5rem, 12vw, 9rem);
  font-weight: 800;
  letter-spacing: -.08em;
  line-height: .75;
  margin-bottom: 18px;
}

.reservation-slide__card {
  backdrop-filter: blur(14px);
  background: rgba(255, 255, 255, .14);
  border: 1px solid rgba(255, 255, 255, .35);
  border-radius: 28px;
  box-shadow: 0 24px 60px rgba(7, 42, 57, .2);
  padding: clamp(28px, 5vw, 48px);
}

.reservation-slide__label {
  font-size: .75rem;
  font-weight: 800;
  letter-spacing: .18em;
  margin: 0 0 10px;
  text-transform: uppercase;
}

.reservation-slide h3 {
  font-family: "Montaga", Georgia, serif;
  font-size: clamp(2rem, 5vw, 3.5rem);
  line-height: 1;
  margin: 0 0 18px;
}

.reservation-slide__card > p:last-child {
  font-size: clamp(1rem, 1.8vw, 1.2rem);
  line-height: 1.6;
  margin: 0;
}

.reservation-slide__action {
  background: #f5ffeb;
  border-radius: 999px;
  color: #143e5e;
  font-weight: 800;
  margin-top: 28px;
  padding: 15px 28px;
  text-decoration: none;
  transition: transform .25s ease, box-shadow .25s ease;
}

.reservation-slide__action:hover {
  box-shadow: 0 10px 25px rgba(20, 62, 94, .28);
  transform: translateY(-3px);
}

@media (max-width: 768px) {
  .reservation-journey {
    border-left: none;
    border-right: none;
    width: 100%;
  }

  .reservation-slide {
    padding-left: 20px;
    padding-right: 20px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .reservation-slide__content { transition: none; }
}
</style>
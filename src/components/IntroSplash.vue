<template>
  <Transition name="intro-fade">
    <section
      v-if="isVisible"
      class="intro-splash"
      :class="{ 'intro-splash--leaving': isLeaving }"
      aria-label="Bienvenida a Casa y Jardín Vivero - Café"
    >
      <div class="intro-splash__content">
        <p class="intro-splash__initials" aria-hidden="true">C.J.V.C</p>
        <p class="intro-splash__name">Casa y Jardín <span>Vivero - Café</span></p>
      </div>
    </section>
  </Transition>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';

const isVisible = ref(true);
const isLeaving = ref(false);
const timers = [];

onMounted(() => {
  timers.push(window.setTimeout(() => {
    isLeaving.value = true;
  }, 2600));

  timers.push(window.setTimeout(() => {
    isVisible.value = false;
  }, 3150));
});

onBeforeUnmount(() => {
  timers.forEach(window.clearTimeout);
});
</script>

<style scoped>
.intro-splash {
  align-items: center;
  background: #c5e1a5;
  display: flex;
  height: 100dvh;
  inset: 0;
  justify-content: center;
  overflow: hidden;
  position: fixed;
  width: 100%;
  z-index: 3000;
}

.intro-splash__content {
  color: #143E5E;
  padding: 24px;
  text-align: center;
}

.intro-splash__initials {
  animation: initials-enter 900ms cubic-bezier(.16, 1, .3, 1) both;
  font-family: "Montagu Slab", Georgia, serif;
  font-size: clamp(4.5rem, 15vw, 11rem);
  font-weight: 500;
  letter-spacing: .06em;
  line-height: .85;
  margin: 0;
}

.intro-splash__name {
  animation: name-reveal 900ms cubic-bezier(.16, 1, .3, 1) 700ms both;
  font-family: "Montserrat", sans-serif;
  font-size: clamp(.7rem, 1.65vw, 1.1rem);
  font-weight: 500;
  letter-spacing: .19em;
  line-height: 1.5;
  margin: 28px 0 0;
  overflow: hidden;
  text-transform: uppercase;
}

.intro-splash__name span {
  display: block;
}

.intro-splash--leaving {
  animation: curtain-up 550ms cubic-bezier(.76, 0, .24, 1) forwards;
}

@keyframes initials-enter {
  from { opacity: 0; transform: translateY(30px) scale(.94); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

@keyframes name-reveal {
  from { clip-path: inset(0 50% 0 50%); opacity: 0; letter-spacing: .45em; }
  to { clip-path: inset(0 0 0 0); opacity: 1; letter-spacing: .19em; }
}

@keyframes curtain-up {
  to { opacity: 0; transform: translateY(-100%); }
}

@media (prefers-reduced-motion: reduce) {
  .intro-splash__initials,
  .intro-splash__name,
  .intro-splash--leaving { animation: none; }
}
</style>

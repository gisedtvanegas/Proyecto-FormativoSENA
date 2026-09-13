<template>
  <div v-if="open" class="feedback-overlay" role="presentation" @click.self="$emit('close')">
    <section class="feedback-modal" role="dialog" aria-modal="true" aria-labelledby="feedback-title">
      <h2 id="feedback-title">{{ title }}</h2>
      <p>{{ message }}</p>
      <button type="button" @click="$emit('close')">Entendido</button>
    </section>
  </div>
</template>

<script setup>
defineProps({
  open: Boolean,
  title: { type: String, default: 'Información' },
  message: { type: String, default: '' }
});
defineEmits(['close']);
</script>

<style scoped>
.feedback-overlay { position: fixed; inset: 0; z-index: 1200; display: grid; place-items: center; padding: 1rem; background: rgba(0, 0, 0, .55); }
.feedback-modal { width: min(440px, 100%); padding: 2rem; border-radius: 14px; text-align: center; background: #fff; color: #1f2937; box-shadow: 0 16px 45px rgba(0, 0, 0, .24); }
.feedback-modal h2 { margin-top: 0; color: #2e6846; }
.feedback-modal p { line-height: 1.55; }
.feedback-modal button { margin-top: 1rem; padding: .75rem 1.25rem; border: 0; border-radius: 8px; color: #fff; background: #2e6846; cursor: pointer; }
</style>

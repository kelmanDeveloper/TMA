<script setup>
import { ref, onMounted } from 'vue'
defineProps({
  msg: {
    type: String,
    required: true
  }
})
</script>

<template>
  <h1 class="shake">
    {{ msg }}
  </h1>
</template>

<style scoped>
h1 {
  color: var(--color-white);
  font-size: var(--size-20);
  line-height: var(--height-24);
  font-weight: var(--semibold);
  text-transform: uppercase;
  transition: .5s;
  text-align: center;
  max-width: 29rem;
  margin: 0 auto 2rem auto;
}
</style>

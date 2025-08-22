<template>
  <button class="main_button">
    <slot>
      {{ msg }}
    </slot>
  </button>
</template>

<script setup>
const props = defineProps({
  msg: {
    type: String,
    required: true,
  },
});
</script>

<style scoped>
.main_button {
  font-size: var(--size-14);
  color: var(--color-white);
  line-height: var(--height-18);
  text-transform: uppercase;
  width: 100%;
  padding: 1.6rem 3.2rem;
  border-radius: 4px;
  background: linear-gradient(135deg, #CE9FFC 0%, #7367F0 100%);
  background: linear-gradient(to bottom  #ce9ffc, #7367f0);
 



  



  &:active {
    background-color: #b7b7b7;
    background-size: 100%;
    transition: background 0s;
  }
}
</style>
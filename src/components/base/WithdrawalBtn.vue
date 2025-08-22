<template>
  <button class="withdrawal-btn">
    {{ languageStore.t('baseComponents.airdrop.withdraw') }}
  </button>
</template>

<script setup>
import { useLanguageStore } from "@/stores/languageStore";
const languageStore = useLanguageStore();
</script>

<style scoped>
.withdrawal-btn {
  background: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.withdrawal-btn:hover {
  background: #45a049;
}
</style>
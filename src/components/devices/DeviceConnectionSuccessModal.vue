<script setup>
import { defineEmits } from "vue";
import { useLanguageStore } from "@/stores/languageStore";

const languageStore = useLanguageStore();

const emit = defineEmits(["close"]);

const closeModal = () => {
  emit("close");
};
</script>

<template>
  <div class="modal-wrapper" @click.self="closeModal">
    <div class="modal animate-fadeIn">
      <h3 class="modal-title">
        {{ languageStore.t('baseComponents.baseModal.deviceConnectionSuccess.title') }}
      </h3>
      <p class="modal-text">
        {{ languageStore.t('baseComponents.baseModal.deviceConnectionSuccess.text') }}
      </p>

      <div class="modal-actions">
        <button class="btn" @click="closeModal">
          {{ languageStore.t('baseComponents.baseModal.deviceConnectionSuccess.btn') }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.modal-wrapper {
  display: grid;
  place-content: center;
  position: fixed;
  bottom: 0;
  top: 0;
  left: 0;
  right: 0;
  z-index: 4;
  backdrop-filter: blur(4px);
  background-color: rgba(0, 0, 0, 0.4);
}

.modal {
  background-color: #1e1d21;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
  width: 320px;
  max-width: 90vw;
  color: #fff;
  border: 1px solid #816bfa;
  font-family: Arial, sans-serif;
  animation: fadeIn 0.3s ease-out;
}

.modal-title {
  color: #b5a4ff;
  font-size: 16px;
  font-weight: 600;
  text-transform: uppercase;
  text-align: center;
  margin-bottom: 1.5rem;
  line-height: 1.3;
}

.modal-text {
  color: #e5eef7;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.6;
  text-align: center;
  margin-bottom: 2rem;
}

.modal-actions {
  display: flex;
  justify-content: center;
}

.btn {
  display: flex;
  padding: 12px 24px;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  background: #816bfa;
  color: #e5eef7;
  text-align: center;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  cursor: pointer;
  border: none;
  width: 100%;
  transition: background-color 0.2s;
}

.btn:hover {
  background: #9681fb;
}

.btn:active {
  background: #6c5bf8;
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}
</style> 
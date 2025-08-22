<template>
  <div class="confirm-modal-wrapper" @click.self="onCancel">
    <div class="confirm-modal">
      <h3 class="confirm-title">
        {{ languageStore.t("devicePage.modal.confirmDelete.title") }}
      </h3>
      <p class="confirm-message">
        {{ languageStore.t("devicePage.modal.confirmDelete.message") }}
      </p>
      <div class="confirm-actions">
        <button class="btn cancel" @click="onCancel">
          {{ languageStore.t("devicePage.modal.confirmDelete.cancel") }}
        </button>
        <button class="btn confirm" @click="onConfirm">
          {{ languageStore.t("devicePage.modal.confirmDelete.confirm") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useLanguageStore } from "@/stores/languageStore";

const languageStore = useLanguageStore();

const emit = defineEmits(['confirm', 'cancel']);

const onConfirm = () => {
  emit('confirm');
};

const onCancel = () => {
  emit('cancel');
};
</script>

<style scoped>
.confirm-modal-wrapper {
  display: grid;
  place-content: center;
  position: fixed;
  padding: 0 2rem;
  bottom: 0;
  top: 0;
  left: 0;
  right: 0;
  z-index: 5;
  backdrop-filter: blur(4px);
  background-color: rgba(0, 0, 0, 0.4);
}

.confirm-modal {
  background-color: #1e1d21;
  padding: 1.6rem;
  border-radius: 4px;
  width: 100%;
  color: #fff;
  border: 1px #816bfa solid;
  font-family: Arial, sans-serif;
}

.confirm-title {
  color: #a6aab2;
  font-size: 14px;
  margin-bottom: 1.4rem;
  font-weight: 600;
  text-align: center;
  text-transform: uppercase;
}

.confirm-message {
  color: #e5eef7;
  font-size: 12px;
  text-align: center;
  margin-bottom: 1.6rem;
}

.confirm-actions {
  display: flex;
  justify-content: space-between;
  gap: 0.8rem;
}

.btn {
  padding: 8px 10px;
  font-size: 1.2rem;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
  font-weight: 500;
  width: 100%;
  border: 1px solid #2b2b36;
  color: #a6aab2;
  background: #2b2b36;
}

.btn.cancel:hover {
  background-color: #394952;
  color: #a6aab2;
}

.btn.confirm:hover {
  background-color: #394952;
  color: #d49af7;
}
</style> 
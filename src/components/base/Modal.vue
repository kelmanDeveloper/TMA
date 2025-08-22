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
  <div class="modal-wrapper">
    <div class="modal animate-fadeIn">
      <button class="close-btn" @click="closeModal">✖</button>
      <h3 class="modal-title">
        {{ languageStore.t('baseComponents.energyModal.title') }}
      </h3>
      <p>
        {{ languageStore.t('baseComponents.energyModal.text') }}
      </p>

      <div class="modal-actions">
        <RouterLink to="/invite" class="btn activate">
        {{ languageStore.t('baseComponents.energyModal.invite') }}

        </RouterLink>
        <RouterLink to="/devices" class="btn activate">
        {{ languageStore.t('baseComponents.energyModal.device') }}

        </RouterLink>
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
  z-index: 3;
  backdrop-filter: blur(4px);
  background-color: rgba(0, 0, 0, 0.4);
}

.modal {
  background-color: #1b1533;
  padding: 1.6rem;
  padding-top: 4rem;
  position: relative;
  border-radius: 4px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
  width: 300px;
  color: #fff;
  border: 1px #57b6e2 solid;
  box-shadow: 0px 2px 5px #8F31BC;
  font-family: 'WixMadeforDisplay', sans-serif;
  animation: fadeIn 0.3s ease-out; /* Применение анимации появления */
}

.modal-title {
  color: #6da1dc;
  font-size: 13.5px;
  font-family: Montserrat;
  font-weight: 600;
  text-transform: uppercase;
  line-height: 20px;
  margin-bottom: 1.2rem;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  gap: 1.2rem;
  margin-top: 3rem;
}

.btn {
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
  width: 100%;
  color: #fff;
  font-size: 1rem;
  font-weight: 500;
  text-transform: uppercase;
  line-height: 14px;
}

.btn.activate {
  background-color: #603c94;
  border: none;
}

.btn.activate:hover {
  background-color: #754cae;
}

.close-btn {
  font-size: 18px;
  position: absolute;
  right: 1.5rem;
  top: 1rem;
}

p {
  color: white;
  font-size: 11px;
  font-family: Montserrat;
  font-weight: 500;
  line-height: 20px;
}

/* Класс для анимации появления */
.animate-fadeIn {
  animation: fadeIn 0.1s ease-out;
}
</style>

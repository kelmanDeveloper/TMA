<template>
  <div v-if="isVisible" class="alert-wrapper">
    <div class="alert">
      <div v-if="typeModal">
        <h1>
          {{ languageStore.t("baseComponents.baseModal.openLinkError.title") }}
        </h1>
        <p>
          {{ languageStore.t("baseComponents.baseModal.openLinkError.subtitle") }}
        </p>
      </div>

      <div v-else>
        <h1>
        {{ languageStore.t("baseComponents.baseModal.authError.title") }}
        </h1>
        <p>
        {{ languageStore.t("baseComponents.baseModal.authError.subtitle") }}
        </p>
      </div>

      <button v-if="typeModal" @click="isVisible = false">
        {{ languageStore.t("baseComponents.baseModal.openLinkError.btn") }}
      </button>
      <button v-else @click="reload">
        {{ languageStore.t("baseComponents.baseModal.authError.btn") }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useLanguageStore } from "@/stores/languageStore";

const languageStore = useLanguageStore();
const isVisible = ref(false);
const typeModal = ref(false);
const route = useRoute();
const router = useRouter();

const showBaseModal = (type) => {
  typeModal.value = type; // Записываем переданный аргумент
  isVisible.value = true;
};

const reload = () => {
  isVisible.value = false;
  if (route.path !== "/") {
    router.push("/");
  } else {
    window.location.reload();
  }
};

// Экспортируем функцию для вызова модального окна
defineExpose({ showBaseModal });
</script>
  
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
.alert-wrapper {
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
  .alert {
    display: inline-flex;
    padding: 3rem 2.5rem 2.5rem 2.5rem;
    flex-direction: column;
    align-items: center;
    gap: 2.5rem;
    border-radius: 8px;
    border: 1px solid #2b2b36;
    background: #1e1d21;
    animation: fadeIn 0.3s ease-out; /* Применение анимации появления */
    div {
      display: grid;
      gap: 1rem;
      h1 {
        color: #b5a4ff;
        text-align: center;
        line-height: 20px;
        font-size: 17px;
        font-weight: 500;
        text-wrap: pretty;
        width: 80%;
        margin: 0 auto;
        text-transform: uppercase;
      }
      p {
        color: #e5eef7;
        text-align: center;
        font-size: 11px;
        font-weight: 500;
        line-height: 20px;
      }
    }
    button {
      display: flex;
      width: 100%;
      padding: 16px 32px;
      justify-content: center;
      align-items: center;
      border-radius: 11px;
      background: #816bfa;
      color: #e5eef7;
      text-align: center;
      font-size: 12px;
      font-weight: 500;
      text-transform: uppercase;
    }
  }
}
</style>
  
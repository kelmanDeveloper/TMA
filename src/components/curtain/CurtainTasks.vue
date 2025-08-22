<script setup>
import WarningIcon from "@/components/icons/WarningIcon.vue";
import LuckyCoin from "@/components/icons/LuckyCoin.vue";
import MainButton from "@/components/base/MainButton.vue";
import { useCurtainStore } from '@/stores/curtain';
import { ref, watch } from 'vue';
import { useLanguageStore } from "@/stores/languageStore";

const languageStore = useLanguageStore();

const curtainStore = useCurtainStore();
const currentTask = ref(null);

// Наблюдаем за изменением текущего задания
watch(
  () => curtainStore.currentTask,
  (newTask) => {
    currentTask.value = newTask; // Обновляем реактивное значение
  },
  { immediate: true } // Запуск watch сразу
);
</script>

<template>
  <div class="curtain_inner_tasks" v-if="currentTask">
    <div class="curtain_inner_tasks-bottom">
      <p class="logo">
        <WarningIcon />
      </p>
      <p class="title">{{ currentTask?.title }}</p>
      <div class="reward"><LuckyCoin /> +{{ currentTask?.reward }}</div>
      <MainButton v-haptic-heavy msg="подписаться" />
      <MainButton v-haptic-heavy class="custom_styles-button" msg="проверить" />
    </div>
  </div>
</template>






<style scoped>
.curtain_inner_tasks {
  text-align: end;
  height: 100%;
  width: 100%;
  padding-top: 5rem;  

  .curtain_inner_tasks-bottom {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 2rem;
  }

  .logo {
    margin-bottom: 4rem;
  }

  .title {
    color: var(--color-white);
    font-size: var(--size-18);
    text-align: center;
    font-weight: var(--medium);
    text-transform: uppercase;
    margin-bottom: 1rem;
  }

  .reward {
    color: var(--color-white);
    font-size: var(--size-24);
    font-weight: var(--semibold);
    text-transform: uppercase;
    margin-bottom: 3rem;
  }

  .custom_styles-button {
    margin-top: 1rem;
    background: transparent !important;
    outline: 1px solid #816BFA !important;
  }
}
</style>
<template>
  <main class="settings-name">
    <Modal
      v-if="isModal"
      @close="isModal = false"
      @change-language="handleLanguageChange"
      :current-language="languageStore.currentLanguage"
      :t="languageStore.t"
    />
    <MainTitle :msg="languageStore.t('settingsPage.title')" />
    <SettingsItem
      @click="isModal = true"
      :current-language="languageStore.currentLanguage"
      :t="languageStore.t"
    />
  </main>
</template>

<script setup>
import { ref } from "vue";
import MainTitle from "@/components/base/MainTitle.vue";
import SettingsItem from "@/components/settings/SettingsItem.vue";
import Modal from "@/components/settings/Modal.vue";
import { useLanguageStore } from "@/stores/languageStore";
const languageStore = useLanguageStore();
const isModal = ref(false);

// Обработчик изменения языка
const handleLanguageChange = (newLanguage) => {
  languageStore.setLanguage(newLanguage); // Обновляем язык в хранилище
};
</script>

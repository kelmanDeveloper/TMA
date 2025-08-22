// stores/languageStore.js
import { defineStore } from "pinia";

// Импортируем языковой файл
import translations from "@/assets/json/lang.json";

export const useLanguageStore = defineStore("language", {
  state: () => ({
    // Устанавливаем язык из localStorage или по умолчанию "ru"
    currentLanguage: localStorage.getItem("language") || window.Telegram.WebApp.initDataUnsafe?.user?.language_code || "ru",
    translations, // Используем импортированный JSON
  }),
  getters: {
    // Получение перевода по ключу
    t: (state) => (key, lang = state.currentLanguage) => {
        const keys = key.split(".");
        return keys.reduce(
          (obj, k) => (obj && obj[k] !== undefined ? obj[k] : null),
          state.translations[lang]
        ) || key;
      },
    // Получение текущего языка для отображения
    currentLanguageLabel(state) {
      return (
        state.translations[state.currentLanguage]?.settingsPage?.modal?.language || ""
      );
    },
  },
  actions: {
    setLanguage(languageCode) {
      // Сохраняем язык в state и localStorage
      this.currentLanguage = languageCode;
      localStorage.setItem("language", languageCode);
    },
  },
});
